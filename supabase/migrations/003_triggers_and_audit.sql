-- StatVidya: Database Triggers & Audit Logging
-- Created: 2026-09-05
-- This migration sets up automatic audit trail recording for critical operations

-- ============================================================================
-- AUDIT TRIGGER FUNCTION (Generic)
-- ============================================================================

CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    details
  ) VALUES (
    COALESCE(NEW.organization_id, OLD.organization_id),
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'old', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
      'new', CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
      'timestamp', NOW()
    )
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- AUDIT TRIGGERS ON CRITICAL TABLES
-- ============================================================================

-- Assessment Results: Every submission must be logged
CREATE TRIGGER audit_assessment_results
  AFTER INSERT ON assessment_results
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Questions: Track generation, approval, rejection
CREATE TRIGGER audit_questions
  AFTER INSERT OR UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Training Priorities: Track admin write-back actions
CREATE TRIGGER audit_training_priorities
  AFTER INSERT OR UPDATE ON training_priorities
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Competency Records: Track competency level changes
CREATE TRIGGER audit_competency_records
  AFTER INSERT OR UPDATE ON competency_records
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Course Enrollments: Track learning pathways
CREATE TRIGGER audit_course_enrollments
  AFTER INSERT OR UPDATE ON course_enrollments
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- ============================================================================
-- TIMESTAMP UPDATE TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_last_active
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- HELPER FUNCTION: Compute Competency Readiness Index
-- ============================================================================

CREATE OR REPLACE FUNCTION compute_readiness_index(
  p_user_id UUID,
  p_org_id UUID
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  v_total_required INTEGER;
  v_met_count INTEGER;
  v_readiness_percent DECIMAL(5,2);
BEGIN
  -- Get all competencies required for this user's selected role's activities
  SELECT COUNT(DISTINCT ac.competency_id)
  INTO v_total_required
  FROM activity_competencies ac
  JOIN activities a ON ac.activity_id = a.id
  WHERE a.role_id = (SELECT selected_role_id FROM users WHERE id = p_user_id AND organization_id = p_org_id);

  IF v_total_required = 0 THEN
    RETURN 0.00;
  END IF;

  -- Count how many competencies meet or exceed target level
  SELECT COUNT(*)
  INTO v_met_count
  FROM competency_records cr
  JOIN activity_competencies ac ON cr.competency_id = ac.competency_id
  JOIN activities a ON ac.activity_id = a.id
  WHERE cr.user_id = p_user_id
    AND cr.organization_id = p_org_id
    AND a.role_id = (SELECT selected_role_id FROM users WHERE id = p_user_id AND organization_id = p_org_id)
    AND cr.current_level >= ac.target_level;

  v_readiness_percent := ROUND((v_met_count::DECIMAL / v_total_required::DECIMAL) * 100, 2);
  RETURN v_readiness_percent;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- HELPER FUNCTION: Get Gap Severity
-- ============================================================================

CREATE OR REPLACE FUNCTION compute_gap_severity(
  p_current_level INTEGER,
  p_target_level INTEGER,
  p_priority activity_priority
)
RETURNS TEXT AS $$
DECLARE
  v_gap INTEGER;
  v_priority_weight INTEGER;
  v_severity_score INTEGER;
BEGIN
  v_gap := p_target_level - p_current_level;

  IF v_gap <= 0 THEN
    RETURN 'PROFICIENT';
  END IF;

  -- Priority weights: critical=3, important=2, desirable=1
  v_priority_weight := CASE p_priority
    WHEN 'critical' THEN 3
    WHEN 'important' THEN 2
    ELSE 1
  END;

  v_severity_score := v_gap * v_priority_weight;

  -- Severity buckets
  IF v_severity_score >= 4 THEN
    RETURN 'HIGH';
  ELSIF v_severity_score >= 2 THEN
    RETURN 'MODERATE';
  ELSE
    RETURN 'PROFICIENT';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- HELPER FUNCTION: Update Competency on Assessment Completion
-- This is called by the Edge Function after assessment grading
-- ============================================================================

CREATE OR REPLACE FUNCTION update_competency_from_assessment(
  p_user_id UUID,
  p_competency_id UUID,
  p_new_level INTEGER,
  p_org_id UUID,
  p_assessment_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Upsert competency record
  INSERT INTO competency_records (user_id, competency_id, current_level, evidence, organization_id, updated_at)
  VALUES (p_user_id, p_competency_id, p_new_level, p_assessment_id::TEXT, p_org_id, NOW())
  ON CONFLICT (user_id, competency_id)
  DO UPDATE SET
    current_level = EXCLUDED.current_level,
    evidence = EXCLUDED.evidence,
    updated_at = NOW();

  -- Insert into history for audit trail
  INSERT INTO competency_history (user_id, competency_id, level, source, organization_id, recorded_at)
  VALUES (p_user_id, p_competency_id, p_new_level, 'assessment', p_org_id, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- HELPER FUNCTION: Get Organization Config (with defaults)
-- ============================================================================

CREATE OR REPLACE FUNCTION get_org_config(
  p_org_id UUID,
  p_key TEXT,
  p_default TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  v_value TEXT;
BEGIN
  SELECT config ->> p_key INTO v_value FROM organizations WHERE id = p_org_id;
  RETURN COALESCE(v_value, p_default);
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- STORED PROCEDURE: Submit Assessment & Update Competencies
-- Called by Supabase Edge Function after validation
-- ============================================================================

CREATE OR REPLACE FUNCTION submit_assessment_result(
  p_local_id UUID,
  p_user_id UUID,
  p_assessment_id UUID,
  p_answers JSONB,
  p_score INTEGER,
  p_competency_levels JSONB,
  p_organization_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- 1. Check idempotency: don't double-process
  IF EXISTS (SELECT 1 FROM assessment_results WHERE local_id = p_local_id) THEN
    RETURN;
  END IF;

  -- 2. Insert assessment result (this triggers audit_assessment_results)
  INSERT INTO assessment_results (
    local_id,
    user_id,
    assessment_id,
    answers,
    score,
    organization_id,
    completed_at
  ) VALUES (
    p_local_id,
    p_user_id,
    p_assessment_id,
    p_answers,
    p_score,
    p_organization_id,
    NOW()
  );

  -- 3. Update competency records for each competency in the result
  -- p_competency_levels is a JSONB array like:
  -- [{"competency_id": "...", "level": 3}, ...]
  INSERT INTO competency_records (user_id, competency_id, current_level, evidence, organization_id, updated_at)
  SELECT
    p_user_id,
    (entry->>'competency_id')::UUID,
    (entry->>'level')::INTEGER,
    (SELECT id::TEXT FROM assessment_results WHERE local_id = p_local_id),
    p_organization_id,
    NOW()
  FROM jsonb_array_elements(p_competency_levels) AS entry
  ON CONFLICT (user_id, competency_id)
  DO UPDATE SET
    current_level = EXCLUDED.current_level,
    evidence = EXCLUDED.evidence,
    updated_at = NOW();

  -- 4. Insert into history for audit trail
  INSERT INTO competency_history (user_id, competency_id, level, source, organization_id, recorded_at)
  SELECT
    p_user_id,
    (entry->>'competency_id')::UUID,
    (entry->>'level')::INTEGER,
    'assessment',
    p_organization_id,
    NOW()
  FROM jsonb_array_elements(p_competency_levels) AS entry;

  -- Audit trigger will automatically log this transaction
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INDEXES FOR PERFORMANCE (in addition to FK indexes)
-- ============================================================================

CREATE INDEX idx_questions_org_status ON questions(organization_id, status);
CREATE INDEX idx_questions_org_confidence ON questions(organization_id, confidence);
CREATE INDEX idx_assessment_results_score ON assessment_results(score);
CREATE INDEX idx_competency_records_level ON competency_records(current_level);
CREATE INDEX idx_users_org_role ON users(organization_id, role);
