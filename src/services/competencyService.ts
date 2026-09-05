/**
 * Competency Service
 * Core domain logic for gap calculation, readiness indexing, and severity computation
 * Framework-agnostic (no React dependencies)
 */

import type {
  ActivityCompetency,
  CompetencyRecord,
  CompetencyGap,
  ActivityPriority,
  SeverityBucket,
  Activity,
  Competency,
  Role,
} from './types';

// ============================================================================
// CONSTANTS
// ============================================================================

const PRIORITY_WEIGHTS: Record<ActivityPriority, number> = {
  critical: 3,
  important: 2,
  desirable: 1,
};

const SEVERITY_THRESHOLDS = {
  HIGH: 4,
  MODERATE: 2,
  PROFICIENT: 0,
};

// ============================================================================
// GAP SEVERITY CALCULATION
// ============================================================================

/**
 * Compute gap severity score based on level delta and activity priority
 * Formula: (targetLevel - currentLevel) × priorityWeight
 */
export function computeGapSeverity(
  currentLevel: number,
  targetLevel: number,
  priority: ActivityPriority
): number {
  const gap = targetLevel - currentLevel;
  if (gap <= 0) return 0;

  const weight = PRIORITY_WEIGHTS[priority];
  return gap * weight;
}

/**
 * Classify severity score into buckets
 */
export function classifySeverity(score: number): SeverityBucket {
  if (score >= SEVERITY_THRESHOLDS.HIGH) return 'HIGH';
  if (score >= SEVERITY_THRESHOLDS.MODERATE) return 'MODERATE';
  return 'PROFICIENT';
}

/**
 * Build competency gap from a competency and its current state
 */
export function buildCompetencyGap(
  competency: Competency,
  activity: Activity,
  currentLevel: number,
  targetLevel: number,
  priority: ActivityPriority,
  evidenceType: 'self-assessed' | 'assessment-verified'
): CompetencyGap {
  const severityScore = computeGapSeverity(currentLevel, targetLevel, priority);
  const severity = classifySeverity(severityScore);

  return {
    competencyId: competency.id,
    competency,
    activity,
    currentLevel,
    targetLevel,
    gap: targetLevel - currentLevel,
    priority,
    severity,
    evidenceType,
  };
}

// ============================================================================
// READINESS INDEX CALCULATION
// ============================================================================

/**
 * Compute workforce readiness index for a user
 * Returns: (number of competencies meeting target / total required) × 100
 *
 * Inputs:
 *   - requiredCompetencies: array of [competencyId, targetLevel, priority]
 *   - userRecords: map of competencyId → current level
 *
 * Returns: 0-100 (percentage)
 */
export function computeReadinessIndex(
  requiredCompetencies: Array<{ competencyId: string; targetLevel: number }>,
  userRecords: Map<string, number>
): number {
  if (requiredCompetencies.length === 0) return 0;

  const metCount = requiredCompetencies.filter((req) => {
    const userLevel = userRecords.get(req.competencyId) ?? 0;
    return userLevel >= req.targetLevel;
  }).length;

  return Math.round((metCount / requiredCompetencies.length) * 100);
}

// ============================================================================
// GAP ANALYSIS PIPELINE
// ============================================================================

interface GapAnalysisInput {
  competencies: Map<string, Competency>;
  activities: Map<string, Activity>;
  activityCompetencies: ActivityCompetency[];
  userRecords: Map<string, CompetencyRecord>;
  userRole?: Role;
}

interface GapAnalysisOutput {
  gaps: CompetencyGap[];
  readinessIndex: number;
  topGaps: CompetencyGap[];
}

/**
 * Complete gap analysis for a user
 * Returns sorted gaps (by severity) and readiness index
 */
export function analyzeCompetencyGaps(input: GapAnalysisInput): GapAnalysisOutput {
  const {
    competencies,
    activities,
    activityCompetencies,
    userRecords,
    userRole,
  } = input;

  // 1. Filter activity-competencies to those relevant to user's role
  const relevantMappings = userRole
    ? activityCompetencies.filter((ac) => {
        const activity = activities.get(ac.activity_id);
        return activity?.role_id === userRole.id;
      })
    : activityCompetencies;

  // 2. Build gaps for each required competency
  const gaps: CompetencyGap[] = relevantMappings
    .map((ac) => {
      const competency = competencies.get(ac.competency_id);
      const activity = activities.get(ac.activity_id);

      if (!competency || !activity) return null;

      const userRecord = userRecords.get(ac.competency_id);
      const currentLevel = userRecord?.current_level ?? 1;
      const evidenceType = userRecord?.evidence ? 'assessment-verified' : 'self-assessed';

      return buildCompetencyGap(
        competency,
        activity,
        currentLevel,
        ac.target_level,
        ac.priority,
        evidenceType as any
      );
    })
    .filter((g): g is CompetencyGap => g !== null);

  // 3. Sort by severity (descending)
  gaps.sort((a, b) => {
    const scoreA = computeGapSeverity(a.currentLevel, a.targetLevel, a.priority);
    const scoreB = computeGapSeverity(b.currentLevel, b.targetLevel, b.priority);
    return scoreB - scoreA;
  });

  // 4. Compute readiness index
  const requiredCompetencies = relevantMappings.map((ac) => ({
    competencyId: ac.competency_id,
    targetLevel: ac.target_level,
  }));

  const readinessIndex = computeReadinessIndex(requiredCompetencies, userRecords);

  // 5. Top 3 gaps
  const topGaps = gaps.slice(0, 3);

  return {
    gaps,
    readinessIndex,
    topGaps,
  };
}

// ============================================================================
// HELPER: Gap-Aware Explanations
// ============================================================================

/**
 * Generate a human-readable explanation for a gap
 * Example: "Competency 'CAPI Tablet Operation' (Activity: 'Household Enumeration') is at Level 2,
 *          but your Field Investigator role requires Level 4. Critical gap."
 */
export function explainGap(gap: CompetencyGap): string {
  const { competency, activity, currentLevel, targetLevel, severity, priority } = gap;

  return (
    `${competency.name} (Activity: "${activity.name}") is at Level ${currentLevel}, ` +
    `but your role requires Level ${targetLevel}. ${severity} gap (${priority} priority).`
  );
}

/**
 * Bilingual gap explanation (English + Hindi)
 */
export function explainGapBilingual(gap: CompetencyGap): { en: string; hi: string } {
  const { competency, activity, currentLevel, targetLevel, severity, priority } = gap;

  const en = explainGap(gap);
  const hi =
    `${competency.name_hi || competency.name} (क्रियाकलाप: "${activity.name_hi || activity.name}") स्तर ${currentLevel} पर है, ` +
    `लेकिन आपकी भूमिका के लिए स्तर ${targetLevel} की आवश्यकता है। ${severity} अंतराल (${priority} प्राथमिकता)।`;

  return { en, hi };
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Promote competency level based on assessment performance
 * Rules (configurable per org):
 *   - Score 0-40%: No promotion
 *   - Score 40-70%: If current_level < 3, promote to current+1
 *   - Score 70%+: If current_level < 5, promote to current+1 or current+2
 */
export function promoteCompetencyLevel(
  currentLevel: number,
  assessmentScore: number,
  options: { strictMode?: boolean } = {}
): number {
  const { strictMode = false } = options;

  if (currentLevel >= 5) return 5; // Max level

  if (assessmentScore >= 70) {
    // High performance: promote up to 2 levels
    return strictMode ? Math.min(currentLevel + 1, 5) : Math.min(currentLevel + 2, 5);
  } else if (assessmentScore >= 40 && currentLevel < 3) {
    // Medium performance: promote 1 level only if < L3
    return currentLevel + 1;
  }

  return currentLevel; // No promotion
}

// ============================================================================
// EXPORTS
// ============================================================================

export const CompetencyService = {
  computeGapSeverity,
  classifySeverity,
  buildCompetencyGap,
  computeReadinessIndex,
  analyzeCompetencyGaps,
  explainGap,
  explainGapBilingual,
  promoteCompetencyLevel,
};

export default CompetencyService;
