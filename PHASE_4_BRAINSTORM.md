# Phase 4 Brainstorming: Adaptive Assessment Engine & Offline Sync
**Date**: 2026-09-05 16:48 UTC  
**Goal**: Design a robust, zero-data-loss assessment + offline queue system  
**Scope**: 3-stage adaptive branching + IndexedDB queue + Supabase Edge Function scoring + idempotent reconciliation

---

## 1. Core Challenges & Design Goals

### Challenge 1: Adaptive Branching State Machine
**Problem**: 3-stage branching (Medium → Hard/Easy → L1-L5) must:
- Converge to a single proficiency level (L1–L5) with no ambiguity
- Avoid infinite loops or undefined states
- Be deterministic (same answers → same level, every time)
- Handle edge cases (user guesses on all questions, etc.)

**Design Goal**: Explicit, testable state machine with clear transitions and convergence proof.

### Challenge 2: Offline Queue Durability
**Problem**: IndexedDB queue must survive:
- App crashes mid-sync
- Browser close/reopen (localStorage cleared, but IDB persists)
- Network transitions (WiFi ↔ cellular)
- Multiple pending assessments

**Design Goal**: Zero data loss; queue survives app lifecycle events.

### Challenge 3: Idempotent Reconciliation
**Problem**: When reconnecting, the queue flush must:
- Never double-score the same assessment
- Handle partial uploads (network cut mid-flush)
- Support retry without side effects
- Guarantee audit log entry for each submission exactly once

**Design Goal**: Client-generated `local_id` + Edge Function deduplication ensures idempotency.

### Challenge 4: Real-Time UI Status
**Problem**: Offline banner must show:
- "🔴 3 Assessments Pending" (not polling)
- Live sync progress ("Syncing… 1/3 complete")
- Clear retry UX if sync fails

**Design Goal**: Supabase Realtime + local state sync without API poll spam.

### Challenge 5: Server-Side Audit Trail
**Problem**: Every assessment submission must:
- Be scored server-side (no client tampering)
- Create immutable audit log entry
- Include timestamp, user, answers, final score, provenance

**Design Goal**: Supabase Edge Function + database trigger for zero-trust scoring.

---

## 2. Adaptive Branching State Machine (Design)

### 2.1 Three-Stage Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 1: Difficulty Calibration (Medium Question)              │
│                                                                 │
│  Question: Medium-difficulty, broad competency                 │
│  Outcomes:                                                      │
│    ✓ Correct   → STAGE 2A: Hard Question (level 4–5)          │
│    ✗ Incorrect → STAGE 2B: Easy Question (level 1–2)          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌──────────────────────────┐      ┌──────────────────────────┐
│ STAGE 2A: Hard Question  │      │ STAGE 2B: Easy Question  │
│                          │      │                          │
│ Question: Hard (L4–L5)   │      │ Question: Easy (L1–L2)   │
│ Outcomes:                │      │ Outcomes:                │
│  ✓ → STAGE 3: L5 Track   │      │  ✓ → STAGE 3: L2–L3     │
│  ✗ → STAGE 3: L3–L4      │      │  ✗ → STAGE 3: L1 Track  │
│                          │      │                          │
└──────────────────────────┘      └──────────────────────────┘
        ↓                                       ↓
        └───────────────────┬───────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 3: Final Calibration (Level-Specific Question)           │
│                                                                 │
│ Branch-aware questions (targeted to likely level):             │
│  L1 track:  Basic comprehension                                │
│  L2–L3:     Applied reasoning                                  │
│  L3–L4:     Synthesis + edge cases                             │
│  L5 track:  Mastery + novel scenarios                          │
│                                                                 │
│ Final answer determines final level (L1–L5)                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 State Machine Definition

```typescript
// Pseudo-code: Adaptive assessment state machine

type AssessmentStage = 'INITIAL' | 'STAGE_1' | 'STAGE_2A' | 'STAGE_2B' | 'STAGE_3' | 'COMPLETE';
type BranchPath = 'L1' | 'L2_L3' | 'L3_L4' | 'L5';
type ProficiencyLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

interface AssessmentState {
  assessment_id: string;
  competency_id: string;
  stage: AssessmentStage;
  branch_path: BranchPath | null;
  answers: Record<string, string>; // { question_id: answer_choice }
  current_question_id: string | null;
  final_level: ProficiencyLevel | null;
  created_at: ISO8601;
  completed_at: ISO8601 | null;
}

// Transition function
function nextStage(state: AssessmentState, answerCorrect: boolean): AssessmentState {
  switch (state.stage) {
    case 'STAGE_1':
      if (answerCorrect) {
        return { ...state, stage: 'STAGE_2A', branch_path: 'L5' };
      } else {
        return { ...state, stage: 'STAGE_2B', branch_path: 'L1' };
      }
    
    case 'STAGE_2A':
      if (answerCorrect) {
        return { ...state, stage: 'STAGE_3', branch_path: 'L5' };
      } else {
        return { ...state, stage: 'STAGE_3', branch_path: 'L3_L4' };
      }
    
    case 'STAGE_2B':
      if (answerCorrect) {
        return { ...state, stage: 'STAGE_3', branch_path: 'L2_L3' };
      } else {
        return { ...state, stage: 'STAGE_3', branch_path: 'L1' };
      }
    
    case 'STAGE_3':
      // Final answer determines final level
      const level = determineFinalLevel(state.branch_path, answerCorrect);
      return {
        ...state,
        stage: 'COMPLETE',
        final_level: level,
        completed_at: new Date().toISOString(),
      };
    
    default:
      throw new Error(`Invalid state transition from ${state.stage}`);
  }
}

function determineFinalLevel(branch: BranchPath, correct: boolean): ProficiencyLevel {
  if (branch === 'L1') return correct ? 'L1' : 'L1'; // Bottoms out
  if (branch === 'L2_L3') return correct ? 'L3' : 'L2';
  if (branch === 'L3_L4') return correct ? 'L4' : 'L3';
  if (branch === 'L5') return correct ? 'L5' : 'L4';
  throw new Error(`Invalid branch: ${branch}`);
}
```

### 2.3 Convergence Proof

Every path converges to exactly one level (L1–L5):
- L1 track: answers → L1 (correct or incorrect)
- L2–L3 track: answers → L2 or L3
- L3–L4 track: answers → L3 or L4
- L5 track: answers → L4 or L5

**No ambiguity**: Tree depth = 3, branching factor = 2, final outcomes = 5 levels. ✓

---

## 3. Offline Queue Architecture (Design)

### 3.1 IndexedDB Schema

```typescript
// IndexedDB database: "statvidya"
// Object store: "pending_assessments"

interface PendingAssessment {
  local_id: string;                    // UUID v4, generated client-side
  assessment_id: string;               // Server ID (assigned after sync)
  competency_id: string;
  user_id: string;
  final_level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  answers: Record<string, string>;     // { question_id: answer }
  branch_path: string;
  created_at: ISO8601;                 // Client timestamp (offline)
  submitted_at: ISO8601 | null;        // Server timestamp (online)
  sync_status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  sync_error: string | null;
  retry_count: number;
  last_retry_at: ISO8601 | null;
}

// Index: local_id (primary)
// Index: sync_status (for batch queries)
// Index: created_at (for chronological ordering)
```

### 3.2 Queue Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│ ASSESSMENT COMPLETED (Online or Offline)                     │
└──────────────────────────────────────────────────────────────┘
                            ↓
                ┌───────────┴───────────┐
                ↓                       ↓
        ┌────────────────┐      ┌────────────────┐
        │ Online?        │      │ Online?        │
        │ Yes: Sync Now  │      │ No: Queue      │
        └────────────────┘      └────────────────┘
                │                       │
                ↓                       ↓
        ┌────────────────┐      ┌────────────────┐
        │ POST to Edge   │      │ Write to IDB   │
        │ Function       │      │ status=PENDING │
        └────────────────┘      └────────────────┘
                │                       │
                ↓                       ↓
        ┌────────────────┐      ┌────────────────┐
        │ Edge Function: │      │ Wait for       │
        │ - Validate     │      │ reconnect      │
        │ - Score       │      │ (window.online)│
        │ - Audit log   │      └────────────────┘
        │ - Return L    │              │
        └────────────────┘              ↓
                │              ┌────────────────┐
                ↓              │ Flush queue:   │
        ┌────────────────┐     │ Exponential    │
        │ Update local   │     │ backoff retry  │
        │ DB + UI        │     └────────────────┘
        └────────────────┘              │
                                        ↓
                                ┌────────────────┐
                                │ POST batch to  │
                                │ Edge Function  │
                                └────────────────┘
                                        │
                    ┌───────────────────┬───────────────────┐
                    ↓                   ↓                   ↓
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ SUCCESS      │  │ PARTIAL      │  │ FAILED       │
            │ (all synced) │  │ (some failed)│  │ (all failed) │
            └──────────────┘  └──────────────┘  └──────────────┘
                    │                  │               │
                    ↓                  ↓               ↓
            Status=SYNCED      Retry failures    Retry later
                                (backoff)        (backoff)
```

### 3.3 Client-Side Queue Manager

```typescript
// services/offlineService.ts

interface OfflineQueueManager {
  // Add assessment to queue (offline or online pre-sync)
  queueAssessment(assessment: AssessmentResult): Promise<string>; // returns local_id
  
  // Get pending count (for UI: "🔴 2 Assessments Pending")
  getPendingCount(): Promise<number>;
  
  // Get pending assessments for sync
  getPendingAssessments(): Promise<PendingAssessment[]>;
  
  // Mark as syncing
  markSyncing(local_id: string): Promise<void>;
  
  // Mark as synced (successful response from Edge Function)
  markSynced(local_id: string, assessment_id: string): Promise<void>;
  
  // Mark as failed + increment retry count
  markFailed(local_id: string, error: string): Promise<void>;
  
  // Clear queue (only after explicit user action, logged)
  clearQueue(): Promise<void>;
  
  // Auto-flush on online (called by Offline Indicator)
  flushPendingOnline(): Promise<FlushResult>;
}

// Exponential backoff retry policy
function nextRetryDelay(retryCount: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 60000; // 60 seconds
  const delay = baseDelay * Math.pow(2, retryCount);
  return Math.min(delay + Math.random() * 1000, maxDelay); // jitter
}
```

### 3.4 IndexedDB Persistence Guarantees

**Scenario 1: Assessment completed offline, app closes**
- Assessment queued to IDB before UI confirms
- App reopens: queue manager reads IDB, shows "1 Assessment Pending"
- User goes online: queue flushes automatically
- ✅ Zero data loss

**Scenario 2: Sync in progress, network cuts**
- Assessment marked `sync_status='SYNCING'`
- Network cut before response received
- App crash (or user closes)
- App reopens: queue manager checks `SYNCING` assessments
- Marks as `FAILED`, increments retry count
- Next online event: retries with exponential backoff
- ✅ No double-scoring (local_id deduplicates server-side)

**Scenario 3: Browser storage cleared**
- User clears browser data / cache
- IDB is **NOT** cleared (separate from localStorage/sessionStorage)
- Queue persists across cache clear
- ✅ IDB is durable

---

## 4. Idempotent Reconciliation (Design)

### 4.1 Client-Generated `local_id` Strategy

```typescript
// Client generates UUID v4 before submitting
import { v4 as uuidv4 } from 'uuid';

interface PendingAssessment {
  local_id: string;        // Generated client-side, immutable
  assessment_id: string;   // Assigned by server after first sync
  // ...
}

async function submitAssessment(result: AssessmentResult) {
  const local_id = uuidv4(); // Generate once
  const payload = {
    local_id,
    competency_id: result.competency_id,
    final_level: result.final_level,
    answers: result.answers,
    branch_path: result.branch_path,
  };
  
  // Queue locally first
  await offlineService.queueAssessment({ local_id, ...payload });
  
  // If online, try to sync immediately
  if (navigator.onLine) {
    await flushQueue();
  }
}
```

### 4.2 Supabase Edge Function Deduplication

```sql
-- Pseudo-code: Edge Function logic (Deno)

export async function POST(req: Request) {
  const payload = await req.json();
  const { local_id, competency_id, final_level, answers } = payload;
  
  // 1. Check if local_id already processed (deduplication)
  const existing = await supabase
    .from('assessment_results')
    .select('id, final_level')
    .eq('local_id', local_id)
    .single();
  
  if (existing) {
    // Already processed: return cached result (idempotent)
    return {
      status: 200,
      body: {
        success: true,
        assessment_id: existing.id,
        final_level: existing.final_level,
        message: 'Assessment already recorded (idempotent response)',
      },
    };
  }
  
  // 2. Score the assessment (server-side)
  const final_level = scoreAssessment(answers, payload.branch_path);
  
  // 3. Validate score matches submitted level (detect tampering)
  if (final_level !== payload.final_level) {
    // Client tampered with score
    return {
      status: 400,
      body: {
        success: false,
        error: 'Score validation failed (tampering detected)',
      },
    };
  }
  
  // 4. Insert assessment result + audit log (atomic transaction)
  const { data, error } = await supabase
    .from('assessment_results')
    .insert({
      id: generateUUID(),
      local_id: local_id,
      competency_id: competency_id,
      user_id: (await supabase.auth.getUser()).user.id,
      final_level: final_level,
      answers: answers,
      branch_path: payload.branch_path,
      submitted_at: new Date().toISOString(),
      provenance: 'VERIFIED_OFFICIAL',
    });
  
  if (error) throw error;
  
  // 5. Audit log (database trigger creates entry automatically)
  // Trigger records: timestamp, user_id, action=ASSESSMENT_SUBMITTED, metadata
  
  return {
    status: 200,
    body: {
      success: true,
      assessment_id: data[0].id,
      final_level: data[0].final_level,
    },
  };
}
```

### 4.3 Idempotency Guarantees

| Scenario | Client Behavior | Server Behavior | Result |
|---|---|---|---|
| First submission (online) | POST with local_id | Receives, scores, inserts, audits | ✅ Assessment recorded |
| Network cut mid-response | Client retries with same local_id | Sees local_id exists, returns cached response | ✅ No double-score |
| User submits same assessment twice (bug) | Both POST with different local_id | Both get unique assessment_ids | ✅ Audit log shows both |
| Retry with exponential backoff | Client retries after delay with same local_id | Sees local_id, returns idempotent response | ✅ No duplicate |

**Proof of idempotency**: 
- `local_id` is unique per assessment submission (generated once)
- Server-side check: `WHERE local_id = ?` before insert
- If exists, return cached response (no new insert)
- ∴ Multiple identical requests → single recorded result ✓

---

## 5. Real-Time UI Status (Design)

### 5.1 Offline Banner State Machine

```typescript
type BannerState = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNC_FAILED' | 'SYNC_COMPLETE';

interface OfflineBannerProps {
  state: BannerState;
  pending_count: number;
  synced_count: number;
  total_count: number;
  last_error: string | null;
}

// UI rendering logic
function OfflineIndicator({ state, pending_count, synced_count, total_count, last_error }) {
  switch (state) {
    case 'ONLINE':
      if (pending_count === 0) return null; // Hidden
      return (
        <div className="offline-banner">
          <Wifi className="text-primary" size={16} />
          <span>✓ All {synced_count} assessments synced</span>
        </div>
      );
    
    case 'OFFLINE':
      return (
        <div className="offline-banner">
          <WifiOff className="text-destructive" size={16} />
          <span>🔴 {pending_count} assessments pending (offline)</span>
        </div>
      );
    
    case 'SYNCING':
      return (
        <div className="offline-banner animate-pulse">
          <RefreshCw className="text-primary animate-spin" size={16} />
          <span>Syncing… {synced_count}/{total_count} complete</span>
        </div>
      );
    
    case 'SYNC_FAILED':
      return (
        <div className="offline-banner">
          <AlertCircle className="text-destructive" size={16} />
          <span>Sync failed: {last_error}. <button onClick={retry}>Retry</button></span>
        </div>
      );
    
    case 'SYNC_COMPLETE':
      return (
        <div className="offline-banner">
          <CheckCircle className="text-primary" size={16} />
          <span>✓ {total_count} assessments synced successfully</span>
        </div>
      );
  }
}
```

### 5.2 Real-Time Updates (Supabase Realtime)

```typescript
// Subscribe to assessment results in real-time
supabase
  .channel('assessment_updates')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'assessment_results',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      // New assessment synced
      setOfflineBannerState('SYNC_COMPLETE');
      setOfflineCount(offlineCount - 1);
      // Broadcast to dashboard for real-time refresh
    }
  )
  .subscribe();
```

---

## 6. Server-Side Audit Trail (Design)

### 6.1 Assessment Results + Audit Log

```sql
-- Table: assessment_results
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID NOT NULL UNIQUE, -- Client-generated, for idempotency
  competency_id UUID NOT NULL REFERENCES competencies(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  final_level TEXT NOT NULL CHECK (final_level IN ('L1', 'L2', 'L3', 'L4', 'L5')),
  answers JSONB NOT NULL, -- { question_id: answer_choice }
  branch_path TEXT NOT NULL, -- 'L1' | 'L2_L3' | 'L3_L4' | 'L5'
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  provenance TEXT NOT NULL DEFAULT 'VERIFIED_OFFICIAL',
  organization_id UUID NOT NULL REFERENCES organizations(id),
  
  CONSTRAINT user_org_consistency CHECK (
    -- RLS: user must belong to organization
  )
);

-- Table: audit_log (append-only)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'ASSESSMENT_SUBMITTED'
  resource_type TEXT NOT NULL, -- 'assessment_result'
  resource_id UUID NOT NULL, -- assessment_result.id
  metadata JSONB, -- { final_level, competency_id, submitted_from: 'OFFLINE' | 'ONLINE' }
  organization_id UUID NOT NULL REFERENCES organizations(id),
  
  -- Immutable: no UPDATE/DELETE allowed
  CONSTRAINT immutable_audit CHECK (TRUE)
);

-- Trigger: Auto-create audit log on INSERT
CREATE TRIGGER audit_assessment_submitted
AFTER INSERT ON assessment_results
FOR EACH ROW
EXECUTE FUNCTION audit_log_insert();

-- Trigger function
CREATE FUNCTION audit_log_insert() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (user_id, action, resource_type, resource_id, metadata, organization_id)
  VALUES (
    NEW.user_id,
    'ASSESSMENT_SUBMITTED',
    'assessment_result',
    NEW.id,
    jsonb_build_object(
      'final_level', NEW.final_level,
      'competency_id', NEW.competency_id,
      'branch_path', NEW.branch_path
    ),
    NEW.organization_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 6.2 RLS Policies (Multi-Tenant Security)

```sql
-- Assessment results: users can only read/write their own
CREATE POLICY "Users can only access own assessments"
ON assessment_results
FOR SELECT
USING (user_id = (SELECT auth.uid()) AND organization_id = current_user_org());

CREATE POLICY "Users can only insert own assessments"
ON assessment_results
FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()) AND organization_id = current_user_org());

-- Audit log: append-only, users can only read their org's logs
CREATE POLICY "Users can read org audit log"
ON audit_log
FOR SELECT
USING (organization_id = current_user_org());

CREATE POLICY "Audit log is append-only (triggers only)"
ON audit_log
FOR INSERT
WITH CHECK (organization_id = current_user_org());
```

---

## 7. Failure Modes & Recovery (Design)

### 7.1 Failure Scenarios

| Failure | Detection | Recovery |
|---|---|---|
| Network cut during sync | Timeout on Edge Function POST | Exponential backoff retry |
| App crash mid-sync | Queue marked `SYNCING` on reopening | Retry marked `FAILED` assessments |
| Edge Function timeout | Client timeout after 30s | Retry; if idempotent, no harm |
| Browser crash before queue write | Assessment lost | Prevent by writing IDB *before* UI success |
| Partial batch sync (3/5 succeed) | Batch response includes failures | Retry only failed local_ids |
| Server error (assessment validation failed) | Edge Function returns 400 | User sees error; can retry or discard |
| Duplicate submission (user clicks "Submit" twice) | Same local_id in queue | Second attempt becomes no-op |

### 7.2 Recovery Strategies

**Strategy 1: Write-First Pattern**
```typescript
async function submitAssessment(result) {
  // 1. Write to IDB FIRST (survives crash)
  const local_id = uuidv4();
  await offlineService.queueAssessment({ local_id, ...result });
  
  // 2. Then try to sync
  try {
    await syncAssessment(local_id);
  } catch (err) {
    // Sync failed, but assessment safely queued
    console.log('Assessment queued for later sync');
  }
}
```

**Strategy 2: Exponential Backoff**
```typescript
async function flushQueueWithRetry() {
  const pending = await offlineService.getPendingAssessments();
  
  for (const assessment of pending) {
    if (assessment.retry_count > MAX_RETRIES) {
      // Give up after 5 retries (spans ~2 hours with backoff)
      await offlineService.markFailed(assessment.local_id, 'Max retries exceeded');
      continue;
    }
    
    const delay = nextRetryDelay(assessment.retry_count);
    await sleep(delay);
    
    try {
      await syncAssessment(assessment.local_id);
      await offlineService.markSynced(assessment.local_id, response.assessment_id);
    } catch (err) {
      await offlineService.markFailed(assessment.local_id, err.message);
    }
  }
}
```

**Strategy 3: Idempotency as Safety Net**
```
If client retries with same local_id:
  Server sees: "local_id already exists → return cached response"
  Result: No duplicate assessment recorded ✓
```

---

## 8. Implementation Dependencies & Critical Path

### 8.1 Dependency Graph

```
1. assessmentService.ts (branching logic) ←┐
                                            ├─→ Assessment Runner UI
2. offlineService.ts (IDB queue)    ←┐     │
                                     ├─→ Offline Indicator
3. Supabase Edge Function (scoring) ←┤
   (evaluate-assessment)              │
                                      ├─→ Dashboard (Realtime updates)
4. Database triggers (audit_log)     ←┘
5. RLS policies (multi-tenant)       
```

### 8.2 Test-First Strategy

**Unit Tests (TDD)**:
1. Branching convergence: all answer sequences → L1–L5 ✓
2. State machine transitions: no invalid states ✓
3. IDB persistence: survives app crash simulation ✓
4. Idempotency: retry with same local_id → same result ✓

**Integration Tests**:
1. Offline submission → queue → online sync ✓
2. Network cut mid-sync → queue state recovery ✓
3. Batch partial failure → selective retry ✓
4. Edge Function deduplication ✓

---

## 9. Phase 4 Deliverables (Refined)

### Micro-Tasks (Ready for `/executing-plans`)

| # | Task | Depends | Type | Est |
|---|---|---|---|---|
| 1 | `assessmentService.ts` — branching logic + tests | — | Logic + Tests | 3h |
| 2 | `offlineService.ts` — IDB queue manager | 1 | Logic | 2h |
| 3 | Assessment Runner UI (`/assessment/[id]`) | 1 | UI | 3h |
| 4 | Seed 15+ bilingual assessment questions | — | Data | 2h |
| 5 | Supabase Edge Function `evaluate-assessment` | 1 | Backend | 2h |
| 6 | Database triggers + RLS policies | 5 | Backend | 1h |
| 7 | Offline Indicator with real-time status | 2 | UI + Realtime | 2h |
| 8 | Auto-flush on `window.online` + retry logic | 2, 5 | Logic | 2h |
| 9 | Service Worker caching for assessment routes | — | PWA | 1h |
| 10 | Integration tests (idempotency, offline→online) | 1–9 | Tests | 3h |

**Total Estimated**: 21 hours (3–4 days with buffer)

---

## 10. Design Decisions Summary (Locked)

✅ **3-stage branching** → Deterministic, convergent, testable  
✅ **Client-generated `local_id`** → Idempotent deduplication  
✅ **Write-first to IDB** → Zero data loss on crash  
✅ **Exponential backoff** → Graceful retry without poll spam  
✅ **Edge Function server-side scoring** → No client tampering  
✅ **Audit triggers** → Immutable compliance trail  
✅ **Realtime UI updates** → No polling overhead  

---

**Next Step**: Use `/executing-plans` to break these 10 deliverables into a detailed sprint plan with exact implementation steps, file paths, and test scenarios.

**Status**: 🟢 Design locked; ready for implementation  
**Date**: 2026-09-05 16:48 UTC
