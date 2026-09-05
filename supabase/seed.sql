-- StatVidya: FRAC Domain Model & Seed Data
-- Created: 2026-09-05
-- Official framework data for MoSPI/NSSTA statistical system
-- All data labeled with provenance badges per PRD §9.3

-- ============================================================================
-- INSERT ORGANIZATION (Demo)
-- ============================================================================

INSERT INTO organizations (id, name, code, ministry, config)
VALUES (
  'org-mospi-demo'::UUID,
  'MoSPI Demo Organization',
  'MOSPI-DEMO',
  'Ministry of Statistics and Programme Implementation',
  '{
    "severity_weights": {
      "critical": 3,
      "important": 2,
      "desirable": 1
    },
    "readiness_threshold": 0.70,
    "max_ai_requests_per_user_per_day": 100
  }'::jsonb
);

-- ============================================================================
-- ROLES (Government Cadres & Designations)
-- Source: MoSPI Cadre Rules, ISS/SSS/FOD designations
-- Provenance: VERIFIED_OFFICIAL (role names are real)
-- ============================================================================

INSERT INTO roles (id, name, name_hi, cadre, department, provenance)
VALUES
-- Indian Statistical Service (ISS)
('role-director'::UUID, 'Additional Director General', 'अतिरिक्त महानिदेशक', 'ISS', 'MoSPI', 'VERIFIED_OFFICIAL'),
('role-deputy-director'::UUID, 'Deputy Director', 'उप निदेशक', 'ISS', 'MoSPI', 'VERIFIED_OFFICIAL'),
('role-aso'::UUID, 'Assistant Statistical Officer', 'सहायक सांख्यिकीय अधिकारी', 'ISS', 'MoSPI', 'VERIFIED_OFFICIAL'),

-- Subordinate Statistical Service (SSS)
('role-sso'::UUID, 'Senior Statistical Officer', 'वरिष्ठ सांख्यिकीय अधिकारी', 'SSS', 'NSSO', 'VERIFIED_OFFICIAL'),
('role-jso'::UUID, 'Junior Statistical Officer', 'कनिष्ठ सांख्यिकीय अधिकारी', 'SSS', 'NSSO', 'VERIFIED_OFFICIAL'),

-- Field Operations Division (FOD)
('role-field-investigator'::UUID, 'Field Investigator', 'क्षेत्र अन्वेषक', 'FOD', 'NSSO', 'VERIFIED_OFFICIAL'),
('role-primary-enumerator'::UUID, 'Primary Enumerator', 'प्राथमिक गणक', 'FOD', 'NSSO', 'VERIFIED_OFFICIAL'),

-- NSSTA
('role-nssta-faculty'::UUID, 'Faculty Member', 'संकाय सदस्य', 'NSSTA', 'NSSTA', 'VERIFIED_OFFICIAL');

-- ============================================================================
-- COMPETENCIES (FRAC-Aligned)
-- Three categories: Behavioural, Functional, Domain
-- Provenance: PROPOSED_FRAMEWORK (structure is FRAC; specific competencies are our proposal)
-- ============================================================================

-- BEHAVIOURAL Competencies (Cross-government)
INSERT INTO competencies (
  id, name, name_hi, category, description, description_hi, levels, provenance
) VALUES
('comp-comm'::UUID, 'Communication & Reporting', 'संचार और रिपोर्टिंग', 'Behavioural',
  'Ability to communicate statistical findings clearly to diverse audiences, including policymakers, media, and the public.',
  'विविध दर्शकों को सांख्यिकीय निष्कर्षों को स्पष्ट रूप से संप्रेषित करने की क्षमता।',
  '{
    "L1": "Can present data in basic formats; limited audience engagement",
    "L2": "Comfortable communicating to specific stakeholder groups; clear written reports",
    "L3": "Tailors communication to audience; manages public-facing statistical releases",
    "L4": "Leads high-stakes communication; media training; policymaker briefings",
    "L5": "Sets institutional communication standards; national media presence"
  }'::jsonb, 'PROPOSED_FRAMEWORK'),

('comp-ethics'::UUID, 'Statistical Ethics & Integrity', 'सांख्यिकीय नैतिकता और सत्यनिष्ठा', 'Behavioural',
  'Adherence to professional statistical standards, confidentiality protocols, and ethical data handling per ISI Code of Ethics.',
  'व्यावसायिक सांख्यिकीय मानकों, गोपनीयता प्रोटोकॉल, और नैतिक डेटा प्रबंधन का अनुपालन।',
  '{
    "L1": "Aware of basic confidentiality rules; follows written guidelines",
    "L2": "Actively maintains respondent confidentiality; spots ethical issues",
    "L3": "Mentors others on confidentiality; conducts ethics reviews",
    "L4": "Shapes institutional ethics policies; leads ethics committees",
    "L5": "National thought leader on statistical ethics"
  }'::jsonb, 'PROPOSED_FRAMEWORK'),

('comp-teamwork'::UUID, 'Teamwork & Collaboration', 'टीमवर्क और सहयोग', 'Behavioural',
  'Ability to work effectively in cross-functional teams, especially between field and HQ divisions.',
  'क्षेत्र और मुख्यालय विभागों के बीच बहु-कार्यात्मक टीमों में प्रभावी ढंग से काम करने की क्षमता।',
  '{
    "L1": "Works independently; minimal collaboration",
    "L2": "Participates in team projects; shares information clearly",
    "L3": "Actively facilitates inter-departmental coordination",
    "L4": "Leads cross-functional working groups",
    "L5": "Builds institutional collaboration networks"
  }'::jsonb, 'PROPOSED_FRAMEWORK');

-- FUNCTIONAL Competencies (Statistical Role-Family)
INSERT INTO competencies (
  id, name, name_hi, category, description, description_hi, levels, provenance
) VALUES
('comp-survey-design'::UUID, 'Survey Sampling & Design', 'सर्वेक्षण प्रतिचयन और डिजाइन', 'Functional',
  'Design and execution of multi-stage stratified sample surveys; FSU/USU allocation; listing and enumeration procedures.',
  'बहु-स्तरीय स्तरीकृत नमूना सर्वेक्षण का डिजाइन और निष्पादन।',
  '{
    "L1": "Understands basic sampling concepts; follows HQ protocols",
    "L2": "Executes standard sampling designs under supervision; troubleshoots field issues",
    "L3": "Independently manages complex sampling designs; trains field staff",
    "L4": "Designs novel survey methodologies; optimizes for national surveys",
    "L5": "Sets sampling standards for MoSPI; international statistical contributions"
  }'::jsonb, 'PROPOSED_FRAMEWORK'),

('comp-data-validation'::UUID, 'Data Entry & Scrutiny', 'डेटा प्रविष्टि और जांच', 'Functional',
  'CAPI tablet data entry; unit-level scrutiny; outlier detection; consistency checks per Schedule structures.',
  'यूनिट-स्तरीय जांच, आउटलायर पहचान, और स्थिरता जांच।',
  '{
    "L1": "Performs basic data entry and simple checks",
    "L2": "Conducts systematic scrutiny; identifies common errors",
    "L3": "Manages schedule-specific validation; flags complex anomalies",
    "L4": "Designs scrutiny protocols; supervises data teams",
    "L5": "Sets national data quality standards"
  }'::jsonb, 'PROPOSED_FRAMEWORK'),

('comp-estimation'::UUID, 'Statistical Estimation & Analysis', 'सांख्यिकीय अनुमान और विश्लेषण', 'Functional',
  'Variance estimation; expansion of survey results to population; multi-stage estimation formulas.',
  'सर्वेक्षण परिणामों का विस्तार; बहु-स्तरीय अनुमान सूत्र।',
  '{
    "L1": "Understands estimation principles; applies standard formulas",
    "L2": "Calculates variance; expands samples to populations",
    "L3": "Develops complex estimation strategies; handles missing data",
    "L4": "Leads estimation methodology for national surveys",
    "L5": "Pioneers new estimation techniques"
  }'::jsonb, 'PROPOSED_FRAMEWORK'),

('comp-data-management'::UUID, 'Data Management & Databases', 'डेटा प्रबंधन और डेटाबेस', 'Functional',
  'Database design; data warehousing; metadata management; CAPI systems administration.',
  'डेटाबेस डिजाइन, डेटा वेयरहाउसिंग, मेटाडेटा प्रबंधन।',
  '{
    "L1": "Basic database queries; follows procedures",
    "L2": "Manages data imports; simple schema design",
    "L3": "Designs databases; optimizes query performance",
    "L4": "Leads data infrastructure projects",
    "L5": "Architect for national statistical data systems"
  }'::jsonb, 'PROPOSED_FRAMEWORK');

-- DOMAIN Competencies (Statistical System Specific)
INSERT INTO competencies (
  id, name, name_hi, category, description, description_hi, levels, provenance
) VALUES
('comp-nsso-protocols'::UUID, 'NSSO Protocol Mastery', 'एनएसएसओ प्रोटोकॉल दक्षता', 'Domain',
  'Deep knowledge of NSSO operational manuals, schedule structures, and official procedures.',
  'एनएसएसओ परिचालन मैनुअल, अनुसूची संरचना, और आधिकारिक प्रक्रियाओं का गहन ज्ञान।',
  '{
    "L1": "Familiar with core NSSO procedures; refers to manuals frequently",
    "L2": "Confidently applies NSSO protocols in standard situations",
    "L3": "Advises on protocol interpretation; handles edge cases",
    "L4": "Updates and teaches NSSO protocols",
    "L5": "Shapes NSSO policy and procedures"
  }'::jsonb, 'PROPOSED_FRAMEWORK'),

('comp-python-stats'::UUID, 'Python for Statistical Analysis', 'सांख्यिकीय विश्लेषण के लिए पायथन', 'Domain',
  'Proficiency in Python (pandas, NumPy, SciPy) for data manipulation, analysis, and statistical computation.',
  'डेटा हेराफेरी, विश्लेषण, और सांख्यिकीय गणना के लिए पायथन दक्षता।',
  '{
    "L1": "Basic Python syntax; simple scripts",
    "L2": "Comfortable with pandas and NumPy for data tasks",
    "L3": "Complex statistical workflows; custom functions",
    "L4": "Develops production statistical pipelines",
    "L5": "Advanced data science methodology"
  }'::jsonb, 'PROPOSED_FRAMEWORK'),

('comp-capi-tablet'::UUID, 'CAPI Tablet Operation', 'सीएपीआई टैबलेट ऑपरेशन', 'Domain',
  'Field operation of CAPI tablets for household surveys; data entry validation; offline sync; field troubleshooting.',
  'परिवार सर्वेक्षण के लिए सीएपीआई टैबलेट का क्षेत्र संचालन।',
  '{
    "L1": "Can turn on and follow prompts; basic navigation",
    "L2": "Proficient CAPI user; troubleshoots common issues; completes surveys accurately",
    "L3": "Trains other enumerators; handles edge cases; optimizes data entry",
    "L4": "Field supervisor; leads CAPI rollouts; remote troubleshooting",
    "L5": "CAPI system design; customization; process improvement"
  }'::jsonb, 'PROPOSED_FRAMEWORK');

-- ============================================================================
-- ACTIVITIES (Work Functions) for Selected Roles
-- Link roles → activities → competencies
-- ============================================================================

-- Field Investigator activities
INSERT INTO activities (id, role_id, name, name_hi, description, provenance)
VALUES
('act-fi-1'::UUID, 'role-field-investigator'::UUID,
  'Household Listing & Census Enumeration', 'घरों की सूची बनाना और जनगणना गणना',
  'Conduct census boundary demarcation and household listing per Schedule 0.0.',
  'PROPOSED_FRAMEWORK'),
('act-fi-2'::UUID, 'role-field-investigator'::UUID,
  'CAPI Data Entry & Field Validation', 'सीएपीआई डेटा प्रविष्टि और क्षेत्र सत्यापन',
  'Conduct household survey and enter data on CAPI tablet with validation checks.',
  'PROPOSED_FRAMEWORK');

-- Junior Statistical Officer activities
INSERT INTO activities (id, role_id, name, name_hi, description, provenance)
VALUES
('act-jso-1'::UUID, 'role-jso'::UUID,
  'Schedule Scrutiny & Anomaly Detection', 'अनुसूची जांच और विसंगति पहचान',
  'Review field schedules and flag data anomalies, outliers, and inconsistencies.',
  'PROPOSED_FRAMEWORK'),
('act-jso-2'::UUID, 'role-jso'::UUID,
  'Unit-Level Data Processing', 'यूनिट-स्तरीय डेटा प्रसंस्करण',
  'Extract, validate, and aggregate unit-level survey data from field submissions.',
  'PROPOSED_FRAMEWORK');

-- NSSTA Faculty activities
INSERT INTO activities (id, role_id, name, name_hi, description, provenance)
VALUES
('act-nssta-1'::UUID, 'role-nssta-faculty'::UUID,
  'Training Material Curation', 'प्रशिक्षण सामग्री संग्रह',
  'Author and curate official training materials on statistical methods and protocols.',
  'PROPOSED_FRAMEWORK'),
('act-nssta-2'::UUID, 'role-nssta-faculty'::UUID,
  'Assessment Development', 'मूल्यांकन विकास',
  'Develop competency assessments aligned to FRAC competencies.',
  'PROPOSED_FRAMEWORK');

-- ============================================================================
-- ACTIVITY-COMPETENCY MAPPINGS (What competencies each activity requires)
-- ============================================================================

-- Field Investigator: Household Listing requires...
INSERT INTO activity_competencies (activity_id, competency_id, target_level, priority)
VALUES
('act-fi-1'::UUID, 'comp-nsso-protocols'::UUID, 3, 'critical'),
('act-fi-1'::UUID, 'comp-survey-design'::UUID, 2, 'important'),
('act-fi-1'::UUID, 'comp-teamwork'::UUID, 2, 'desirable');

-- Field Investigator: CAPI Data Entry requires...
INSERT INTO activity_competencies (activity_id, competency_id, target_level, priority)
VALUES
('act-fi-2'::UUID, 'comp-capi-tablet'::UUID, 4, 'critical'),
('act-fi-2'::UUID, 'comp-data-validation'::UUID, 2, 'important'),
('act-fi-2'::UUID, 'comp-comm'::UUID, 1, 'desirable');

-- JSO: Schedule Scrutiny requires...
INSERT INTO activity_competencies (activity_id, competency_id, target_level, priority)
VALUES
('act-jso-1'::UUID, 'comp-data-validation'::UUID, 4, 'critical'),
('act-jso-1'::UUID, 'comp-nsso-protocols'::UUID, 3, 'critical'),
('act-jso-1'::UUID, 'comp-python-stats'::UUID, 2, 'important');

-- JSO: Unit-Level Data Processing requires...
INSERT INTO activity_competencies (activity_id, competency_id, target_level, priority)
VALUES
('act-jso-2'::UUID, 'comp-estimation'::UUID, 3, 'critical'),
('act-jso-2'::UUID, 'comp-data-management'::UUID, 3, 'important'),
('act-jso-2'::UUID, 'comp-python-stats'::UUID, 3, 'important');

-- NSSTA: Training Material Curation requires...
INSERT INTO activity_competencies (activity_id, competency_id, target_level, priority)
VALUES
('act-nssta-1'::UUID, 'comp-comm'::UUID, 4, 'critical'),
('act-nssta-1'::UUID, 'comp-nsso-protocols'::UUID, 4, 'critical'),
('act-nssta-1'::UUID, 'comp-ethics'::UUID, 3, 'important');

-- NSSTA: Assessment Development requires...
INSERT INTO activity_competencies (activity_id, competency_id, target_level, priority)
VALUES
('act-nssta-2'::UUID, 'comp-survey-design'::UUID, 4, 'critical'),
('act-nssta-2'::UUID, 'comp-data-validation'::UUID, 3, 'important'),
('act-nssta-2'::UUID, 'comp-comm'::UUID, 3, 'important');

-- ============================================================================
-- COURSES (iGOT Integration - Mock Data)
-- Provenance: SYNTHETIC_DEMO_DATA (simulated for demonstration)
-- ============================================================================

INSERT INTO courses (id, title, title_hi, provider, type, duration_hours, competency_ids, difficulty, description, provenance)
VALUES
('course-sampling-101'::UUID,
  'Survey Sampling Fundamentals',
  'सर्वेक्षण प्रतिचयन बुनियादी',
  'igot', 'online', 12,
  ARRAY['comp-survey-design'::TEXT, 'comp-estimation'::TEXT],
  'beginner',
  'Introduction to multi-stage stratified sampling design for NSSO surveys.',
  'SYNTHETIC_DEMO_DATA'),

('course-capi-training'::UUID,
  'CAPI Tablet Operation for Field Investigators',
  'फील्ड जांचकर्ताओं के लिए सीएपीआई टैबलेट संचालन',
  'nssta', 'in-person', 2,
  ARRAY['comp-capi-tablet'::TEXT],
  'beginner',
  'Hands-on training for household survey data entry on CAPI tablets.',
  'SYNTHETIC_DEMO_DATA'),

('course-python-stats'::UUID,
  'Python for Statistical Analysis',
  'सांख्यिकीय विश्लेषण के लिए पायथन',
  'igot', 'online', 20,
  ARRAY['comp-python-stats'::TEXT, 'comp-data-management'::TEXT],
  'intermediate',
  'Comprehensive Python course for data manipulation and statistical computation.',
  'SYNTHETIC_DEMO_DATA');

-- ============================================================================
-- DEMO SEED USERS (will be created via auth in real deployment)
-- These are referenced in lib/demoPersonas.ts
-- ============================================================================

-- Users are created via Supabase Auth in the application layer
-- This seed data is informational only

-- Field Investigator: Sunita Devi (Hindi, offline-first)
-- Email: sunita.devi@mospi.gov.in
-- Role: learner, Cadre: FOD

-- JSO: Amit Sharma (English, desk officer)
-- Email: amit.sharma@mospi.gov.in
-- Role: learner, Cadre: SSS

-- Trainer: Dr. Priya Verma (English, NSSTA)
-- Email: priya.verma@nssta.gov.in
-- Role: trainer, Cadre: ISS

-- Admin: Rajesh Kumar (English, MoSPI HQ)
-- Email: rajesh.kumar@mospi.gov.in
-- Role: admin, Cadre: ISS

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Created:
-- - 1 Organization (MoSPI Demo)
-- - 7 Roles (ISS, SSS, FOD cadres)
-- - 8 Competencies (3 Behavioural, 2 Functional, 3 Domain)
-- - 6 Activities (work functions for Field Investigator, JSO, NSSTA)
-- - 13 Activity-Competency mappings with priority weights
-- - 3 Demo Courses (iGOT mock)
--
-- All data labeled with provenance badges per PRD §9.3
