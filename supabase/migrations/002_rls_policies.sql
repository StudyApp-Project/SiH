-- StatVidya: Row Level Security Policies
-- Created: 2026-09-05
-- This migration enforces multi-tenant isolation at the database level

-- ============================================================================
-- ORGANIZATIONS: Only admins can read their org metadata
-- ============================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_read_own"
  ON organizations FOR SELECT TO authenticated
  USING (id = get_user_org_id());

-- ============================================================================
-- USERS: Read members within org; update own profile only
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_within_org"
  ON users FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());

CREATE POLICY "users_update_own_profile"
  ON users FOR UPDATE TO authenticated
  USING (id = auth.uid() AND organization_id = get_user_org_id())
  WITH CHECK (id = auth.uid() AND organization_id = get_user_org_id());

-- ============================================================================
-- ROLES, ACTIVITIES, COMPETENCIES: Read-only (admin-seeded)
-- ============================================================================

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles_read_all" ON roles FOR SELECT TO authenticated USING (true);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activities_read_all" ON activities FOR SELECT TO authenticated USING (true);

ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "competencies_read_all" ON competencies FOR SELECT TO authenticated USING (true);

ALTER TABLE activity_competencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_competencies_read_all" ON activity_competencies FOR SELECT TO authenticated USING (true);

-- ============================================================================
-- COMPETENCY RECORDS: User reads own; admin reads org; NO client writes
-- ============================================================================

ALTER TABLE competency_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comp_read_own_or_admin"
  ON competency_records FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR (get_user_role() = 'admin' AND organization_id = get_user_org_id())
  );

-- Client cannot insert or update — only Edge Functions with service_role
CREATE POLICY "comp_deny_client_insert"
  ON competency_records FOR INSERT TO authenticated
  WITH CHECK (false);

CREATE POLICY "comp_deny_client_update"
  ON competency_records FOR UPDATE TO authenticated
  USING (false);

-- ============================================================================
-- COMPETENCY HISTORY: Same as competency_records
-- ============================================================================

ALTER TABLE competency_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comp_history_read_own_or_admin"
  ON competency_history FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR (get_user_role() = 'admin' AND organization_id = get_user_org_id())
  );

CREATE POLICY "comp_history_deny_client_insert"
  ON competency_history FOR INSERT TO authenticated
  WITH CHECK (false);

-- ============================================================================
-- DOCUMENTS: Trainer creates; org can read; no deletes
-- ============================================================================

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "docs_read_own_org"
  ON documents FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());

CREATE POLICY "docs_insert_trainer_or_admin"
  ON documents FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = get_user_org_id()
    AND (get_user_role() = 'trainer' OR get_user_role() = 'admin')
  );

CREATE POLICY "docs_update_trainer_owner"
  ON documents FOR UPDATE TO authenticated
  USING (
    trainer_id = auth.uid()
    AND organization_id = get_user_org_id()
  );

-- ============================================================================
-- QUESTIONS: Trainer/admin can read/create within org; no direct updates to approved status
-- ============================================================================

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "questions_read_own_org"
  ON questions FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());

CREATE POLICY "questions_insert_trainer_or_admin"
  ON questions FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = get_user_org_id()
    AND (get_user_role() = 'trainer' OR get_user_role() = 'admin')
  );

CREATE POLICY "questions_update_trainer_or_admin"
  ON questions FOR UPDATE TO authenticated
  USING (
    organization_id = get_user_org_id()
    AND (get_user_role() = 'trainer' OR get_user_role() = 'admin')
  );

-- ============================================================================
-- ASSESSMENTS: Read within org; create by trainer/admin; immutable after creation
-- ============================================================================

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assessments_read_own_org"
  ON assessments FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());

CREATE POLICY "assessments_insert_trainer_or_admin"
  ON assessments FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = get_user_org_id()
    AND (get_user_role() = 'trainer' OR get_user_role() = 'admin')
  );

-- ============================================================================
-- ASSESSMENT RESULTS: Learner reads own; admin reads org; writes only via Edge Function
-- ============================================================================

ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "results_read_own_or_admin"
  ON assessment_results FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR (get_user_role() = 'admin' AND organization_id = get_user_org_id())
  );

-- Learners can submit results; only Edge Function updates/inserts the final score
CREATE POLICY "results_insert_own"
  ON assessment_results FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND organization_id = get_user_org_id());

-- Results are immutable once written
CREATE POLICY "results_deny_update"
  ON assessment_results FOR UPDATE TO authenticated
  USING (false);

-- ============================================================================
-- COURSES: Read-only (seeded); admin can manage
-- ============================================================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "courses_read_all"
  ON courses FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "courses_insert_admin"
  ON courses FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');

-- ============================================================================
-- COURSE ENROLLMENTS: User reads own; admin reads org; no deletes
-- ============================================================================

ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enrollments_read_own_or_admin"
  ON course_enrollments FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR (get_user_role() = 'admin' AND organization_id = get_user_org_id())
  );

CREATE POLICY "enrollments_insert_own"
  ON course_enrollments FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND organization_id = get_user_org_id());

CREATE POLICY "enrollments_update_own"
  ON course_enrollments FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND organization_id = get_user_org_id());

-- ============================================================================
-- TRAINING PRIORITIES: Only admins read/write within org
-- ============================================================================

ALTER TABLE training_priorities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "priorities_read_admin"
  ON training_priorities FOR SELECT TO authenticated
  USING (
    organization_id = get_user_org_id()
    AND get_user_role() = 'admin'
  );

CREATE POLICY "priorities_insert_admin"
  ON training_priorities FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = get_user_org_id()
    AND get_user_role() = 'admin'
  );

CREATE POLICY "priorities_update_admin"
  ON training_priorities FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id() AND get_user_role() = 'admin');

-- ============================================================================
-- AUDIT LOG: Append-only (no updates/deletes); admin can read
-- ============================================================================

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_read_admin"
  ON audit_log FOR SELECT TO authenticated
  USING (
    organization_id = get_user_org_id()
    AND get_user_role() = 'admin'
  );

CREATE POLICY "audit_insert_service_role"
  ON audit_log FOR INSERT TO service_role
  WITH CHECK (true);

-- No UPDATE or DELETE policies — audit log is immutable

-- ============================================================================
-- NOTIFICATIONS: User reads own; cannot modify
-- ============================================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifs_read_own"
  ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notifs_update_read_status"
  ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND id = id); -- Only mark read, don't change other fields
