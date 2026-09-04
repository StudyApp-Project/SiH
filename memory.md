# memory.md

## StatVidya — Progress Tracker & Working Memory

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Purpose            | Track what has been completed, what's currently being worked on, and important decisions made along the way |
| Update frequency   | After every significant milestone — completing a phase, finishing a file, making a key decision |
| Last updated       | 2026-09-05                                                   |

> **How to use this file**: Update this file regularly as you work. It's the single source of truth for "where are we?" at any point. When picking up work after a break, read this first.

---

## Current Status

| Dimension           | Status                                                     |
| ------------------- | ---------------------------------------------------------- |
| **Current Phase**   | Pre-development — Documentation complete                   |
| **Current Task**    | All documentation finalized. Ready to begin Phase 1.       |
| **Blockers**        | None identified                                            |
| **Next Action**     | Begin Phase 1 — Project Setup, Auth & Shell                |

---

## Documentation Status

| Document          | Status       | Notes                                          |
| ----------------- | ------------ | ---------------------------------------------- |
| PRD.md            | ✅ Complete  | Full product requirements, 800 lines, covers all SIH 26101 requirements |
| ARCHITECTURE.md   | ✅ Complete  | Tech stack, app flow, folder structure, offline architecture, Cloud Functions design |
| rules.md          | ✅ Complete  | Coding rules, library constraints, error handling, AI boundaries, security |
| Phases.md         | ✅ Complete  | 6 MVP phases with deliverables, FR references, exit criteria |
| Design.md         | ✅ Complete  | Color system, typography (Inter + Noto Sans Devanagari), spacing, components, dark mode, provenance badges |
| memory.md         | ✅ Complete  | This file — progress tracker                   |

---

## Phase Progress

### Phase 1 — Project Setup, Auth & Shell
- [ ] Initialize Vite + React + TypeScript project
- [ ] Set up Tailwind CSS 4.x with design tokens
- [ ] Set up Firebase project (Auth, Firestore, Storage, Functions, Hosting)
- [ ] Create firebase.json, firestore.rules, firestore.indexes.json
- [ ] Set up Cloud Functions boilerplate
- [ ] Implement Firebase Auth (email/password + Google OAuth)
- [ ] Create simulated Parichay SSO with demo personas
- [ ] Define TypeScript interfaces for all core entities
- [ ] Create RequireRole guard component
- [ ] Set up React Router with full route map
- [ ] Create AppLayout (sidebar, topbar, language toggle)
- [ ] Configure vite-plugin-pwa
- [ ] Set up ESLint + Prettier
- [ ] Set up react-i18next with en + hi locale files
- [ ] Create .env.example
- [ ] First deploy to Firebase Hosting

### Phase 2 — FRAC Domain Model, Seed Data & Provenance
- [ ] Create seed data files (competencies, roles, activities, courses)
- [ ] Enforce provenance at TypeScript level
- [ ] Create ProvenanceBadge component
- [ ] Write seed-firestore.ts script
- [ ] Build multi-step onboarding flow
- [ ] FI persona defaults to Hindi
- [ ] Create competency_records on onboarding completion
- [ ] Implement assessment-verified vs self-assessed badges
- [ ] Set up Firestore security rules for domain data
- [ ] Run seed script and verify

### Phase 3 — Competency Engine, Gap Analysis & Dashboard
- [ ] Implement competencyService.ts (gap severity, readiness index)
- [ ] Unit tests for all formulas
- [ ] Create CompetencyContext.tsx
- [ ] Build Skill Gap Analysis page
- [ ] Build RadarChart component
- [ ] Build ProgressRing component
- [ ] Build Learner Dashboard
- [ ] Implement recommendationService.ts
- [ ] Unit tests for recommendation ranking
- [ ] Build Learning Pathways page
- [ ] Implement integrationService.ts (mock iGOT)
- [ ] Build Profile page

### Phase 4 — Adaptive Assessment Engine & Offline
- [ ] Implement assessmentService.ts (adaptive branching)
- [ ] Unit tests for adaptive branching
- [ ] Build Assessment page UI
- [ ] Create Hindi-stem questions (10+)
- [ ] Implement evaluateAssessment Cloud Function
- [ ] Implement onAssessmentResultCreated trigger
- [ ] Implement offlineService.ts
- [ ] Build offline status indicator
- [ ] Implement auto-sync on reconnect
- [ ] Configure service worker for assessment caching
- [ ] Implement assessment prefetch
- [ ] Security rules for assessment_results and audit_log

### Phase 5 — Content Intelligence Pipeline
- [ ] Build Document Manager page
- [ ] Implement storageService.ts
- [ ] Implement getUploadUrl Cloud Function
- [ ] Client-side text extraction (pdf.js + tesseract.js OCR)
- [ ] Text chunking with section awareness
- [ ] Implement generateQuestions Cloud Function
- [ ] Create MCQ generation prompt
- [ ] Implement rule-based fallback generator
- [ ] Build MCQ Generator page
- [ ] Build competency validation sanity check
- [ ] Build review queue (low-confidence-first)
- [ ] Approved questions → assessment bank
- [ ] onQuestionWrite trigger for audit
- [ ] Security rules for questions and documents

### Phase 6 — Admin Intelligence, i18n Polish & Integration
- [ ] Build Admin Analytics page (org overview)
- [ ] Build role/department breakdown with drill-down
- [ ] Implement "Flag for priority training" action
- [ ] onTrainingPriorityWrite trigger
- [ ] Build Outcome Correlation chart (simulated)
- [ ] Add "Simulated" watermark + methodology note
- [ ] Complete i18n (EN + HI for all strings)
- [ ] Language toggle + preferredLanguage
- [ ] FI persona Hindi default
- [ ] Responsive check on tablet viewport
- [ ] Run golden-path demo script
- [ ] Fix issues from golden-path run

---

## Key Decisions Made

| Date       | Decision                                                                     | Rationale                                           |
| ---------- | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| 2026-09-05 | Single cloud provider (Firebase) for MVP/V1                                  | Avoids managing two platforms; R2/Workers deferred   |
| 2026-09-05 | TypeScript throughout                                                        | Formula-heavy code needs static types                |
| 2026-09-05 | Firestore triggers for audit logging (not manual calls)                      | Can't be forgotten in future feature branches        |
| 2026-09-05 | Firestore native offline + custom IndexedDB queue only for assessment submit | Don't rebuild what the SDK provides                  |
| 2026-09-05 | Inter + Noto Sans Devanagari as font stack                                   | Best readability for bilingual EN/HI content         |
| 2026-09-05 | Tailwind CSS 4.x for styling                                                 | Fast to theme, utility-first, wide ecosystem         |
| 2026-09-05 | Gemini as primary AI, rule-based as fallback                                 | AI provider via env var, auto-fallback on failure    |

---

## Files Created / Modified Log

| Date       | File                    | Action   | Notes                                                |
| ---------- | ----------------------- | -------- | ---------------------------------------------------- |
| 2026-09-05 | PRD.md                  | Created  | Full product requirements document                   |
| 2026-09-05 | ARCHITECTURE.md         | Created  | System architecture, tech stack, folder structure     |
| 2026-09-05 | rules.md                | Created  | Development rules, constraints, AI boundaries         |
| 2026-09-05 | Phases.md               | Created  | 6 MVP phases with deliverables and exit criteria      |
| 2026-09-05 | Design.md               | Created  | Visual design system, colors, typography, tokens      |
| 2026-09-05 | memory.md               | Created  | This progress tracker                                |

---

## Open Questions (from PRD §21)

| #  | Question                                                                     | Status      | Resolution |
| -- | ---------------------------------------------------------------------------- | ----------- | ---------- |
| 1  | Team composition and timeline — solo or team? Demo date?                     | ❓ Open      | —          |
| 2  | Cloud/AI account readiness — Firebase + Gemini key provisioned?              | ❓ Open      | —          |
| 3  | Visual design direction — formal government vs modern approachable?          | ✅ Resolved  | Modern-approachable with institutional credibility (Design.md) |
| 4  | Government outreach — send email to mission.karmayogi@gov.in?                | ❓ Open      | —          |
| 5  | Product name — "StatVidya" acceptable?                                       | ❓ Open      | —          |
| 6  | Post-pilot ownership model?                                                  | ❓ Open      | —          |

---

## Notes & Observations

_Space for recording important observations, gotchas, or things to remember during development._

- **Remember**: Hindi text can be 20–40% longer than English. Test every component with Hindi content before considering it done.
- **Remember**: The golden-path demo script (PRD §22.3) is the MVP acceptance test. Every phase should be building toward this running end-to-end.
- **Remember**: P0 Lever 1–3 items (field-first, outcome correlation, FRAC grounding) cannot be deferred for any P2 work.

---

*This file is a living document. Update it after every significant change.*
