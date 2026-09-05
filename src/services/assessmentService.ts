/**
 * assessmentService.ts — Adaptive Assessment Engine
 *
 * 3-stage adaptive branching state machine for StatVidya competency assessment.
 * Implements deterministic progression from calibration → difficulty-adjusted → level-specific
 * to converge on a single proficiency level (L1–L5).
 *
 * Design: PHASE_4_BRAINSTORM.md § 2
 */

export type ProficiencyLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
export type AssessmentStage = 'INITIAL' | 'STAGE_1' | 'STAGE_2A' | 'STAGE_2B' | 'STAGE_3' | 'COMPLETE';
export type BranchPath = 'L1' | 'L2_L3' | 'L3_L4' | 'L5';

/**
 * AssessmentState — Complete state for an in-progress assessment
 */
export interface AssessmentState {
  assessment_id: string;
  competency_id: string;
  user_id: string;
  stage: AssessmentStage;
  branch_path: BranchPath | null;
  answers: Record<string, string>; // { question_id: answer_choice_index }
  current_question_id: string | null;
  final_level: ProficiencyLevel | null;
  created_at: string; // ISO8601
  completed_at: string | null; // ISO8601 | null
}

/**
 * AssessmentResult — Final result ready for submission
 */
export interface AssessmentResult extends Omit<AssessmentState, 'current_question_id'> {
  stage: 'COMPLETE';
  final_level: ProficiencyLevel;
  completed_at: string;
}

/**
 * =========================================================================
 * 3-STAGE ADAPTIVE BRANCHING STATE MACHINE
 * =========================================================================
 *
 * Stage 1: Medium question (difficulty calibration)
 *   ✓ Correct → Stage 2A (Hard) → L5 track
 *   ✗ Incorrect → Stage 2B (Easy) → L1 track
 *
 * Stage 2A/2B: Difficulty-specific question
 *   Stage 2A:
 *     ✓ Correct → Stage 3 with branch_path='L5'
 *     ✗ Incorrect → Stage 3 with branch_path='L3_L4'
 *   Stage 2B:
 *     ✓ Correct → Stage 3 with branch_path='L2_L3'
 *     ✗ Incorrect → Stage 3 with branch_path='L1'
 *
 * Stage 3: Level-specific question (final calibration)
 *   Outcome determines final proficiency level based on branch_path
 */

/**
 * nextStage — Deterministic state machine transition
 *
 * Takes current state + user's answer (correct/incorrect) and returns next state.
 * Throws if state is already COMPLETE or invalid.
 *
 * @param state Current assessment state
 * @param answerCorrect Whether the user's answer was correct
 * @param nextQuestionId Question ID for next stage (or null if complete)
 * @returns Updated state with new stage and branch_path
 */
export function nextStage(
  state: AssessmentState,
  answerCorrect: boolean,
  nextQuestionId: string | null
): AssessmentState {
  if (state.stage === 'COMPLETE') {
    throw new Error('Assessment already complete; cannot transition further');
  }

  switch (state.stage) {
    case 'INITIAL':
      throw new Error('Invalid initial state; call initializeAssessment() first');

    case 'STAGE_1': {
      // Difficulty calibration
      const newBranchPath: BranchPath = answerCorrect ? 'L5' : 'L1';
      return {
        ...state,
        stage: answerCorrect ? 'STAGE_2A' : 'STAGE_2B',
        branch_path: newBranchPath,
        current_question_id: nextQuestionId,
      };
    }

    case 'STAGE_2A': {
      // Hard question → L5 or L3_L4
      const newBranchPath: BranchPath = answerCorrect ? 'L5' : 'L3_L4';
      return {
        ...state,
        stage: 'STAGE_3',
        branch_path: newBranchPath,
        current_question_id: nextQuestionId,
      };
    }

    case 'STAGE_2B': {
      // Easy question → L2_L3 or L1
      const newBranchPath: BranchPath = answerCorrect ? 'L2_L3' : 'L1';
      return {
        ...state,
        stage: 'STAGE_3',
        branch_path: newBranchPath,
        current_question_id: nextQuestionId,
      };
    }

    case 'STAGE_3': {
      // Final question → determine proficiency level
      if (state.branch_path === null) {
        throw new Error('Branch path must be set before Stage 3');
      }

      const finalLevel = determineFinalLevel(state.branch_path, answerCorrect);

      return {
        ...state,
        stage: 'COMPLETE',
        final_level: finalLevel,
        completed_at: new Date().toISOString(),
        current_question_id: null,
      };
    }

    default:
      // TypeScript exhaustiveness check (unreachable)
      const _exhaustive: never = state.stage;
      return _exhaustive;
  }
}

/**
 * determineFinalLevel — Branch-aware final proficiency level mapping
 *
 * Takes the current branch_path and final answer correctness,
 * returns the proficiency level (L1–L5).
 *
 * Convergence proof:
 *   L1 branch: always → L1 (bottoms out)
 *   L2_L3 branch: correct → L3, incorrect → L2
 *   L3_L4 branch: correct → L4, incorrect → L3
 *   L5 branch: correct → L5, incorrect → L4
 *
 * Result: All 8 paths (2³) converge to exactly one level in {L1, L2, L3, L4, L5}
 *
 * @param branch Current branch path
 * @param correct Whether final answer was correct
 * @returns Proficiency level (L1–L5)
 */
export function determineFinalLevel(branch: BranchPath, correct: boolean): ProficiencyLevel {
  switch (branch) {
    case 'L1':
      // L1 branch always converges to L1 (no upward path from here)
      return 'L1';

    case 'L2_L3':
      return correct ? 'L3' : 'L2';

    case 'L3_L4':
      return correct ? 'L4' : 'L3';

    case 'L5':
      return correct ? 'L5' : 'L4';

    default:
      const _exhaustive: never = branch;
      return _exhaustive;
  }
}

/**
 * initializeAssessment — Create a new assessment state
 *
 * @param competency_id UUID of competency being assessed
 * @param user_id UUID of user taking assessment
 * @param firstQuestionId Question ID for Stage 1
 * @returns Initial assessment state ready for Stage 1
 */
export function initializeAssessment(
  competency_id: string,
  user_id: string,
  firstQuestionId: string
): AssessmentState {
  return {
    assessment_id: generateUUID(), // Client-generated; will be replaced by server
    competency_id,
    user_id,
    stage: 'STAGE_1',
    branch_path: null,
    answers: {},
    current_question_id: firstQuestionId,
    final_level: null,
    created_at: new Date().toISOString(),
    completed_at: null,
  };
}

/**
 * recordAnswer — Record user's answer to current question
 *
 * Mutates state.answers; does NOT transition stage (caller must call nextStage).
 *
 * @param state Current assessment state
 * @param questionId Question being answered
 * @param answerIndex 0-based index of selected answer
 * @returns Updated state with answer recorded
 */
export function recordAnswer(
  state: AssessmentState,
  questionId: string,
  answerIndex: number
): AssessmentState {
  if (state.stage === 'COMPLETE') {
    throw new Error('Assessment already complete; cannot record new answers');
  }

  return {
    ...state,
    answers: {
      ...state.answers,
      [questionId]: answerIndex.toString(),
    },
  };
}

/**
 * getCompletionPercentage — Calculate assessment completion (for UI progress)
 *
 * Returns a number 0–1 representing progress through the assessment.
 * Since assessment is exactly 3 questions, each stage = 33% progress.
 *
 * @param state Current assessment state
 * @returns Progress 0–1
 */
export function getCompletionPercentage(state: AssessmentState): number {
  switch (state.stage) {
    case 'STAGE_1':
      return 0;
    case 'STAGE_2A':
    case 'STAGE_2B':
      return 0.33;
    case 'STAGE_3':
      return 0.66;
    case 'COMPLETE':
      return 1;
    default:
      return 0;
  }
}

/**
 * Helper: Generate a simple UUID v4 (for local_id generation)
 * In production, use uuid package (import { v4 as uuidv4 } from 'uuid')
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for non-crypto environments (testing)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * =========================================================================
 * EXPORTS FOR TESTING
 * =========================================================================
 */
export default {
  nextStage,
  determineFinalLevel,
  initializeAssessment,
  recordAnswer,
  getCompletionPercentage,
  generateUUID,
};
