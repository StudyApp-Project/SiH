-- StatVidya: Assessment Tables, Triggers & RLS Policies (Phase 4)
-- Created: 2026-09-05
-- This migration creates assessment_results, audit_log, and RLS policies
-- for Phase 4: Adaptive Assessment Engine & Offline Sync

-- ============================================================================
-- ASSESSMENT RESULTS TABLE
-- ============================================================================

CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID NOT NULL UNIQUE, -- Client-generated UUID (idempotency key)
  competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  final_level INTEGER NOT NULL CHECK (final_level BETWEEN 1 AND 5),
  answers JSONB NOT NULL, -- { question_id: answer_index }
  branch_path TEXT NOT NULL CHECK (branch_path IN ('L1', 'L2_L3', 'L3_L4', 'L5')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  provenance provenance_type NOT NULL DEFAULT 'VERIFIED_OFFICIAL',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, competency_id, local_id) -- Prevent duplicate submissions per user+competency
);

CREATE INDEX idx_assessment_results_user ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_competency ON assessment_results(competency_id);
CREATE INDEX idx_assessment_results_org ON assessment_results(organization_id);
CREATE INDEX idx_assessment_results_local_id ON assessment_results(local_id); -- For idempotency check
CREATE INDEX idx_assessment_results_submitted ON assessment_results(submitted_at DESC);

-- ============================================================================
-- AUDIT LOG TABLE (Append-Only, Immutable)
-- ============================================================================

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'ASSESSMENT_SUBMITTED', 'INSERT', 'UPDATE', 'DELETE'
  resource_type TEXT NOT NULL, -- 'assessment_result', 'question', 'competency_record', etc.
  resource_id UUID NOT NULL,
  metadata JSONB, -- { final_level, competency_id, branch_path, submitted_from: 'OFFLINE'|'ONLINE' }
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- NO UPDATE/DELETE permissions: append-only immutable log
);

CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp DESC);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_org ON audit_log(organization_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);

-- ============================================================================
-- ASSESSMENT SUBMISSION TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION audit_assessment_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-create audit_log entry when assessment_results is inserted
  INSERT INTO audit_log (
    user_id,
    organization_id,
    action,
    resource_type,
    resource_id,
    metadata
  ) VALUES (
    NEW.user_id,
    NEW.organization_id,
    'ASSESSMENT_SUBMITTED',
    'assessment_result',
    NEW.id,
    jsonb_build_object(
      'final_level', NEW.final_level,
      'competency_id', NEW.competency_id::text,
      'branch_path', NEW.branch_path,
      'local_id', NEW.local_id::text,
      'submitted_from', 'ONLINE' -- Will be set to 'OFFLINE' if submitted via queue
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_audit_assessment_submitted
  AFTER INSERT ON assessment_results
  FOR EACH ROW EXECUTE FUNCTION audit_assessment_submission();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on assessment_results
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Enable RLS on audit_log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ASSESSMENT RESULTS RLS POLICIES
-- ============================================================================

-- Policy 1: Users can view their own assessment results
CREATE POLICY "Users can view own assessment results"
  ON assessment_results
  FOR SELECT
  USING (
    user_id = auth.uid()
    AND organization_id = (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy 2: Users can insert their own assessment results
CREATE POLICY "Users can insert own assessment results"
  ON assessment_results
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND organization_id = (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy 3: Trainers can view assessment results for their organization
CREATE POLICY "Trainers can view org assessments"
  ON assessment_results
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
    AND (
      SELECT role FROM users WHERE id = auth.uid()
    ) IN ('trainer', 'admin')
  );

-- Policy 4: Admins can view all assessments in their org
CREATE POLICY "Admins can view all org assessments"
  ON assessment_results
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
    AND (
      SELECT role FROM users WHERE id = auth.uid()
    ) = 'admin'
  );

-- Policy 5: No direct UPDATE/DELETE on assessment_results (immutable after submission)
CREATE POLICY "No updates to assessment results"
  ON assessment_results
  FOR UPDATE
  USING (false);

CREATE POLICY "No deletes to assessment results"
  ON assessment_results
  FOR DELETE
  USING (false);

-- ============================================================================
-- AUDIT LOG RLS POLICIES
-- ============================================================================

-- Policy 1: Users can view audit logs for their own organization
CREATE POLICY "Users can view org audit logs"
  ON audit_log
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy 2: Audit log is append-only (insert via trigger only)
CREATE POLICY "No direct inserts to audit log"
  ON audit_log
  FOR INSERT
  USING (false);

-- Policy 3: No updates to audit log
CREATE POLICY "No updates to audit log"
  ON audit_log
  FOR UPDATE
  USING (false);

-- Policy 4: No deletes from audit log
CREATE POLICY "No deletes from audit log"
  ON audit_log
  FOR DELETE
  USING (false);

-- ============================================================================
-- HELPER FUNCTION: Verify Idempotency (Used by Edge Function)
-- ============================================================================

CREATE OR REPLACE FUNCTION check_assessment_idempotency(
  p_local_id UUID
)
RETURNS TABLE (
  found BOOLEAN,
  assessment_id UUID,
  final_level INTEGER,
  submitted_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    true AS found,
    id AS assessment_id,
    assessment_results.final_level,
    assessment_results.submitted_at
  FROM assessment_results
  WHERE local_id = p_local_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::INTEGER, NULL::TIMESTAMPTZ;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- HELPER FUNCTION: Get Assessment with Audit Trail
-- ============================================================================

CREATE OR REPLACE FUNCTION get_assessment_with_audit(
  p_assessment_id UUID
)
RETURNS TABLE (
  assessment_id UUID,
  local_id UUID,
  user_id UUID,
  competency_id UUID,
  final_level INTEGER,
  branch_path TEXT,
  submitted_at TIMESTAMPTZ,
  audit_timestamp TIMESTAMPTZ,
  audit_action TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ar.id,
    ar.local_id,
    ar.user_id,
    ar.competency_id,
    ar.final_level,
    ar.branch_path,
    ar.submitted_at,
    al.timestamp,
    al.action
  FROM assessment_results ar
  LEFT JOIN audit_log al ON al.resource_id = ar.id AND al.resource_type = 'assessment_result'
  WHERE ar.id = p_assessment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANTS: Ensure Users Can Execute Functions
-- ============================================================================

GRANT EXECUTE ON FUNCTION check_assessment_idempotency(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_assessment_with_audit(UUID) TO authenticated;
