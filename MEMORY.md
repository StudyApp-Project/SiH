# 🧠 Project Memory & Agent Execution Blueprint — EduWrap

> **CRITICAL DIRECTIVE FOR ALL AI AGENTS:**
>
> 1. Read this file **FIRST** before touching any code.
> 2. Read `IMPLEMENTATION_PLAN.md` for full architectural details, data schemas, and security rules.
> 3. Work on **ONE PHASE AT A TIME**. Do NOT skip ahead or implement multiple phases simultaneously.
> 4. After completing tasks, run the verification gates, update the checkboxes `[x]`, and append to the Session Log at the bottom.

---

## 🛑 1. Anti-Hallucination & Non-Negotiable Rules

To prevent common agent mistakes, adhere strictly to these locked constraints:

| #   | Rule                                                 | Why It Matters                                                                                                                                                                                                                                                                      |
| --- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **No Hardcoded AI Model Names**                      | Configure AI models via `GEMINI_MODEL` environment variable on the server-side Worker. Never hardcode `gemini-2.0-flash` or any specific version.                                                                                                                                   |
| 2   | **No AI Keys in Browser**                            | All AI requests route through Cloudflare Worker. Never expose API keys in frontend bundles.                                                                                                                                                                                         |
| 3   | **No Direct Client Writes to Competency Records**    | Learners cannot write to `competency_records/{uid}`. Only the trusted Worker evaluates assessments and writes competency changes. `assessment_results` are also Worker-only writes. _(Scaffolded in Phase 1 to prevent rule blocking)._                                             |
| 4   | **Multi-Tenancy (`organizationId`) Everywhere**      | Include `organizationId` in all domain records from Day 1. Firestore rules must scope queries by `resource.data.organizationId == userOrg()`.                                                                                                                                       |
| 5   | **FRAC Alignment**                                   | The data model mirrors the government's official **FRAC** (Framework of Roles, Activities and Competencies) methodology: `ROLE → ACTIVITY → COMPETENCY` three-construct mapping, with `Behavioural / Functional / Domain` categories. Do NOT invent a parallel competency taxonomy. |
| 6   | **Strict Provenance Labeling**                       | Label all domain data: `✅ VERIFIED OFFICIAL` (iGOT exists, FRAC methodology, ISS designations), `⚠️ PROPOSED FRAMEWORK` (our competencies, L1–L5 descriptors, scoring), `🟡 SYNTHETIC DEMO DATA` (mock employees, courses, MCQs, scores).                                          |
| 7   | **Self-Assessed vs Assessment-Verified Distinction** | Competency levels must visually distinguish 🛡️ assessment-verified from ✍️ self-assessed. Never treat self-reported levels as authoritative.                                                                                                                                        |
| 8   | **Tailwind CSS v4 Syntax**                           | Always use `bg-(--bg-elevated)`, `text-(--text-primary)`. **NEVER** use legacy `bg-[var(--...)]`.                                                                                                                                                                                   |
| 9   | **Preserve Deprecated Code**                         | Hide deprecated features (_Rooms, Doubts, Flashcards, Notes, Sandbox_) from navigation. Do **NOT** delete files without proper unhooking. These are the top scope-creep risk.                                                                                                       |
| 10  | **Firebase Storage First, R2 Later**                 | Firebase Storage is the **default** for document uploads during hackathon. R2 is the **stretch goal** (lower egress cost). Don't block progress waiting for R2 setup.                                                                                                               |
| 11  | **iGOT = DSEP Adapter & Deep Links**                 | Adhere to DSEP Protocol interface, simulate Karma Points tied to APAR, and provide deep links to live iGOT course catalog pages (`https://igotkarmayogi.gov.in/app/toc/...`).                                                                                                       |
| 12  | **Mandatory Verification Gate**                      | Before reporting a phase done: `npx eslint . --quiet` (0 errors), `npm run build` (clean), and `npm test` (100% pass).                                                                                                                                                              |
| 13  | **Single-Prompt Batch Generation**                   | Never send individual concurrent requests per question to Gemini. Batch 10–15 questions into a single structured prompt to stay within Gemini's 15 RPM free tier limit.                                                                                                             |
| 14  | **PDF Page Limit Protection**                        | Always enforce a 15-page limit or chapter selector during client-side PDF extraction to prevent browser tab memory freezing on 200-page MoSPI manuals.                                                                                                                              |

---

## 🔄 2. The Core Closed-Loop Engine (FRAC-Grounded)

Every feature must serve this competency loop, structured around the FRAC methodology:

```
Official Profile → FRAC Role Selection (JSO / SSO / Field Investigator) → Activity → Competency Mapping
    → Adaptive Diagnostic Assessment (Dynamic Difficulty Branching)
    → Skill Gap Matrix (priority-weighted by Activity criticality: Δ × priorityWeight)
    → Personalized Learning Pathways (iGOT Deep-Links & Karma Points)
    → Training Manual Ingestion → Trainer-Validated MCQ Generation (Confidence-Sorted)
    → Reassessment → Competency Level Promotion (🛡️ assessment-verified) → Repeat
```

**Gap severity formula** (FRAC-aware):
$$\text{severityScore} = (\text{targetLevel} - \text{currentLevel}) \times \text{priorityWeight}$$
where $\text{critical}=3, \text{important}=2, \text{desirable}=1$.  
A $\Delta=1$ gap on a _critical_ activity competency ranks above a $\Delta=2$ gap on a _desirable_ one.

---

## 📋 3. Master Interactive Checklist & Phase Roadmap

### ✅ Pre-Phase: Repository Cleanup & Quality Baseline

- [ ] Audit entire codebase and map all components, contexts, and services.
- [ ] Delete dead/scratch files (`test.html`, `vite.svg`, `react.svg`, `hero.png`, `public/icons.svg`).
- [ ] Remove hardcoded static demo PDFs (`public/pdfs/*`).
- [ ] Fix ESLint configuration and component effect issues (0 errors).
- [ ] Verify production build compiles clean (`npm run build`).
- [ ] Synchronize master plan to `IMPLEMENTATION_PLAN.md` and establish `MEMORY.md`.
- [ ] Incorporate FRAC alignment, AI assistant spec, iGOT research, data privacy posture, and governance items.
- [ ] Resolve all 15 audit loopholes from the SIH 26101 comprehensive review.

---

### 🟡 PHASE 1 — Foundation, Domain Model & Cloud Infrastructure (CURRENT FOCUS)

> **Goal**: Establish the FRAC domain models, Cloudflare Pages hosting, Cloudflare Worker scaffolding, security boundary, user schema, and role-based navigation.

- [ ] **1.1 Configuration & Frontend Deployment**:
  - [ ] Move Firebase config to `.env` variables (`VITE_FIREBASE_API_KEY`, etc.) + add `.env.example`.
  - [ ] Configure **Cloudflare Pages** for continuous deployment from GitHub (`eduwrap.pages.dev`).
- [ ] **1.2 Cloudflare Worker Scaffolding (Resolves Security Deadlock)**:
  - [ ] Initialize `worker/index.js` and `worker/wrangler.toml` with CORS and routing.
  - [ ] Configure Firebase Admin SDK service account in Worker (`npx wrangler secret put FIREBASE_SERVICE_ACCOUNT`).
  - [ ] Implement initial Worker endpoint `/api/evaluate-assessment` to securely write to `competency_records` and `assessment_results` from Day 1.
- [ ] **1.3 Domain Data Framework (FRAC-Aligned & MoSPI Grounded)**:
  - [ ] Create `src/data/competencies.js`: Behavioural, Functional, Domain categories (~15–20 competencies, L1–L5 descriptors; `⚠️ PROPOSED FRAMEWORK`).
  - [ ] Create `src/data/roles.js`: 6–8 government roles including JSO, SSO, Deputy Director, and **Field Investigator / Data Collector (NSSO FOD)** (`⚠️ PROPOSED FRAMEWORK`).
  - [ ] Create `src/data/activities.js`: Activities per role linking to competencies with priority weights (`critical`, `important`, `desirable`; `⚠️ PROPOSED FRAMEWORK`).
  - [ ] Create `src/data/courseCatalog.js`: 25 courses mapped to competencies, with deep links to live iGOT pages and `karmaPoints` values (`🟡 SYNTHETIC DEMO DATA`).
  - [ ] Create `src/data/sampleQuestions.js`: ~40 diagnostic MCQs tagged by competency/level, including bilingual stems (`🟡 SYNTHETIC DEMO DATA`).
  - [ ] Create `src/data/translations.js`: Lightweight English/Hindi i18n dictionary for nav items, competency names, and key statistical terms.
- [ ] **1.4 Database Seeding Script**:
  - [ ] Create `scripts/seed-firestore.js` to batch-populate Firestore collections (`courses`, `questions`, `roles`, `activities`, `competencies`) from `src/data/` via `npm run seed`.
- [ ] **1.5 User & Auth Extension**:
  - [ ] Extend [UserContext.jsx](file:///Users/vamsikrishna/Dev%20Projects/i%20proj/EduWrap/src/contexts/UserContext.jsx) schema: add `role` (`learner` | `trainer` | `admin`), `organizationId`, `employeeId`, `department`, `designation`, `cadre`, `selectedRoleId`. _(Note: `competencyProfile` is not on the user doc; UserContext subscribes to `competency_records/{uid}` separately)._
  - [ ] Add **Simulated Parichay (MeriPehchaan National Gov SSO)** login button with pre-configured demo personas.
  - [ ] Add email domain validation for government domains (`@gov.in`, `@nic.in`, `@mospi.gov.in`) with `DEMO_MODE=true` toggle.
- [ ] **1.6 RBAC & Navigation Restructure**:
  - [ ] Create `src/components/guards/RoleGuard.jsx` for conditional rendering.
  - [ ] Add bilingual toggle button (English / हिंदी) to header navigation.
  - [ ] Update [AppLayout.jsx](file:///Users/vamsikrishna/Dev%20Projects/i%20proj/EduWrap/src/layouts/AppLayout.jsx) sidebar with role-conditional navigation (Learner / Trainer / Admin views).
  - [ ] Unhook deprecated routes (_Rooms, Doubts, Flashcards, Notes, Sandbox_) from sidebar without deleting source files.
- [ ] **1.7 Data Layer & Security Rules**:
  - [ ] Update [firestore.js](file:///Users/vamsikrishna/Dev%20Projects/i%20proj/EduWrap/src/firebase/firestore.js) with collection refs.
  - [ ] Deploy `firestore.rules` enforcing `organizationId` scoping, immutable audit logs, and `allow write: if false` on `competency_records` and `assessment_results` (trusted writes route through Worker).
- [ ] **1.8 Core Services**:
  - [ ] Create `src/services/competencyService.js` (priority-weighted severity formula, readiness index, level promotion logic).
  - [ ] Create `src/services/auditService.js` (append-only audit logger to `audit_log`).
- [ ] **1.9 Testing & Verification Gate**:
  - [ ] Set up Vitest (`vitest.config.js`).
  - [ ] Write 3 unit smoke tests in `tests/competencyService.test.js` (priority weighting, readiness calculation, level promotion).
  - [ ] Run `npm test` (all pass), `npx eslint . --quiet` (0 errors), `npm run build` (clean build).

---

### ⚪ PHASE 2 — Competency Intelligence & Adaptive Assessment (Core Loop)

> **Goal**: Profile with verified badges, adaptive diagnostic assessment, priority-weighted skill gap dashboard, recommendation engine, and iGOT integration.

- [ ] Rebuild [Profile.jsx](file:///Users/vamsikrishna/Dev%20Projects/i%20proj/EduWrap/src/pages/Profile.jsx):
  - Custom SVG Competency Radar Chart.
  - Visual distinction: 🛡️ assessment-verified vs ✍️ self-assessed levels.
  - **iGOT Karma Points counter** and **APAR Appraisal Milestone gauge**.
  - Historical timeline.
- [ ] Create `src/pages/SkillGap.jsx`:
  - Per-competency gap severity cards with FRAC activity context.
  - Priority matrix weighted by `ACTIVITY_COMPETENCY.priority`.
  - AI "Explain-the-gap" narrator (Capability 3 from §11a) referencing specific MoSPI activities.
- [ ] Rebuild assessment engine (`AssessmentContext.jsx` & [Quiz/](file:///Users/vamsikrishna/Dev%20Projects/i%20proj/EduWrap/src/components/Quiz)):
  - **Adaptive Item Branching**: Start at Medium difficulty; dynamically branch to Hard (if correct) or Easy (if wrong) to calibrate proficiency level (L1–L5).
  - Bilingual question toggle (English / हिंदी question stems).
  - Focus mode, timer, question navigation, and "Flag this question" button.
- [ ] Create `src/services/assessmentService.js`:
  - 3-stage adaptive branching logic.
  - Post-assessment submission to Cloudflare Worker `/api/evaluate-assessment` (updates `competency_records` securely).
- [ ] Create `src/services/recommendationService.js` (multi-signal course ranking with explainability strings).
- [ ] Create `src/pages/LearningPathways.jsx`:
  - Recommended courses ranked by gap severity, pathway milestones, and "Why Recommended" cards.
  - **Direct deep links on course cards** to live iGOT platform pages.
- [ ] Create `src/services/integrationService.js` (iGOT adapter with DSEP protocol interface and Karma Points tracking).
- [ ] Add `triggeredBy` outcome tracking (`diagnostic` | `post-course` | `retake`) for future training effectiveness validation.
- [ ] Post-assessment micro-feedback (Capability 4 from §11a): AI-generated diagnostic paragraph linked to courses.
- [ ] Vitest unit test suite for scoring, priority-weighted gap severity, adaptive branching, and ranking formulas.
- [ ] **Verification Gate**: `npm test` passes, `npx eslint . --quiet` clean, `npm run build` clean.

---

### ⚪ PHASE 3 — Content Intelligence (AI Pipeline & Trainer Workflow)

> **Goal**: Document upload (Firebase Storage default, R2 stretch goal), single-batch AI MCQ generation with confidence tagging, trainer review queue.

- [ ] Enhance Cloudflare Worker (`worker/index.js`, `worker/ai-router.js`) for AI proxy routing + storage presigned URLs.
- [ ] Implement document upload pipeline (Firebase Storage default; R2 stretch goal).
- [ ] Rebuild [Files.jsx](file:///Users/vamsikrishna/Dev%20Projects/i%20proj/EduWrap/src/pages/Files.jsx) $\to$ `DocumentManager.jsx`:
  - Trainer upload with progress indicator.
  - **Page Range Selector (Max 15 pages)** to prevent browser tab freezing on 200-page MoSPI manuals.
- [ ] Enhance [pdfService.js](file:///Users/vamsikrishna/Dev%20Projects/i%20proj/EduWrap/src/services/pdfService.js) (text chunking, section extraction, clean formatting).
- [ ] Create `src/services/ai/aiService.js` and structured prompt in Worker:
  - **Single-prompt batch generation** (10–15 MCQs in one JSON array payload) to strictly respect the Gemini 15 RPM free tier limit.
- [ ] AI confidence tagging on generated MCQs (`confidence: high | medium | low`) — Capability 2 from §11a.
- [ ] Stage 5a: Competency validation sanity check between generation and review ("Generated Qs reference topics X, Y, Z — does this match the competency you selected?").
- [ ] Create `src/pages/MCQGenerator.jsx` (trainer document selection, AI generation, confidence-sorted review & approval queue).
- [ ] Create `src/pages/QuestionBank.jsx` (searchable, filterable question repository; feeds directly into Phase 2 assessments).
- [ ] AI-content audit trail: record model version, prompt version, trainer actions in `audit_log`.
- [ ] **Verification Gate**: `npm test` passes, `npx eslint . --quiet` clean, `npm run build` clean.

---

### ⚪ PHASE 4 — Role-Specific Dashboards & Onboarding

> **Goal**: Tailored dashboards for Learner, Trainer, and Admin personas + official onboarding flow.

- [ ] Rebuild [Onboarding.jsx](file:///Users/vamsikrishna/Dev%20Projects/i%20proj/EduWrap/src/pages/Onboarding.jsx) (role selection → official credentials → target role → diagnostic assessment).
- [ ] Create **Learner Dashboard** (readiness gauge, priority skill gaps with self-assessed/verified distinction, Karma Points, next learning steps).
- [ ] Create **Trainer Dashboard** (uploaded docs, pending question approvals with confidence sort, question bank stats, cohort progress).
- [ ] Create **Admin / Ministry Dashboard**:
  - Cadre readiness index, department gap distribution, top missing competencies.
  - AI narrative summary (Capability 5 from §11a): "GIS proficiency across Field Analysts has dropped..."
  - One concrete write-back action: "Flag department for priority training" (`trainingPriority` field).
- [ ] Rebrand [Landing.jsx](file:///Users/vamsikrishna/Dev%20Projects/i%20proj/EduWrap/src/pages/Landing.jsx) for the National Statistical Capacity Building platform.
- [ ] **Verification Gate**: `npm test` passes, `npx eslint . --quiet` clean, `npm run build` clean.

---

### ⚪ PHASE 5 — Intelligence, Analytics & AI Assistant (NEXT)

> **Goal**: Gap-aware AI learning assistant, training effectiveness metrics, and advanced pathways.

- [ ] AI Learning Assistant — gap-aware conversational assistant grounded in actual `competency_records` (Capability 1 from §11a).
- [ ] Training Effectiveness Analytics (pre/post assessment comparative delta using `triggeredBy` join key).
- [ ] Statistical Practice Sandbox (interactive statistical calculation and sampling formula lab).
- [ ] Exportable Competency Report (printable PDF / official summary).
- [ ] **Verification Gate**: `npm test` passes, `npx eslint . --quiet` clean, `npm run build` clean.

---

### ⚪ PHASE 6 — End-to-End Golden Path & Demo Polish

> **Goal**: Seamless 10-minute end-to-end demo flow with zero rough edges.

- [ ] End-to-end integration test of the Golden Path (Survey Sampling closed loop):
  ```
  Sign in via Parichay SSO → Profile (L1 Self-Assessed) → Gap Detected (Critical 🔴)
  → Recommend NSSTA-202 on iGOT → Trainer Uploads Survey Sampling Manual (Chapters 1-3)
  → AI Generates MCQs with Confidence Tags → Stage 5a Validation → Trainer Approves into Bank
  → Learner Takes Adaptive Assessment (Bilingual Hindi/English) → Scores 82%
  → Loop Closes: Level Promotes L1 → L2 (🛡️ verified) → Admin Sees Cadre Progress & Flags Next Priority
  ```
- [ ] Responsive UI audit (Desktop 1440px, Laptop 1024px, Mobile 375px).
- [ ] Empty states, loading skeletons, and error boundaries for all new pages.
- [ ] All synthetic values clearly labeled in analytics/dashboards.
- [ ] **Verification Gate**: `npm test` passes, `npx eslint . --quiet` clean, `npm run build` clean.

---

### ⚪ PHASE 7 — Production Hardening & Sustainability (FUTURE)

- [ ] Automated Firestore backup export pipeline.
- [ ] GitHub Actions CI/CD (lint, test, build).
- [ ] PWA offline capability for profile viewing.
- [ ] Data privacy classification exercise (Official Use Only, retention periods, RBAC-controlled visibility).

---

## 🗂️ 4. Feature Reuse Strategy Map

```
EXISTING FEATURE      ACTION         NEW PURPOSE / REASON
────────────────────────────────────────────────────────────────────────────────
Theme/Accent System   KEEP           Maintain dark/light & accent customizer
UI Component Library  KEEP           Buttons, Modals, Dropdowns, Badges, Toasts
App Layout & Shell    MODIFY         Update sidebar for Learner/Trainer/Admin RBAC + Bilingual Toggle
UserContext           MODIFY         Add organizationId, official fields, role (competency in separate doc)
Landing Page          MODIFY         Rebrand to MoSPI Capacity Building Platform with Parichay SSO
Quiz System           REPURPOSE      Adaptive Competency Assessment Engine with Item Branching
Question Generator    REPURPOSE      AI Batch Generator + Rule-Based Fallback with Review Queue
PDF Service           REPURPOSE      Document-to-Knowledge Pipeline with 15-page limit & Chunking
Files / FileContext   REPURPOSE      Training Document Manager (Firebase Storage → R2)
Dashboard             REPURPOSE      Role-Based Competency Intelligence Dashboard with Karma Points
Profile               REPURPOSE      Official Statistical Workforce Profile (🛡️ verified vs ✍️ self-assessed)
Rooms / StudyRoom     DEPRECATE      Unhook from nav; preserve code for Virtual Collaborative Labs (Future)
Doubts Forum          DEPRECATE      Unhook from nav; preserve code for Q&A (Future)
Flashcards            DEPRECATE      Unhook from nav; preserve code for Micro-learning (Future)
Notes                 DEPRECATE      Unhook from nav; preserve code for Doc Annotations (Future)
Sandbox               DEPRECATE      Unhook from nav; preserve code for Statistical Lab (Phase 5)
```

---

## 🔑 5. Key Terminology Reference

| Term                        | Meaning                                                                                       | Source               |
| --------------------------- | --------------------------------------------------------------------------------------------- | -------------------- |
| **FRAC**                    | Framework of Roles, Activities and Competencies — one of Six Pillars of Mission Karmayogi     | ✅ VERIFIED OFFICIAL |
| **iGOT Karmayogi**          | Government learning platform, 1+ crore users, 16 languages, built on Sunbird/DIKSHA           | ✅ VERIFIED OFFICIAL |
| **Parichay / MeriPehchaan** | National Single Sign-On (NSSO) service for Central Government employees by NIC                | ✅ VERIFIED OFFICIAL |
| **ISS / SSS / NSSO FOD**    | Indian Statistical Service / Subordinate Statistical Service / Field Operations Division      | ✅ VERIFIED OFFICIAL |
| **CAPI**                    | Computer Assisted Personal Interviewing — digital tablets used by NSSO field enumerators      | ✅ VERIFIED OFFICIAL |
| **Karma Points**            | iGOT's unit of progress tracking, tied to APAR (Annual Performance Appraisal Report)          | ✅ VERIFIED OFFICIAL |
| **DSEP Protocol**           | Decentralized Skilling and Education Protocol — plausible future iGOT integration surface     | ✅ VERIFIED FACT     |
| **C4GT**                    | CodeForGoodTech — public GitHub org tracking iGOT platform components                         | ✅ VERIFIED FACT     |
| **L1–L5**                   | Five-level proficiency scale consistent with FRAC guidance; specific descriptors are PROPOSED | ⚠️ PROPOSED          |

---

## 📜 6. Session Execution Log
