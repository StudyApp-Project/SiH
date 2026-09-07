/**
 * learnerProgressService.ts — Core Data & Computation Engine for Learner Experience
 *
 * Implements:
 * 1. Course Timeline & Expected Progress calculation (elapsed / total duration)
 * 2. Schedule status comparison (ahead / on-track / behind)
 * 3. Layered Competency Progress (actual % vs expected % marker)
 * 4. 2-3 Personalized Recommendation Cards (ranked by gap severity and learning state)
 * 5. Recent Meaningful Activities (compact 3-4 items)
 * 6. Lightweight Progress Trend data
 */

import type { PersonaFRACProfile, FRACCompetencyDef } from '@/data/fracCadres';

export type ScheduleStatus = 'ahead' | 'on-track' | 'behind';

export interface LearnerCourseTimeline {
  courseId: string;
  courseTitle: string;
  courseTitle_hi: string;
  totalWeeks: number;
  currentWeek: number;
  expectedProgress: number; // percentage (0-100)
  actualProgress: number;   // percentage (0-100)
  status: ScheduleStatus;
  statusLabel: string;
  statusLabel_hi: string;
  deltaPercent: number;     // actual - expected
}

export interface LayeredCompetencyProgress {
  id: string;
  name: string;
  name_hi: string;
  currentLevel: number;
  targetLevel: number;
  actualPercent: number;   // percentage (0-100)
  expectedPercent: number; // percentage (0-100)
  status: ScheduleStatus;
  statusLabel: string;
  statusLabel_hi: string;
  deltaPercent: number;    // actual - expected
  priority: 'critical' | 'important' | 'desirable';
}

export type RecommendationType = 'ASSESS' | 'CONTINUE' | 'PRACTICE' | 'REASSESS';

export interface LearnerActionCard {
  id: string;
  type: RecommendationType;
  badge: string;
  badge_hi: string;
  title: string;
  title_hi: string;
  explanation: string;
  explanation_hi: string;
  ctaText: string;
  ctaText_hi: string;
  href: string;
  priorityScore: number;
  actionId?: string;
}

export interface LearnerActivityItem {
  id: string;
  title: string;
  title_hi: string;
  type: 'assessment' | 'module' | 'competency' | 'milestone';
  detail?: string;
  detail_hi?: string;
  date: string;
  date_hi: string;
}

export interface ProgressTrendPoint {
  month: string;
  month_hi: string;
  score: number;
}

export interface LearnerProgressTrend {
  points: ProgressTrendPoint[];
  summaryGain: string;
  summaryGain_hi: string;
}

/**
 * Calculate course timeline and expected progress
 * Expected progress = elapsed course duration / total course duration
 */
export function calculateCourseTimeline(
  profile: PersonaFRACProfile,
  overrides?: Partial<LearnerCourseTimeline>
): LearnerCourseTimeline {
  // Determine course by cadre/persona
  const isSunita = profile.personaId.includes('sunita');
  const totalWeeks = overrides?.totalWeeks ?? (isSunita ? 8 : 12);
  const currentWeek = overrides?.currentWeek ?? (isSunita ? 6 : 7);

  // Expected progress calculation: elapsed / total duration
  const expectedProgress = Math.min(100, Math.max(0, Math.round((currentWeek / totalWeeks) * 100)));

  // Actual progress derived from competencies met or direct override
  let actualProgress = overrides?.actualProgress;
  if (actualProgress === undefined) {
    if (profile.competencies.length === 0) {
      actualProgress = 0;
    } else {
      const totalCompetencyPercent = profile.competencies.reduce((acc, comp) => {
        return acc + Math.min(100, Math.round((comp.currentLevel / Math.max(1, comp.targetLevel)) * 100));
      }, 0);
      actualProgress = Math.round(totalCompetencyPercent / profile.competencies.length);
    }
  }

  const delta = actualProgress - expectedProgress;
  let status: ScheduleStatus = 'on-track';
  if (delta >= 3) {
    status = 'ahead';
  } else if (delta <= -3) {
    status = 'behind';
  }

  const statusLabel =
    status === 'ahead'
      ? "You're ahead of schedule"
      : status === 'behind'
      ? 'Behind schedule — Needs attention'
      : "You're on track";

  const statusLabel_hi =
    status === 'ahead'
      ? 'आप समय से आगे चल रहे हैं'
      : status === 'behind'
      ? 'समय से पीछे — ध्यान देने की आवश्यकता'
      : 'आप सही गति पर हैं';

  return {
    courseId: isSunita ? 'course-capi-field' : 'course-jso-scrutiny',
    courseTitle: isSunita
      ? 'CAPI Field Operations & Rural Survey Methodology'
      : 'Statistical Data Scrutiny & Survey Sampling Variance',
    courseTitle_hi: isSunita
      ? 'कैपी फील्ड संचालन और ग्रामीण सर्वेक्षण पद्धति'
      : 'सांख्यिकीय डेटा संवीक्षा और सर्वेक्षण नमूनाकरण प्रसरण',
    totalWeeks,
    currentWeek,
    expectedProgress,
    actualProgress,
    status,
    statusLabel,
    statusLabel_hi,
    deltaPercent: delta,
    ...overrides,
  };
}

/**
 * Calculate layered actual and expected progress for competencies
 */
export function getLayeredCompetencies(
  competencies: FRACCompetencyDef[],
  expectedCourseProgress = 58
): LayeredCompetencyProgress[] {
  if (!competencies || competencies.length === 0) {
    return [];
  }

  return competencies.map((comp, idx) => {
    const actualPercent = Math.min(
      100,
      Math.max(0, Math.round((comp.currentLevel / Math.max(1, comp.targetLevel)) * 100))
    );

    // Provide tailored expected progress for each competency based on course milestone
    // Higher priority competencies have a slightly higher expected pace
    let expectedPercent = expectedCourseProgress;
    if (comp.priority === 'critical') {
      expectedPercent = Math.min(100, expectedCourseProgress + 5);
    } else if (comp.priority === 'desirable') {
      expectedPercent = Math.max(20, expectedCourseProgress - 8);
    }

    const delta = actualPercent - expectedPercent;
    let status: ScheduleStatus = 'on-track';
    if (delta >= 4) {
      status = 'ahead';
    } else if (delta <= -4) {
      status = 'behind';
    }

    const statusLabel =
      status === 'ahead'
        ? 'Ahead of schedule'
        : status === 'behind'
        ? 'Needs attention'
        : 'On schedule';

    const statusLabel_hi =
      status === 'ahead'
        ? 'समय से आगे'
        : status === 'behind'
        ? 'ध्यान देने की जरूरत'
        : 'समय पर';

    return {
      id: comp.id,
      name: comp.name,
      name_hi: comp.name_hi,
      currentLevel: comp.currentLevel,
      targetLevel: comp.targetLevel,
      actualPercent,
      expectedPercent,
      status,
      statusLabel,
      statusLabel_hi,
      deltaPercent: delta,
      priority: comp.priority,
    };
  });
}

/**
 * Generate 2-3 personalized action cards ranked by relevance
 */
export function getPersonalizedRecommendations(
  profile: PersonaFRACProfile,
  timeline: LearnerCourseTimeline
): LearnerActionCard[] {
  const recommendations: LearnerActionCard[] = [];

  // 1. Identify critical competency gaps
  const criticalGaps = profile.competencies
    .filter((c) => c.currentLevel < c.targetLevel)
    .sort((a, b) => {
      const priorityOrder = { critical: 3, important: 2, desirable: 1 };
      const pDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      if (pDiff !== 0) return pDiff;
      return (b.targetLevel - b.currentLevel) - (a.targetLevel - a.currentLevel);
    });

  if (criticalGaps.length > 0) {
    const topGap = criticalGaps[0];
    const gapLevel = topGap.targetLevel - topGap.currentLevel;

    recommendations.push({
      id: `rec-gap-${topGap.id}`,
      type: 'ASSESS',
      badge: 'Assess',
      badge_hi: 'मूल्यांकन',
      title: `${topGap.name} Assessment`,
      title_hi: `${topGap.name_hi} मूल्यांकन`,
      explanation: `Check your understanding to bridge ${gapLevel}-level gap (L${topGap.currentLevel} → L${topGap.targetLevel}).`,
      explanation_hi: `L${topGap.currentLevel} से L${topGap.targetLevel} के अंतर को पूरा करने के लिए अपनी समझ की जांच करें।`,
      ctaText: 'Start →',
      ctaText_hi: 'आरंभ करें →',
      href: '/assignments',
      priorityScore: 100,
    });
  }

  // 2. Active learning module to continue
  if (timeline.actualProgress < 100) {
    const isSunita = profile.personaId.includes('sunita');
    recommendations.push({
      id: 'rec-continue-learning',
      type: 'CONTINUE',
      badge: 'Continue Learning',
      badge_hi: 'अध्ययन जारी रखें',
      title: isSunita
        ? 'CAPI Offline Listing & Form Logic'
        : 'Statistical Data Scrutiny Basics',
      title_hi: isSunita
        ? 'कैपी ऑफलाइन सूचीकरण और प्रपत्र तर्क'
        : 'सांख्यिकीय डेटा संवीक्षा मूल बातें',
      explanation: isSunita
        ? 'Continue from Module 3: GPS Geofencing Validation.'
        : 'Continue from Chapter 4: Outlier Detection Rules.',
      explanation_hi: isSunita
        ? 'मॉड्यूल 3 से आगे बढ़ें: जीपीएस जियोफेंसिंग सत्यापन।'
        : 'अध्याय 4 से आगे बढ़ें: आउटलायर पहचान नियम।',
      ctaText: 'Continue →',
      ctaText_hi: 'जारी रखें →',
      href: '/pathways',
      priorityScore: 85,
    });
  }

  // 3. Practice Drill or Reassessment
  if (criticalGaps.length > 1) {
    const secondGap = criticalGaps[1];
    recommendations.push({
      id: `rec-practice-${secondGap.id}`,
      type: 'PRACTICE',
      badge: 'Practice',
      badge_hi: 'अभ्यास',
      title: `${secondGap.name} Practice`,
      title_hi: `${secondGap.name_hi} अभ्यास`,
      explanation: `Strengthen your competency with an interactive scenario drill.`,
      explanation_hi: `संवादात्मक अभ्यास के साथ अपनी क्षमता को सुदृढ़ करें।`,
      ctaText: 'Practice →',
      ctaText_hi: 'अभ्यास करें →',
      href: '/assignments',
      priorityScore: 70,
    });
  } else {
    // If only 1 gap or none, add skill milestone/reinforcement
    recommendations.push({
      id: 'rec-practice-general',
      type: 'PRACTICE',
      badge: 'Practice',
      badge_hi: 'अभ्यास',
      title: 'Field Verification Scenarios',
      title_hi: 'फील्ड सत्यापन परिदृश्य',
      explanation: 'Test yourself against real-world MoSPI audit case studies.',
      explanation_hi: 'वास्तविक सर्वेक्षण केस अध्ययनों के साथ अपना परीक्षण करें।',
      ctaText: 'Practice →',
      ctaText_hi: 'अभ्यास करें →',
      href: '/assignments',
      priorityScore: 65,
    });
  }

  // Cap at 3 recommendations
  return recommendations.slice(0, 3);
}

/**
 * Return 3-4 most recent meaningful activities
 */
export function getRecentActivities(isHindi = false): LearnerActivityItem[] {
  return [
    {
      id: 'act-1',
      title: 'PLFS 5-Digit NIC/NCO Coding Challenge',
      title_hi: 'पीएलएफएस 5-अंकीय एनआईसी/एनसीओ कोडिंग चुनौती',
      type: 'assessment',
      detail: 'Score: 8/10 • Passed',
      detail_hi: 'अंक: 8/10 • उत्तीर्ण',
      date: 'Yesterday',
      date_hi: 'कल',
    },
    {
      id: 'act-2',
      title: 'CAPI Offline Listing & Form Logic',
      title_hi: 'कैपी ऑफलाइन सूचीकरण और प्रपत्र तर्क',
      type: 'module',
      detail: 'Completed Chapter 3',
      detail_hi: 'अध्याय 3 पूर्ण',
      date: '2 days ago',
      date_hi: '2 दिन पहले',
    },
    {
      id: 'act-3',
      title: 'Census Boundary Demarcation',
      title_hi: 'जनगणना सीमा निर्धारण',
      type: 'competency',
      detail: 'Level upgraded to L3 (+12%)',
      detail_hi: 'स्तर L3 में अपग्रेड (+12%)',
      date: '4 days ago',
      date_hi: '4 दिन पहले',
    },
    {
      id: 'act-4',
      title: 'Statistical Scrutiny Milestone',
      title_hi: 'सांख्यिकी संवीक्षा मील का पत्थर',
      type: 'milestone',
      detail: 'First-time validation badge earned',
      detail_hi: 'प्रथम-बार सत्यापन बैज प्राप्त',
      date: '1 week ago',
      date_hi: '1 सप्ताह पहले',
    },
  ];
}

/**
 * Lightweight progress trend data over the last 4 months
 */
export function getProgressTrend(): LearnerProgressTrend {
  return {
    points: [
      { month: 'Jun', month_hi: 'जून', score: 44 },
      { month: 'Jul', month_hi: 'जुलाई', score: 52 },
      { month: 'Aug', month_hi: 'अगस्त', score: 58 },
      { month: 'Sep', month_hi: 'सितंबर', score: 68 },
    ],
    summaryGain: '+16% over the last 90 days',
    summaryGain_hi: 'पिछले 90 दिनों में +16% की वृद्धि',
  };
}
