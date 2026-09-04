# Rules.md

## StatVidya — Development Rules, Constraints & Boundaries

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Companion docs     | PRD.md, ARCHITECTURE.md, Phases.md, Design.md, memory.md     |
| Purpose            | Codify what we do, what we avoid, and where every boundary is — libraries, error handling, AI, naming, security |
| Status             | Draft v1.0                                                   |

> **Read this before writing any code.** Every rule here exists because of a specific decision in the PRD or Architecture doc. If a rule conflicts with something you want to do, the rule wins until it's explicitly revised — don't silently ignore it.

---

## Table of Contents

1. [General Principles](#1-general-principles)
2. [What We Do](#2-what-we-do)
3. [What We Avoid](#3-what-we-avoid)
4. [Library & Dependency Rules](#4-library--dependency-rules)
5. [TypeScript & Code Style](#5-typescript--code-style)
6. [Error Handling & Boundaries](#6-error-handling--boundaries)
7. [Security Rules](#7-security-rules)
8. [AI Boundaries](#8-ai-boundaries)
9. [Data & Provenance Rules](#9-data--provenance-rules)
10. [Testing Rules](#10-testing-rules)
11. [Git & Workflow Rules](#11-git--workflow-rules)
12. [Performance Rules](#12-performance-rules)

---

## 1. General Principles

These are the non-negotiable axioms. Everything below derives from them.

1. **Server enforces, client suggests.** Any value that affects a competency level, assessment score, or audit record is computed and written server-side. Client-side guards are UX convenience, never security.
2. **Offline is a first-class state, not an error.** Code must handle offline gracefully — no `try/catch → show generic error` when the network is down.
3. **Provenance is structural, not conventional.** If a data record should carry a `provenance` field, it must be enforced at the TypeScript type level. A missing `provenance` must fail at compile time, not during QA.
4. **Priority enforcement is literal.** P0 Lever 1–3 items (field-first, outcome correlation, FRAC grounding) cannot be deferred for any P2 work. If you're tempted to cut a differentiator, stop and escalate.
5. **Explicit over clever.** Readable code that a new team member understands in 30 seconds beats a clever abstraction that saves 5 lines.

---

## 2. What We Do

### 2.1 Architecture & Structure

- **Follow the folder structure** defined in ARCHITECTURE.md §10 exactly. New files go into the correct directory — don't create ad-hoc folders.
- **Keep services framework-agnostic.** Service files in `services/` must not import React, `useContext`, or any React hook. They are plain TypeScript modules.
- **Use Contexts as the React bridge.** Contexts call services and expose reactive state. Components never call Firestore/Firebase directly — they go through a Context or hook that wraps one.
- **Co-locate page-specific components.** If a component is only used by one page, it lives inside that page's folder (e.g., `pages/SkillGap/GapCard.tsx`). Shared components go to `components/`.
- **One component per file.** Exception: small, tightly-coupled sub-components (e.g., a `ListItem` inside a `List.tsx`) are fine in the same file.

### 2.2 Data & State

- **Firestore is the single source of truth for reads.** Derived values (gap severity, readiness index) are computed fresh from Firestore data on every render, never stored redundantly in component state.
- **Assessment answers while offline** are the single exception — they live in local state/IndexedDB until sync.
- **Every domain-data record must have `provenance`.** Enforce this in the TypeScript interface. The seed script must validate 100% coverage before writing to Firestore.
- **Org-scope everything.** Every Firestore document that holds user-facing data must include `organizationId`. Every security rule must check it.

### 2.3 i18n & Accessibility

- **All user-facing strings go through `react-i18next`.** Never hardcode a user-visible string in JSX. Even "Loading..." goes in the locale file.
- **Hindi is not an afterthought.** Every new string must be added to both `en/common.json` and `hi/common.json` at the same time, in the same commit.
- **Semantic HTML first.** Use `<button>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<label>` — not divs with click handlers. ARIA attributes supplement semantic HTML, they don't replace it.
- **Every interactive element** must have a visible focus state, keyboard accessibility, and a unique `id` or `data-testid`.

### 2.4 Naming Conventions

| Entity             | Convention                  | Example                               |
| ------------------ | --------------------------- | ------------------------------------- |
| Files (components) | PascalCase                  | `GapCard.tsx`, `RadarChart.tsx`       |
| Files (services)   | camelCase                   | `competencyService.ts`                |
| Files (hooks)      | camelCase, `use` prefix     | `useCompetency.ts`                    |
| Files (contexts)   | PascalCase, `Context` suffix| `CompetencyContext.tsx`               |
| Files (types)      | camelCase                   | `competency.ts`, `assessment.ts`      |
| Variables/functions| camelCase                   | `gapSeverity`, `computeReadiness()`   |
| Constants          | UPPER_SNAKE_CASE            | `MAX_RETRY_ATTEMPTS`                  |
| Interfaces/Types   | PascalCase                  | `CompetencyRecord`, `AssessmentResult`|
| Enums              | PascalCase (members too)    | `Provenance.VerifiedOfficial`         |
| CSS classes        | Tailwind utilities (no BEM) | `className="bg-surface-primary ..."` |
| Firestore collections | snake_case               | `competency_records`, `audit_log`     |
| Environment vars   | UPPER_SNAKE_CASE, prefix    | `VITE_FIREBASE_API_KEY`               |

---

## 3. What We Avoid

### 3.1 Absolute Don'ts

| ❌ Don't                                                      | Why                                                                                      |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Don't store AI API keys in client code or `.env` shipped to browser | Keys get leaked, quota gets burned. All AI calls go through Cloud Functions (ARCH §7). |
| Don't write to `competency_records` or `assessment_results` from the client | Server-side only. A tampered client must not be able to fabricate scores (PRD §15). |
| Don't skip the `provenance` field on any domain-data record   | FR-TRUST-1 is a release gate. Missing provenance = build must fail.                      |
| Don't use `any` in TypeScript                                 | Use `unknown` and narrow, or define a proper type. `any` defeats the entire reason we chose TS. |
| Don't install a new npm dependency without team approval       | See §4 below. Every dependency is attack surface and bundle size.                        |
| Don't create a Cloud Function for trivial writes              | If the write doesn't touch scores, competency levels, or paid APIs, use Firestore rules (ARCH §3). |
| Don't hardcode strings in JSX                                 | Everything goes through i18n. No exceptions. See §2.3.                                   |
| Don't use `console.log` in production code                    | Use a structured logger or remove it. `console.log` stays in dev/debug branches only.    |
| Don't ignore TypeScript errors with `@ts-ignore`             | Fix the type. If you genuinely can't, use `@ts-expect-error` with a comment explaining why. |
| Don't commit `.env` files with real secrets                   | `.env.example` is committed; `.env` is gitignored.                                       |

### 3.2 Architecture Anti-Patterns

- **No Redux, Zustand, Jotai, or MobX.** React Context + hooks is sufficient at this scale (ARCH §2). If cross-cutting state becomes painful, we add Zustand intentionally — not preemptively.
- **No server-side rendering (SSR).** This is a PWA, not an SEO-driven content site. Vite + client-side React is correct.
- **No micro-frontends, module federation, or multi-app architecture.** We have one app. Keep it one app.
- **No ORM or query builder on the client.** Firestore SDK is the data layer. Wrapping it in another abstraction adds indirection without value.
- **No "util dump" files.** A `utils.ts` that grows past 100 lines must be split by domain (`dateUtils.ts`, `formatUtils.ts`, etc.).

---

## 4. Library & Dependency Rules

### 4.1 Approved Dependencies (already in ARCHITECTURE.md §2)

| Category            | Approved                                                    | Notes                                          |
| ------------------- | ----------------------------------------------------------- | ---------------------------------------------- |
| Framework           | React 19.x                                                  | —                                              |
| Build               | Vite (latest stable)                                        | —                                              |
| Language            | TypeScript 5.x                                              | `strict: true` in tsconfig                     |
| Routing             | React Router v7.x                                           | —                                              |
| Styling             | Tailwind CSS 4.x                                            | See Design.md for theme tokens                 |
| Animation           | Framer Motion                                               | Sparingly — micro-interactions only             |
| Charts              | Recharts (data plots) + custom SVG (radar, progress ring)   | —                                              |
| i18n                | `react-i18next` + `i18next-browser-languagedetector`        | —                                              |
| PWA                 | `vite-plugin-pwa` (Workbox)                                 | —                                              |
| Offline storage     | `idb` (IndexedDB wrapper)                                   | Only for the assessment submission queue        |
| PDF extraction      | `pdf.js`                                                    | Client-side                                    |
| OCR                 | `tesseract.js`                                              | Fallback for scanned pages                     |
| Backend             | Firebase (Auth, Firestore, Storage, Cloud Functions, Hosting)| Single provider for MVP/V1                     |
| AI                  | Gemini (via Cloud Functions only)                           | Model name in env var, never hardcoded          |
| Testing             | Vitest, Testing Library, Playwright (V1.1)                  | —                                              |
| Lint/Format         | ESLint + Prettier                                           | Enforced in CI                                 |

### 4.2 Adding a New Dependency — Gate Checklist

Before adding ANY new `npm install`:

1. **Is there already an approved library that does this?** If yes, use it.
2. **Can this be done with vanilla JS/TS in <50 lines?** If yes, write it yourself.
3. **Bundle size**: check via [bundlephobia.com](https://bundlephobia.com). Reject anything >50KB gzipped unless it replaces something larger.
4. **Maintenance**: must have >1000 weekly downloads, a recent commit within 6 months, and no open critical CVEs.
5. **Tree-shaking**: must support ES modules and tree-shaking. No giant CJS-only bundles.
6. **Document the addition** in the PR description with a one-sentence justification.

### 4.3 Explicitly Banned Libraries

| Library / Category              | Reason                                                                |
| ------------------------------- | --------------------------------------------------------------------- |
| `axios`                         | `fetch` is standard; no reason to add a wrapper                       |
| `lodash` (full)                 | Import specific functions (`lodash-es/debounce`) only if truly needed |
| `moment.js`                     | Use `Intl.DateTimeFormat` or `date-fns` if needed                     |
| `styled-components` / `emotion` | Tailwind is the styling system                                        |
| `jQuery`                        | Obviously                                                             |
| `redux` / `mobx` / `zustand`    | See §3.2                                                              |
| `express`                       | Cloud Functions handle HTTP; no Express server                        |
| Any CSS framework besides Tailwind | Design.md defines the system                                       |

---

## 5. TypeScript & Code Style

### 5.1 tsconfig Rules

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 5.2 Code Style Rules

- **Max function length**: ~40 lines. If longer, extract helper functions.
- **Max file length**: ~300 lines for components, ~500 for services. Split if it grows beyond.
- **Imports**: group as (1) React/framework, (2) third-party, (3) internal — with a blank line between groups.
- **No default exports** except for page-level components (required by React Router lazy loading). Everything else is a named export.
- **Prefer `interface` over `type`** for object shapes (interfaces have better error messages and are extendable). Use `type` for unions, intersections, and computed types.
- **Use `const` assertions and `satisfies`** for seed data to preserve literal types while still type-checking.
- **No magic numbers.** Extract into a named constant with a comment referencing the PRD requirement.

```typescript
// ✅ Good — references PRD FR-COMP-1
const PRIORITY_WEIGHT = { critical: 3, important: 2, desirable: 1 } as const;

// ❌ Bad
const score = (target - current) * 3;
```

---

## 6. Error Handling & Boundaries

### 6.1 Strategy

| Layer               | Approach                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| **React components**| Every route-level page is wrapped in an `<ErrorBoundary>` that shows a user-friendly message in the active locale, never a raw stack trace. |
| **Service layer**   | Services throw typed errors (`AppError` with `code`, `message`, `context`). They never swallow errors silently. |
| **Cloud Functions** | Return structured error responses (`{ error: { code, message } }`). Never expose internal details (stack traces, Firestore paths) to the client. |
| **Firestore rules** | Deny by default, allow explicitly. A missing rule is a deny, not an allow.                           |
| **AI calls**        | Always wrapped in try/catch with automatic fallback to rule-based generation (FR-CONTENT-9). Log the failure, don't crash. |
| **Offline queue**   | Failed sync attempts increment a counter and use exponential backoff. After max retries, show a manual "Retry" affordance — never silently drop data. |

### 6.2 Error Boundary Component Pattern

```typescript
// Every page route wraps in this
<ErrorBoundary
  fallback={({ error, resetErrorBoundary }) => (
    <ErrorFallback
      error={error}
      onRetry={resetErrorBoundary}
    />
  )}
>
  <PageContent />
</ErrorBoundary>
```

### 6.3 AppError Type

```typescript
interface AppError {
  code: string;          // e.g., "ASSESSMENT_SYNC_FAILED", "AI_GENERATION_FAILED"
  message: string;       // user-facing, translatable via i18n key
  context?: Record<string, unknown>;  // debug info for logging, never shown to user
  retryable: boolean;    // UI uses this to show/hide a retry button
}
```

### 6.4 What We Never Do with Errors

- ❌ `catch(e) {}` — empty catch blocks are forbidden.
- ❌ `catch(e) { console.log(e) }` — logging without handling is not handling.
- ❌ Showing raw error messages from Firestore/Firebase to the user.
- ❌ Allowing an unhandled promise rejection to crash the app silently.
- ❌ Retrying indefinitely without backoff or a max-attempts cap.

---

## 7. Security Rules

These are extracted from PRD §15 and ARCHITECTURE.md for easy reference during development.

### 7.1 Hard Rules

1. **No AI API key in the client bundle.** Ever. Checked by a CI step that greps the built output.
2. **No direct client writes** to `competency_records`, `assessment_results`, `audit_log`. Firestore rules `deny write` on these; writes happen only via Cloud Functions.
3. **Every Firestore rule checks `organizationId`.** Cross-org access is impossible, even for admins.
4. **Audit log is append-only.** `allow update, delete: if false;` on the `audit_log` collection. No exceptions.
5. **Role checks are two-layered.** Client-side `<RequireRole>` hides UI; Firestore rules + Cloud Functions validate on every write/callable.

### 7.2 Environment & Secrets

- `.env` files are in `.gitignore`. Always.
- `.env.example` documents every required variable with placeholder values.
- `GEMINI_API_KEY` lives in Firebase Functions config or Secret Manager, never in an `.env` that ships to the browser.
- Firebase client config keys (`VITE_FIREBASE_*`) are **not** secrets — they identify the project. Security comes from Auth + Rules, not from hiding the config.

### 7.3 Auth Rules

- Email/password and Google OAuth are the two auth methods.
- Simulated Parichay SSO is a UI wrapper around pre-seeded demo accounts — it does not implement a real SSO protocol.
- `DEMO_MODE=true` relaxes email-domain restrictions. In non-demo mode, only approved government email domains can register.

---

## 8. AI Boundaries

### 8.1 What AI Does (and the boundary around each use)

| AI Capability                   | Boundary                                                                                                   |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **MCQ generation from docs**    | AI proposes questions; a **human trainer must review and approve** every single question before it enters the bank. AI never publishes directly. |
| **Confidence tagging**          | AI self-assesses `high/medium/low` confidence on each question. This is a triage aid for the trainer, not a quality guarantee. |
| **Explain-the-gap narrator**    | AI generates a one-line explanation per gap card. Grounded in the user's actual FRAC data (injected server-side), not hallucinated. |
| **Post-assessment feedback**    | AI generates topic-specific feedback after an assessment. References actual missed topics and linked courses, not generic text. |
| **Admin narrative summary**     | AI generates 2–3 sentences about the top workforce gap trend. Must reference real aggregate numbers, even if small. |
| **AI Learning Assistant**       | Context-grounded chat. Every response is grounded in the learner's actual competency records, role requirements, and assessment history — injected into the system prompt server-side. |

### 8.2 What AI Must Never Do

- ❌ **Never score an assessment.** Scoring is deterministic, formula-based, server-side. AI has no role in deciding a competency level.
- ❌ **Never write to competency records.** AI can suggest; only the server-side evaluation pipeline writes.
- ❌ **Never make up data.** If the AI doesn't have enough context (e.g., sparse competency records for an admin narrative), it must say so — not fabricate numbers.
- ❌ **Never expose raw model output to the user unprocessed.** All AI responses are parsed, validated against expected schema, and sanitized before rendering.
- ❌ **Never call the AI from the client.** Every AI call routes through a Cloud Function that validates auth, checks rate limits, and logs usage.
- ❌ **Never present AI-generated content without a provenance label.** AI-generated questions carry `SYNTHETIC_DEMO_DATA` or `PROPOSED_METHODOLOGY` provenance until trainer-approved.

### 8.3 AI Fallback Chain

```
Primary: Gemini (via Cloud Function)
  ↓ (if unavailable, rate-limited, or error)
Fallback: Rule-based question generator (in-repo, no external dependency)
  ↓ (if even this fails, which shouldn't happen for rule-based)
Final: Show error with retry option, never silently fail
```

### 8.4 Prompt Engineering Rules

- Prompts live in `functions/src/prompts/` — one file per capability.
- Prompts are **versioned** (a `PROMPT_VERSION` constant in each file). The version is logged with every AI audit entry.
- Prompts request **structured JSON output** from the model, not free-text. Parse with a schema validator, not regex.
- Prompts never include user PII beyond what's needed for context (role, competency levels). No names, emails, or org identifiers sent to the AI model.

---

## 9. Data & Provenance Rules

### 9.1 Provenance Labels (from PRD §9.3)

| Label                        | When to use                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `VERIFIED_OFFICIAL`          | Matches a real, checkable government fact or structure                        |
| `PROPOSED_FRAMEWORK`         | Structurally grounded in something official, but content is team's proposal   |
| `PROPOSED_METHODOLOGY`       | A formula, scoring rule, or algorithm the team designed                       |
| `SYNTHETIC_DEMO_DATA`        | Fabricated for demonstration; no claim to real-world accuracy                 |

### 9.2 Rules

- Every record in `competencies`, `roles`, `activities`, `courses` **must** have a non-null `provenance` field.
- The TypeScript type enforces `provenance` as a required field — omitting it is a compile error.
- The seed script validates 100% provenance coverage before writing.
- The UI renders a `<ProvenanceBadge>` on every surface showing domain data. No exceptions.
- AI-generated content (questions) defaults to `SYNTHETIC_DEMO_DATA` until trainer approval assigns the appropriate label.

### 9.3 Seed Data Rules

- All seed data lives in `apps/web/src/data/`. No inline seed data in components or services.
- Seed data files export typed arrays/objects with `as const satisfies` for maximum type safety.
- The Firestore seed script (`scripts/seed-firestore.ts`) is idempotent — running it twice must not duplicate data.
- Seed data is explicitly small: 15–20 competencies, 5–8 roles, a handful of courses. Don't over-seed.

---

## 10. Testing Rules

### 10.1 What Must Be Unit Tested (Non-Negotiable)

These are the formulas where a silent wrong answer is the most damaging class of bug:

- `severityScore` computation (FR-COMP-1)
- Severity bucket assignment (FR-COMP-2)
- `readinessIndex` computation (FR-COMP-3)
- Adaptive assessment branching logic (FR-ASSESS-1)
- Recommendation ranking formula (FR-REC-1)
- Level-promotion threshold logic

### 10.2 Testing Approach

| Layer             | Tool              | When                                      |
| ----------------- | ----------------- | ----------------------------------------- |
| Unit (formulas)   | Vitest            | Every formula, every edge case            |
| Unit (services)   | Vitest            | Service methods with mocked Firestore     |
| Component         | Testing Library   | Key user flows (onboarding, assessment)   |
| E2E               | Playwright        | Deferred to V1.1 — don't start E2E early |

### 10.3 Test File Conventions

- Test files live in `tests/` at the app level, mirroring the source structure.
- Naming: `{module}.test.ts` or `{Component}.test.tsx`.
- Use fixture files for shared test data (e.g., `tests/fixtures/competencyData.ts`).
- If a formula exists in both client and Cloud Functions, both must be tested against the **same fixture file**.

---

## 11. Git & Workflow Rules

### 11.1 Branch Strategy

- `main` — always deployable. Merge only via PR.
- `dev` — active development. PRs merge here first.
- Feature branches: `feature/{phase}-{short-description}` (e.g., `feature/p1-auth-setup`).
- Hotfix branches: `hotfix/{description}`.

### 11.2 Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(assessment): add adaptive branching logic [FR-ASSESS-1]
fix(offline): prevent duplicate sync on flaky reconnect
chore(deps): update react-i18next to 15.x
docs(rules): add AI boundary section
```

- Reference the FR/requirement ID in the commit message when implementing a specific requirement.
- Keep commits atomic — one logical change per commit.

### 11.3 PR Rules

- Every PR needs a description explaining **what** and **why**.
- PRs must pass: lint, type-check, unit tests.
- No `@ts-ignore` without a linked issue explaining the plan to remove it.
- No new dependencies without the gate checklist from §4.2.

---

## 12. Performance Rules

- **Dashboard initial load < 3s** on 4G (PRD §12). Measure with Lighthouse.
- **PWA shell load < 5s** on first offline load.
- **Lazy-load all page-level routes** via `React.lazy()` + `Suspense`.
- **Images**: use WebP, compress, and serve appropriate sizes.
- **No synchronous heavy computation** on the main thread. If PDF processing or OCR blocks the UI, move it to a Web Worker.
- **Firestore queries**: always limit results. No unbounded `getDocs()` without a `limit()`.
- **Bundle size**: monitor total JS bundle. Target < 300KB gzipped for the initial chunk.

---

*End of document. See PRD.md for requirements, ARCHITECTURE.md for technical architecture, Design.md for visual system, Phases.md for build plan, memory.md for progress tracking.*
