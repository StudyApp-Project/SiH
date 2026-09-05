-- StatVidya: Initial Schema with FRAC Domain Model
-- Created: 2026-09-05
-- This migration creates all core tables, enums, foreign keys, and constraints

-- ============================================================================
-- ENUMS: Provenance, Role Types, Competency Categories, Priority Levels
-- ============================================================================

CREATE TYPE provenance_type AS ENUM (
  'VERIFIED_OFFICIAL',
  'PROPOSED_FRAMEWORK',
  'PROPOSED_METHODOLOGY',
  'SYNTHETIC_DEMO_DATA'
);

CREATE TYPE user_role AS ENUM ('learner', 'trainer', 'admin');

CREATE TYPE competency_category AS ENUM ('Behavioural', 'Functional', 'Domain');

CREATE TYPE activity_priority AS ENUM ('critical', 'important', 'desirable');

CREATE TYPE question_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE question_confidence AS ENUM ('high', 'medium', 'low');

CREATE TYPE document_status AS ENUM ('uploaded', 'extracting', 'extracted', 'ready', 'error');

CREATE TYPE assessment_type AS ENUM ('diagnostic', 'topic', 'post_training');

CREATE TYPE course_provider AS ENUM ('igot', 'nssta', 'tpac', 'external');

CREATE TYPE enrollment_status AS ENUM ('enrolled', 'in_progress', 'completed');

-- ============================================================================
-- ORGANIZATIONS & USERS
-- ============================================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  ministry TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'learner',
  department TEXT,
  designation TEXT,
  cadre TEXT,
  employee_id TEXT,
  selected_role_id UUID,
  preferred_language TEXT DEFAULT 'en',
  theme_preference TEXT DEFAULT 'system',
  parichay_id TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- FRAC DOMAIN MODEL: Roles, Activities, Competencies
-- ============================================================================

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_hi TEXT,
  cadre TEXT NOT NULL,
  department TEXT,
  provenance provenance_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_hi TEXT,
  description TEXT,
  provenance provenance_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_hi TEXT,
  category competency_category NOT NULL,
  description TEXT,
  description_hi TEXT,
  levels JSONB NOT NULL DEFAULT '{"L1": "", "L2": "", "L3": "", "L4": "", "L5": ""}',
  provenance provenance_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activity_competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  target_level INTEGER NOT NULL CHECK (target_level BETWEEN 1 AND 5),
  priority activity_priority NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, competency_id)
);

CREATE INDEX idx_activities_role ON activities(role_id);
CREATE INDEX idx_activity_competencies_competency ON activity_competencies(competency_id);

-- ============================================================================
-- COMPETENCY RECORDS & HISTORY (User's Competency State)
-- ============================================================================

CREATE TABLE competency_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  current_level INTEGER NOT NULL CHECK (current_level BETWEEN 1 AND 5),
  evidence TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, competency_id)
);

CREATE TABLE competency_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
  source TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_competency_records_user ON competency_records(user_id);
CREATE INDEX idx_competency_records_org ON competency_records(organization_id);
CREATE INDEX idx_competency_history_user ON competency_history(user_id);
CREATE INDEX idx_competency_history_date ON competency_history(recorded_at DESC);

-- ============================================================================
-- DOCUMENTS (Uploaded Training Materials)
-- ============================================================================

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_type TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  storage_provider TEXT DEFAULT 'r2',
  file_size_bytes BIGINT,
  page_count INTEGER,
  status document_status NOT NULL DEFAULT 'uploaded',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_trainer ON documents(trainer_id);
CREATE INDEX idx_documents_org ON documents(organization_id);
CREATE INDEX idx_documents_status ON documents(status);

-- ============================================================================
-- QUESTIONS (MCQs Generated or Authored)
-- ============================================================================

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  stem TEXT NOT NULL,
  stem_hi TEXT,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  explanation TEXT,
  explanation_hi TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  confidence question_confidence,
  status question_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  source_ref TEXT,
  topic TEXT,
  ai_provider TEXT,
  prompt_version TEXT,
  flag_count INTEGER DEFAULT 0,
  error_rate DECIMAL(5,2),
  provenance provenance_type NOT NULL DEFAULT 'SYNTHETIC_DEMO_DATA',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_questions_competency ON questions(competency_id);
CREATE INDEX idx_questions_org ON questions(organization_id);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_confidence ON questions(confidence);

-- ============================================================================
-- ASSESSMENTS & RESULTS
-- ============================================================================

CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id UUID REFERENCES competencies(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type assessment_type NOT NULL,
  question_ids UUID[] NOT NULL,
  time_limit_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  topic_scores JSONB,
  triggered_by JSONB,
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assessment_results_user ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_org ON assessment_results(organization_id);
CREATE INDEX idx_assessment_results_date ON assessment_results(completed_at DESC);

-- ============================================================================
-- COURSES & ENROLLMENTS
-- ============================================================================

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_hi TEXT,
  provider course_provider NOT NULL,
  type TEXT DEFAULT 'online',
  duration_hours INTEGER,
  competency_ids UUID[],
  difficulty TEXT,
  prerequisites UUID[],
  description TEXT,
  description_hi TEXT,
  igot_url TEXT,
  karma_points INTEGER DEFAULT 0,
  provenance provenance_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  status enrollment_status NOT NULL DEFAULT 'enrolled',
  karma_points_earned INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_org ON course_enrollments(organization_id);

-- ============================================================================
-- ADMIN: Training Priorities & Audit Log
-- ============================================================================

CREATE TABLE training_priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  role_id UUID REFERENCES roles(id),
  reason TEXT,
  flagged_by UUID NOT NULL REFERENCES users(id),
  flagged_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id)
);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  prompt_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_org ON audit_log(organization_id);
CREATE INDEX idx_audit_log_date ON audit_log(created_at DESC);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- ============================================================================
-- CONSTRAINTS & VALIDATIONS
-- ============================================================================

ALTER TABLE competencies ADD CONSTRAINT check_provenance_not_null CHECK (provenance IS NOT NULL);
ALTER TABLE roles ADD CONSTRAINT check_role_provenance_not_null CHECK (provenance IS NOT NULL);
ALTER TABLE activities ADD CONSTRAINT check_activity_provenance_not_null CHECK (provenance IS NOT NULL);
ALTER TABLE courses ADD CONSTRAINT check_course_provenance_not_null CHECK (provenance IS NOT NULL);
ALTER TABLE questions ADD CONSTRAINT check_question_provenance_not_null CHECK (provenance IS NOT NULL);

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'organization_id')::UUID,
    (SELECT organization_id FROM public.users WHERE id = auth.uid() LIMIT 1)
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    (SELECT role::TEXT FROM public.users WHERE id = auth.uid() LIMIT 1)
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Enable realtime for tables that need it
ALTER PUBLICATION supabase_realtime ADD TABLE competency_records;
ALTER PUBLICATION supabase_realtime ADD TABLE assessment_results;
ALTER PUBLICATION supabase_realtime ADD TABLE training_priorities;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
