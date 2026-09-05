/**
 * assessmentService.test.ts — Comprehensive unit tests for adaptive branching
 *
 * Tests all 8 possible answer paths (2³ branches) to verify:
 * 1. Deterministic transitions (same answers → same level)
 * 2. Convergence (all paths → exactly one level in {L1, L2, L3, L4, L5})
 * 3. No invalid state transitions
 * 4. Error handling (invalid operations)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  AssessmentState,
  nextStage,
  determineFinalLevel,
  initializeAssessment,
  recordAnswer,
  getCompletionPercentage,
  generateUUID,
  type ProficiencyLevel,
} from './assessmentService';

describe('assessmentService — Adaptive Branching State Machine', () => {
  let state: AssessmentState;
  const competencyId = 'comp-nsso-survey-sampling';
  const userId = 'user-sunita-devi';

  beforeEach(() => {
    state = initializeAssessment(competencyId, userId, 'q-stage1-medium');
  });

  // ========================================================================
  // TEST SUITE 1: Initialization
  // ========================================================================

  describe('initializeAssessment', () => {
    it('creates initial state with STAGE_1', () => {
      expect(state.stage).toBe('STAGE_1');
      expect(state.branch_path).toBe(null);
      expect(state.final_level).toBe(null);
      expect(state.answers).toEqual({});
      expect(state.current_question_id).toBe('q-stage1-medium');
    });

    it('generates unique assessment_id', () => {
      const state1 = initializeAssessment(competencyId, userId, 'q1');
      const state2 = initializeAssessment(competencyId, userId, 'q1');
      expect(state1.assessment_id).not.toBe(state2.assessment_id);
    });

    it('records created_at timestamp', () => {
      const before = new Date();
      const s = initializeAssessment(competencyId, userId, 'q1');
      const after = new Date();
      const created = new Date(s.created_at);
      expect(created.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(created.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  // ========================================================================
  // TEST SUITE 2: Answer Recording
  // ========================================================================

  describe('recordAnswer', () => {
    it('records answer to current question', () => {
      const updated = recordAnswer(state, 'q-stage1-medium', 0);
      expect(updated.answers['q-stage1-medium']).toBe('0');
    });

    it('accumulates multiple answers', () => {
      let s = recordAnswer(state, 'q1', 2);
      s = recordAnswer(s, 'q2', 1);
      expect(s.answers).toEqual({ q1: '2', q2: '1' });
    });

    it('allows overwriting previous answer', () => {
      let s = recordAnswer(state, 'q1', 0);
      s = recordAnswer(s, 'q1', 2);
      expect(s.answers['q1']).toBe('2');
    });

    it('throws if assessment already complete', () => {
      let s = state;
      s = nextStage(s, true, 'q-stage2a'); // → STAGE_2A, L5 branch
      s = nextStage(s, true, 'q-stage3'); // → STAGE_3, L5 branch
      s = nextStage(s, true, null); // → COMPLETE, L5

      expect(() => recordAnswer(s, 'q-new', 0)).toThrow(/already complete/);
    });
  });

  // ========================================================================
  // TEST SUITE 3: Stage 1 Transitions (Difficulty Calibration)
  // ========================================================================

  describe('nextStage from STAGE_1', () => {
    it('correct answer → STAGE_2A, branch_path=L5', () => {
      const updated = nextStage(state, true, 'q-stage2a');
      expect(updated.stage).toBe('STAGE_2A');
      expect(updated.branch_path).toBe('L5');
      expect(updated.current_question_id).toBe('q-stage2a');
    });

    it('incorrect answer → STAGE_2B, branch_path=L1', () => {
      const updated = nextStage(state, false, 'q-stage2b');
      expect(updated.stage).toBe('STAGE_2B');
      expect(updated.branch_path).toBe('L1');
      expect(updated.current_question_id).toBe('q-stage2b');
    });
  });

  // ========================================================================
  // TEST SUITE 4: Stage 2A Transitions (Hard Question)
  // ========================================================================

  describe('nextStage from STAGE_2A', () => {
    beforeEach(() => {
      state = nextStage(state, true, 'q-stage2a'); // Correct in Stage 1 → STAGE_2A, L5
    });

    it('correct answer → STAGE_3, branch_path=L5 (unchanged)', () => {
      const updated = nextStage(state, true, 'q-stage3');
      expect(updated.stage).toBe('STAGE_3');
      expect(updated.branch_path).toBe('L5');
    });

    it('incorrect answer → STAGE_3, branch_path=L3_L4', () => {
      const updated = nextStage(state, false, 'q-stage3');
      expect(updated.stage).toBe('STAGE_3');
      expect(updated.branch_path).toBe('L3_L4');
    });
  });

  // ========================================================================
  // TEST SUITE 5: Stage 2B Transitions (Easy Question)
  // ========================================================================

  describe('nextStage from STAGE_2B', () => {
    beforeEach(() => {
      state = nextStage(state, false, 'q-stage2b'); // Incorrect in Stage 1 → STAGE_2B, L1
    });

    it('correct answer → STAGE_3, branch_path=L2_L3', () => {
      const updated = nextStage(state, true, 'q-stage3');
      expect(updated.stage).toBe('STAGE_3');
      expect(updated.branch_path).toBe('L2_L3');
    });

    it('incorrect answer → STAGE_3, branch_path=L1 (unchanged)', () => {
      const updated = nextStage(state, false, 'q-stage3');
      expect(updated.stage).toBe('STAGE_3');
      expect(updated.branch_path).toBe('L1');
    });
  });

  // ========================================================================
  // TEST SUITE 6: Stage 3 Transitions → Final Proficiency Level
  // ========================================================================

  describe('nextStage from STAGE_3', () => {
    it('L1 branch + correct → L1', () => {
      let s = state;
      s = nextStage(s, false, 'q-stage2b'); // → STAGE_2B, L1
      s = nextStage(s, false, 'q-stage3'); // → STAGE_3, L1
      const result = nextStage(s, true, null); // → COMPLETE
      expect(result.stage).toBe('COMPLETE');
      expect(result.final_level).toBe('L1');
    });

    it('L1 branch + incorrect → L1', () => {
      let s = state;
      s = nextStage(s, false, 'q-stage2b'); // → STAGE_2B, L1
      s = nextStage(s, false, 'q-stage3'); // → STAGE_3, L1
      const result = nextStage(s, false, null); // → COMPLETE
      expect(result.stage).toBe('COMPLETE');
      expect(result.final_level).toBe('L1');
    });

    it('L2_L3 branch + correct → L3', () => {
      let s = state;
      s = nextStage(s, false, 'q-stage2b'); // → STAGE_2B, L1
      s = nextStage(s, true, 'q-stage3'); // → STAGE_3, L2_L3
      const result = nextStage(s, true, null); // → COMPLETE
      expect(result.final_level).toBe('L3');
    });

    it('L2_L3 branch + incorrect → L2', () => {
      let s = state;
      s = nextStage(s, false, 'q-stage2b'); // → STAGE_2B, L1
      s = nextStage(s, true, 'q-stage3'); // → STAGE_3, L2_L3
      const result = nextStage(s, false, null); // → COMPLETE
      expect(result.final_level).toBe('L2');
    });

    it('L3_L4 branch + correct → L4', () => {
      let s = state;
      s = nextStage(s, true, 'q-stage2a'); // → STAGE_2A, L5
      s = nextStage(s, false, 'q-stage3'); // → STAGE_3, L3_L4
      const result = nextStage(s, true, null); // → COMPLETE
      expect(result.final_level).toBe('L4');
    });

    it('L3_L4 branch + incorrect → L3', () => {
      let s = state;
      s = nextStage(s, true, 'q-stage2a'); // → STAGE_2A, L5
      s = nextStage(s, false, 'q-stage3'); // → STAGE_3, L3_L4
      const result = nextStage(s, false, null); // → COMPLETE
      expect(result.final_level).toBe('L3');
    });

    it('L5 branch + correct → L5', () => {
      let s = state;
      s = nextStage(s, true, 'q-stage2a'); // → STAGE_2A, L5
      s = nextStage(s, true, 'q-stage3'); // → STAGE_3, L5
      const result = nextStage(s, true, null); // → COMPLETE
      expect(result.final_level).toBe('L5');
    });

    it('L5 branch + incorrect → L4', () => {
      let s = state;
      s = nextStage(s, true, 'q-stage2a'); // → STAGE_2A, L5
      s = nextStage(s, true, 'q-stage3'); // → STAGE_3, L5
      const result = nextStage(s, false, null); // → COMPLETE
      expect(result.final_level).toBe('L4');
    });
  });

  // ========================================================================
  // TEST SUITE 7: Convergence Proof (All 8 Paths)
  // ========================================================================

  describe('convergence — all 8 answer paths', () => {
    const paths: Array<{
      stage1: boolean;
      stage2: boolean;
      stage3: boolean;
      expectedLevel: ProficiencyLevel;
    }> = [
      // Path 1: T, T, T
      { stage1: true, stage2: true, stage3: true, expectedLevel: 'L5' },
      // Path 2: T, T, F
      { stage1: true, stage2: true, stage3: false, expectedLevel: 'L4' },
      // Path 3: T, F, T
      { stage1: true, stage2: false, stage3: true, expectedLevel: 'L4' },
      // Path 4: T, F, F
      { stage1: true, stage2: false, stage3: false, expectedLevel: 'L3' },
      // Path 5: F, T, T
      { stage1: false, stage2: true, stage3: true, expectedLevel: 'L3' },
      // Path 6: F, T, F
      { stage1: false, stage2: true, stage3: false, expectedLevel: 'L2' },
      // Path 7: F, F, T
      { stage1: false, stage2: false, stage3: true, expectedLevel: 'L1' },
      // Path 8: F, F, F
      { stage1: false, stage2: false, stage3: false, expectedLevel: 'L1' },
    ];

    paths.forEach(({ stage1, stage2, stage3, expectedLevel }, idx) => {
      it(`path ${idx + 1}: (${stage1 ? 'T' : 'F'}, ${stage2 ? 'T' : 'F'}, ${stage3 ? 'T' : 'F'}) → ${expectedLevel}`, () => {
        let s = initializeAssessment(competencyId, userId, 'q1');
        s = nextStage(s, stage1, 'q2');
        s = nextStage(s, stage2, 'q3');
        const result = nextStage(s, stage3, null);

        expect(result.stage).toBe('COMPLETE');
        expect(result.final_level).toBe(expectedLevel);
      });
    });

    it('convergence: all 8 paths produce unique or valid L1–L5 outcomes', () => {
      const outcomes = new Set<ProficiencyLevel>();
      paths.forEach(({ stage1, stage2, stage3, expectedLevel }) => {
        let s = initializeAssessment(competencyId, userId, 'q1');
        s = nextStage(s, stage1, 'q2');
        s = nextStage(s, stage2, 'q3');
        const result = nextStage(s, stage3, null);
        expect(result.final_level).toBe(expectedLevel);
        outcomes.add(expectedLevel);
      });

      // Verify outcomes span at least 3 levels (not degenerate)
      expect(outcomes.size).toBeGreaterThanOrEqual(3);
    });
  });

  // ========================================================================
  // TEST SUITE 8: Deterministic Property
  // ========================================================================

  describe('determinism — same answers always produce same level', () => {
    it('running same path twice produces identical results', () => {
      const run1 = (() => {
        let s = initializeAssessment(competencyId, userId, 'q1');
        s = nextStage(s, true, 'q2');
        s = nextStage(s, false, 'q3');
        return nextStage(s, true, null);
      })();

      const run2 = (() => {
        let s = initializeAssessment(competencyId, userId, 'q1');
        s = nextStage(s, true, 'q2');
        s = nextStage(s, false, 'q3');
        return nextStage(s, true, null);
      })();

      expect(run1.final_level).toBe(run2.final_level);
      expect(run1.branch_path).toBe(run2.branch_path);
    });
  });

  // ========================================================================
  // TEST SUITE 9: Error Handling
  // ========================================================================

  describe('error handling', () => {
    it('throws if attempting to transition from COMPLETE', () => {
      let s = state;
      s = nextStage(s, true, 'q2');
      s = nextStage(s, true, 'q3');
      s = nextStage(s, true, null); // → COMPLETE
      expect(() => nextStage(s, true, null)).toThrow(/already complete/);
    });

    it('throws if branch_path is null in STAGE_3 (invalid state)', () => {
      let s = state;
      s = nextStage(s, true, 'q2');
      s = nextStage(s, true, 'q3');
      // Manually corrupt state (should never happen in practice)
      const corrupted: AssessmentState = {
        ...s,
        branch_path: null, // Invalid!
      };
      expect(() => nextStage(corrupted, true, null)).toThrow(/Branch path must be set/);
    });
  });

  // ========================================================================
  // TEST SUITE 10: Completion Percentage (UI Progress)
  // ========================================================================

  describe('getCompletionPercentage', () => {
    it('STAGE_1 → 0%', () => {
      expect(getCompletionPercentage(state)).toBe(0);
    });

    it('STAGE_2A → 33%', () => {
      const s = nextStage(state, true, 'q2');
      expect(getCompletionPercentage(s)).toBe(0.33);
    });

    it('STAGE_2B → 33%', () => {
      const s = nextStage(state, false, 'q2');
      expect(getCompletionPercentage(s)).toBe(0.33);
    });

    it('STAGE_3 → 66%', () => {
      let s = state;
      s = nextStage(s, true, 'q2');
      s = nextStage(s, true, 'q3');
      expect(getCompletionPercentage(s)).toBe(0.66);
    });

    it('COMPLETE → 100%', () => {
      let s = state;
      s = nextStage(s, true, 'q2');
      s = nextStage(s, true, 'q3');
      s = nextStage(s, true, null);
      expect(getCompletionPercentage(s)).toBe(1);
    });
  });

  // ========================================================================
  // TEST SUITE 11: determineFinalLevel (Direct Tests)
  // ========================================================================

  describe('determineFinalLevel (branch-aware mapping)', () => {
    it('L1 + correct → L1', () => {
      expect(determineFinalLevel('L1', true)).toBe('L1');
    });

    it('L1 + incorrect → L1', () => {
      expect(determineFinalLevel('L1', false)).toBe('L1');
    });

    it('L2_L3 + correct → L3', () => {
      expect(determineFinalLevel('L2_L3', true)).toBe('L3');
    });

    it('L2_L3 + incorrect → L2', () => {
      expect(determineFinalLevel('L2_L3', false)).toBe('L2');
    });

    it('L3_L4 + correct → L4', () => {
      expect(determineFinalLevel('L3_L4', true)).toBe('L4');
    });

    it('L3_L4 + incorrect → L3', () => {
      expect(determineFinalLevel('L3_L4', false)).toBe('L3');
    });

    it('L5 + correct → L5', () => {
      expect(determineFinalLevel('L5', true)).toBe('L5');
    });

    it('L5 + incorrect → L4', () => {
      expect(determineFinalLevel('L5', false)).toBe('L4');
    });
  });

  // ========================================================================
  // TEST SUITE 12: UUID Generation
  // ========================================================================

  describe('generateUUID', () => {
    it('generates valid UUID v4 format', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it('generates unique UUIDs', () => {
      const set = new Set();
      for (let i = 0; i < 100; i++) {
        set.add(generateUUID());
      }
      expect(set.size).toBe(100);
    });
  });

  // ========================================================================
  // TEST SUITE 13: No Invalid Transitions
  // ========================================================================

  describe('state machine invariants', () => {
    it('branching creates exactly one possible next stage from each stage', () => {
      // From STAGE_1 with correct: must go to STAGE_2A
      const stage2aCorrect = nextStage(state, true, 'q2');
      expect(stage2aCorrect.stage).toBe('STAGE_2A');

      // From STAGE_1 with incorrect: must go to STAGE_2B
      const stage2bIncorrect = nextStage(state, false, 'q2');
      expect(stage2bIncorrect.stage).toBe('STAGE_2B');

      // No other stages are reachable from STAGE_1
      expect([stage2aCorrect.stage, stage2bIncorrect.stage]).toEqual(['STAGE_2A', 'STAGE_2B']);
    });

    it('all paths from STAGE_1 eventually reach COMPLETE in exactly 3 steps', () => {
      const answers = [
        [true, true, true],
        [true, true, false],
        [true, false, true],
        [true, false, false],
        [false, true, true],
        [false, true, false],
        [false, false, true],
        [false, false, false],
      ];

      answers.forEach((path) => {
        let s = state;
        let steps = 0;

        for (const correct of path) {
          s = nextStage(s, correct, `q${steps + 2}`);
          steps++;
        }

        // After Stage 1 + Stage 2 + Stage 3 = 3 transitions
        expect(s.stage).toBe('COMPLETE');
        expect(steps).toBe(3);
      });
    });
  });
});
