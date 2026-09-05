'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { RadarChart, type RadarDataPoint } from '@/components/RadarChart';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { CompetencyService } from '@/services/competencyService';
import type { CompetencyGap } from '@/lib/types';

interface GapCardProps {
  gap: CompetencyGap;
}

function GapCard({ gap }: GapCardProps) {
  const t = useTranslations();

  const severityColors = {
    HIGH: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800',
    MODERATE: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
    PROFICIENT: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800',
  };

  return (
    <div className="rounded-lg border p-5 transition-all hover:shadow-md ${severityColors[gap.severity]}">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-zinc-100">
              {gap.competency.name}
            </h3>
            <ProvenanceBadge provenance={gap.competency.provenance} showLabel={false} size="sm" />
          </div>
          <p className="text-sm text-slate-600 dark:text-zinc-400 mb-2">
            Activity: {gap.activity.name}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-white/50">
            {gap.severity === 'HIGH' && '🔴 Critical'}
            {gap.severity === 'MODERATE' && '🟡 Moderate'}
            {gap.severity === 'PROFICIENT' && '🟢 Proficient'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
        <div>
          <p className="text-xs text-slate-500 dark:text-zinc-500 uppercase mb-1">Current</p>
          <p className="font-bold text-slate-900 dark:text-zinc-100">L{gap.currentLevel}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-zinc-500 uppercase mb-1">Target</p>
          <p className="font-bold text-slate-900 dark:text-zinc-100">L{gap.targetLevel}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-zinc-500 uppercase mb-1">Priority</p>
          <p className="font-semibold text-slate-900 dark:text-zinc-100 capitalize">
            {gap.priority.charAt(0).toUpperCase() + gap.priority.slice(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-zinc-500 uppercase mb-1">Gap Severity</p>
          <p className="font-mono font-bold text-slate-900 dark:text-zinc-100">
            {CompetencyService.computeGapSeverity(gap.currentLevel, gap.targetLevel, gap.priority)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-700 dark:text-zinc-300">Why This Matters</h4>
        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
          {gap.evidenceType === 'assessment-verified'
            ? `Your ${gap.activity.name} performance assessment showed ${gap.currentLevel}, requiring Level ${gap.targetLevel} for optimal ${gap.activity.name} effectiveness.`
            : `Based on self-assessment, you need to develop ${gap.competency.name} to meet ${gap.activity.name} requirements at Level ${gap.targetLevel}."
          }
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 mt-2">
          <span className="px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800">
            Category: {gap.competency.category}
          </span>
          {gap.evidenceType === 'assessment-verified' ? (
            <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              Verified Assessment
            </span>
          ) : (
            <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
              Self-Assessed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SkillGapClient() {
  const t = useTranslations();
  const [gaps, setGaps] = useState<CompetencyGap[]>([]);
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [filter, setFilter] = useState<'all' | 'HIGH' | 'MODERATE' | 'PROFICIENT'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo data that matches the FRAC domain model and CompetencyService logic
    const demoGaps: CompetencyGap[] = [
      {
        competencyId: 'comp-capi',
        competency: {
          id: 'comp-capi',
          name: 'CAPI Tablet Operation',
          name_hi: 'कैपी टैबलेट संचालन',
          category: 'Domain',
          levels: 'L1-L5',
          provenance: 'PROPOSED_FRAMEWORK',
        },
        activity: {
          id: 'act-fh',
          name: 'Household Listing & Census Enumeration',
          name_hi: 'परिवार सूचीकरण & जनगणना गणना',
          role_id: 'role-field-investigator',
        },
        currentLevel: 2,
        targetLevel: 4,
        gap: 2,
        priority: 'critical',
        severity: 'HIGH',
        evidenceType: 'assessment-verified',
      },
      {
        competencyId: 'comp-survey',
        competency: {
          id: 'comp-survey',
          name: 'Survey Sampling & Design',
          name_hi: 'सर्वेक्षण नमूनाकरण & डिजाइन',
          category: 'Functional',
          levels: 'L1-L5',
          provenance: 'PROPOSED_FRAMEWORK',
        },
        activity: {
          id: 'act-fh',
          name: 'Household Listing & Census Enumeration',
          name_hi: 'परिवार सूचीकरण & जनगणना गणना',
          role_id: 'role-field-investigator',
        },
        currentLevel: 1,
        targetLevel: 3,
        gap: 2,
        priority: 'important',
        severity: 'HIGH',
        evidenceType: 'assessment-verified',
      },
      {
        competencyId: 'comp-data',
        competency: {
          id: 'comp-data',
          name: 'Data Entry & Scrutiny',
          name_hi: 'डेटा प्रविष्टि & छानबीन',
          category: 'Functional',
          levels: 'L1-L5',
          provenance: 'PROPOSED_FRAMEWORK',
        },
        activity: {
          id: 'act-capi',
          name: 'CAPI Data Entry & Field Validation',
          name_hi: 'कैपी डेटा प्रविष्टि & फील्ड सत्यापन',
          role_id: 'role-field-investigator',
        },
        currentLevel: 3,
        targetLevel: 5,
        gap: 2,
        priority: 'important',
        severity: 'MODERATE',
        evidenceType: 'self-assessed',
      },
      {
        competencyId: 'comp-ethics',
        competency: {
          id: 'comp-ethics',
          name: 'Statistical Ethics & Integrity',
          name_hi: 'सांख्यिकीय नैतिकता & अखंडता',
          category: 'Behavioural',
          levels: 'L1-L5',
          provenance: 'PROPOSED_FRAMEWORK',
        },
        activity: {
          id: 'act-capi',
          name: 'CAPI Data Entry & Field Validation',
          name_hi: 'कैपी डेटा प्रविष्टि & फील्ड सत्यापन',
          role_id: 'role-field-investigator',
        },
        currentLevel: 4,
        targetLevel: 2,
        gap: 0,
        priority: 'desirable',
        severity: 'PROFICIENT',
        evidenceType: 'assessment-verified',
      },
      {
        competencyId: 'comp-teamwork',
        competency: {
          id: 'comp-teamwork',
          name: 'Teamwork & Collaboration',
          name_hi: 'टीमवर्क & सहयोग',
          category: 'Behavioural',
          levels: 'L1-L5',
          provenance: 'PROPOSED_FRAMEWORK',
        },
        activity: {
          id: 'act-scrutiny',
          name: 'Schedule Scrutiny & Anomaly Detection',
          name_hi: 'अनुसूची जांच & विसंगति पहचान',
          role_id: 'role-jso',
        },
        currentLevel: 1,
        targetLevel: 4,
        gap: 3,
        priority: 'critical',
        severity: 'HIGH',
        evidenceType: 'self-assessed',
      },
      {
        competencyId: 'comp-estimation',
        competency: {
          id: 'comp-estimation',
          name: 'Statistical Estimation & Analysis',
          name_hi: 'सांख्यिकीय अनुमान & विश्लेषण',
          category: 'Functional',
          levels: 'L1-L5',
          provenance: 'PROPOSED_FRAMEWORK',
        },
        activity: {
          id: 'act-unit',
          name: 'Unit-Level Data Processing',
          name_hi: 'इकाई-स्तर डेटा प्रसंस्करण',
          role_id: 'role-jso',
        },
        currentLevel: 1,
        targetLevel: 4,
        gap: 3,
        priority: 'critical',
        severity: 'HIGH',
        evidenceType: 'self-assessed',
      },
    ];

    // Sort by severity (HIGH -> MODERATE -> PROFICIENT), then by priority, then by gap size
    const sortedGaps = demoGaps.sort((a, b) => {
      const severityOrder = { HIGH: 0, MODERATE: 1, PROFICIENT: 2 };
      const severityA = severityOrder[a.severity];
      const severityB = severityOrder[b.severity];

      if (severityA !== severityB) {
        return severityA - severityB;
      }

      const priorityOrder = { critical: 0, important: 1, desirable: 2 };
      const priorityA = priorityOrder[a.priority];
      const priorityB = priorityOrder[b.priority];

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return b.gap - a.gap;
    });

    setGaps(sortedGaps);

    // Build radar data for the most relevant activities
    const relevantActivities = [...new Set(sortedGaps.map(g => g.activity.name))];
    const radar: RadarDataPoint[] = relevantActivities.map(activity => {
      const gapForActivity = sortedGaps.find(g => g.activity.name === activity);
      return {
        label: activity.split(' ')[0] + ' ' + activity.split(' ')[1],
        current: gapForActivity?.currentLevel || 1,
        target: gapForActivity?.targetLevel || 3,
      };
    });

    setRadarData(radar);
    setLoading(false);
  }, []);

  const filteredGaps = gaps.filter(gap => filter === 'all' || gap.severity === filter);

  const getSeverityCount = (severity: 'HIGH' | 'MODERATE' | 'PROFICIENT') => {
    return gaps.filter(g => g.severity === severity).length;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-100">
          {t('skillGap.title')}
        </h1>
        <p className="text-slate-600 dark:text-zinc-400">
          {t('skillGap.subtitle')}
        </p>
      </div>

      {/* Radar Chart */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-6">
          Competency Radar — Current vs Required Levels
        </h2>
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-3 border-blue-700/30 border-t-blue-700 rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-slate-500 dark:text-zinc-400">Loading radar data...</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <RadarChart data={radarData} size={450} showLegend />
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
            Filter by severity:
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-700 text-white dark:bg-blue-600'
                : 'bg-white dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-600'
            }`}
          >
            All ({gaps.length})
          </button>
          <button
            onClick={() => setFilter('HIGH')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'HIGH'
                ? 'bg-rose-600 text-white'
                : 'bg-white dark:bg-zinc-700 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50'
            }`}
          >
            🔴 High ({getSeverityCount('HIGH')})
          </button>
          <button
            onClick={() => setFilter('MODERATE')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'MODERATE'
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-zinc-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50'
            }`}
          >
            🟡 Moderate ({getSeverityCount('MODERATE')})
          </button>
          <button
            onClick={() => setFilter('PROFICIENT')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'PROFICIENT'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-zinc-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
            }`}
          >
            🟢 Proficient ({getSeverityCount('PROFICIENT')})
          </button>
        </div>
      </div>

      {/* Gap Cards */}
      <div className="space-y-4">
        {filteredGaps.map((gap) => (
          <GapCard key={gap.competencyId} gap={gap} />
        ))}
      </div>

      {/* Empty State */}
      {filteredGaps.length === 0 && (
        <div className="text-center py-12 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-100 mb-2">
            No gaps in this category
          </h3>
          <p className="text-slate-600 dark:text-zinc-400">
            All competencies are at or above target level for this filter.
          </p>
        </div>
      )}
    </div>
  );
}

export default SkillGapClient;
