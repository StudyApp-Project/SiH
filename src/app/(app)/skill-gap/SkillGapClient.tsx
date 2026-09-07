'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { RadarDataPoint } from '@/components/RadarChart';

const RadarChart = dynamic(
  () => import('@/components/RadarChart').then((mod) => mod.RadarChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-64 items-center justify-center">
        <div className="h-48 w-48 rounded-full bg-muted/40 animate-pulse" />
      </div>
    ),
  }
);
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { CompetencyService } from '@/services/competencyService';
import { getPersonaFRAC } from '@/data/fracCadres';
import type { CompetencyGap } from '@/lib/types';
import type { AppUser } from '@/lib/auth';
import { useSafeLocale } from '@/lib/useSafeLocale';

interface GapCardProps {
  gap: CompetencyGap;
  isHindi?: boolean;
}

function GapCard({ gap, isHindi }: GapCardProps) {
  const severityPillColors = {
    HIGH: 'text-[#8C5B3E] bg-[#8C5B3E]/12',
    MODERATE: 'text-chart-5 bg-[#BF9B7A]/20',
    PROFICIENT: 'text-[#555934] bg-[#555934]/12',
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card transition-all hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[#2d1f17]">
              {gap.competency.name}
            </h3>
            <ProvenanceBadge provenance={gap.competency.provenance} showLabel={false} size="sm" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {isHindi ? 'गतिविधि:' : 'Activity:'} {gap.activity.name}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${severityPillColors[gap.severity]}`}>
            {gap.severity === 'HIGH' && (isHindi ? '🔴 उच्च गंभीरता' : '🔴 Critical')}
            {gap.severity === 'MODERATE' && (isHindi ? '🟡 मध्यम' : '🟡 Moderate')}
            {gap.severity === 'PROFICIENT' && (isHindi ? '🟢 प्रवीण' : '🟢 Proficient')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm bg-[#F2E6D8]/30 p-4 rounded-xl">
        <div>
          <p className="text-xs text-muted-foreground uppercase mb-1">{isHindi ? 'वर्तमान' : 'Current'}</p>
          <p className="font-bold text-[#2d1f17]">L{gap.currentLevel}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase mb-1">{isHindi ? 'लक्षित' : 'Target'}</p>
          <p className="font-bold text-[#2d1f17]">L{gap.targetLevel}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase mb-1">{isHindi ? 'प्राथमिकता' : 'Priority'}</p>
          <p className="font-semibold text-[#2d1f17] capitalize">
            {gap.priority.charAt(0).toUpperCase() + gap.priority.slice(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase mb-1">{isHindi ? 'अंतर गंभीरता' : 'Gap Severity'}</p>
          <p className="font-mono font-bold text-[#2d1f17]">
            {CompetencyService.computeGapSeverity(gap.currentLevel, gap.targetLevel, gap.priority)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-[#2d1f17]">{isHindi ? 'यह क्यों महत्वपूर्ण है' : 'Why This Matters'}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {gap.evidenceType === 'assessment-verified'
            ? isHindi
              ? `आपके ${gap.activity.name} प्रदर्शन मूल्यांकन ने स्तर ${gap.currentLevel} दर्शाया, जबकि प्रभावी निष्पादन हेतु स्तर ${gap.targetLevel} आवश्यक है।`
              : `Your ${gap.activity.name} performance assessment showed ${gap.currentLevel}, requiring Level ${gap.targetLevel} for optimal ${gap.activity.name} effectiveness.`
            : isHindi
              ? `स्व-मूल्यांकन के आधार पर, स्तर ${gap.targetLevel} की आवश्यकताओं को पूरा करने के लिए ${gap.competency.name} विकसित करना आवश्यक है।`
              : `Based on self-assessment, you need to develop ${gap.competency.name} to meet ${gap.activity.name} requirements at Level ${gap.targetLevel}.`
          }
        </p>
        <div className="flex items-center justify-between mt-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2.5 py-1 rounded-full bg-[#F2E6D8] text-[#2d1f17]">
              {isHindi ? 'श्रेणी:' : 'Category:'} {gap.competency.category}
            </span>
            {gap.evidenceType === 'assessment-verified' ? (
              <span className="px-2.5 py-1 rounded-full bg-[#555934]/12 text-[#555934] font-medium">
                {isHindi ? 'सत्यापित' : 'Verified'}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-[#BF9B7A]/20 text-chart-5 font-medium">
                {isHindi ? 'स्व-मूल्यांकित' : 'Self-Assessed'}
              </span>
            )}
          </div>
          <Link
            href={`/assessment/${gap.competencyId}`}
            prefetch={true}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs text-white bg-[#555934] hover:bg-primary-dark font-semibold rounded-xl transition-all shadow-2xs active:scale-[0.98]"
          >
            <PlayCircle className="h-3.5 w-3.5" />
            {isHindi ? 'मूल्यांकन प्रारंभ करें' : 'Take Assessment'}
          </Link>
        </div>
      </div>
    </div>
  );
}

function buildPersonaGapsAndRadar(user?: AppUser | null, isHindiLang?: boolean): { gaps: CompetencyGap[]; radarData: RadarDataPoint[] } {
  const profile = getPersonaFRAC(user);
  const isHindi = isHindiLang ?? (user?.user_metadata?.preferred_language === 'hi' || profile.preferredLanguage === 'hi');

  const gaps: CompetencyGap[] = profile.competencies.map((comp) => {
    const gap = Math.max(0, comp.targetLevel - comp.currentLevel);
    const severityScore = CompetencyService.computeGapSeverity(comp.currentLevel, comp.targetLevel, comp.priority);
    const severity = CompetencyService.classifySeverity(severityScore);

    return {
      competencyId: comp.id,
      competency: {
        id: comp.id,
        name: isHindi ? comp.name_hi : comp.name,
        name_hi: comp.name_hi,
        category: comp.category,
        description: isHindi ? comp.description_hi : comp.description,
        description_hi: comp.description_hi,
        levels: comp.levels,
        provenance: comp.provenance,
        created_at: new Date().toISOString(),
      },
      activity: {
        id: `act-${comp.id}`,
        name: isHindi ? comp.activityName_hi : comp.activityName,
        name_hi: comp.activityName_hi,
        description: comp.description,
        role_id: profile.personaId,
        provenance: comp.provenance,
        created_at: new Date().toISOString(),
      },
      currentLevel: comp.currentLevel,
      targetLevel: comp.targetLevel,
      gap,
      priority: comp.priority,
      severity,
      evidenceType: comp.evidenceType,
    };
  });

  const sortedGaps = gaps.sort((a, b) => {
    const order = { HIGH: 0, MODERATE: 1, PROFICIENT: 2 };
    return order[a.severity] - order[b.severity];
  });

  const radar: RadarDataPoint[] = profile.competencies.map((c) => ({
    label: (isHindi ? c.name_hi : c.name).split(' ').slice(0, 2).join(' '),
    current: c.currentLevel,
    target: c.targetLevel,
  }));

  return { gaps: sortedGaps, radarData: radar };
}

export default function SkillGapClient({ user }: { user?: AppUser | null }) {
  const t = useTranslations();
  const locale = useSafeLocale(user?.user_metadata?.preferred_language || 'en');
  const isHindi = locale === 'hi';
  const { gaps, radarData } = useMemo(() => buildPersonaGapsAndRadar(user, isHindi), [user, isHindi]);
  const [filter, setFilter] = useState<'all' | 'HIGH' | 'MODERATE' | 'PROFICIENT'>('all');

  const severityCounts = useMemo(() => ({
    HIGH: gaps.filter((g) => g.severity === 'HIGH').length,
    MODERATE: gaps.filter((g) => g.severity === 'MODERATE').length,
    PROFICIENT: gaps.filter((g) => g.severity === 'PROFICIENT').length,
  }), [gaps]);

  const filteredGaps = useMemo(() => {
    return filter === 'all' ? gaps : gaps.filter((gap) => gap.severity === filter);
  }, [gaps, filter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#2d1f17]">
          {t('skillGap.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('skillGap.subtitle')}
        </p>
      </div>

      {/* Radar Chart */}
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <h2 className="text-lg font-semibold text-[#2d1f17] mb-6">
          {isHindi ? 'दक्षता रडार — वर्तमान बनाम अपेक्षित स्तर' : 'Competency Radar — Current vs Required Levels'}
        </h2>
        <div className="flex justify-center">
          <RadarChart data={radarData} size={450} showLegend />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            {isHindi ? 'गंभीरता अनुसार फ़िल्टर करें:' : 'Filter by severity:'}
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-[#555934] text-white shadow-2xs'
                : 'bg-[#F2E6D8]/50 text-[#2d1f17] hover:bg-[#F2E6D8]'
            }`}
          >
            {isHindi ? 'सभी' : 'All'} ({gaps.length})
          </button>
          <button
            onClick={() => setFilter('HIGH')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'HIGH'
                ? 'bg-[#8C5B3E] text-white shadow-2xs'
                : 'bg-[#8C5B3E]/10 text-[#8C5B3E] hover:bg-[#8C5B3E]/20'
            }`}
          >
            {isHindi ? '🔴 उच्च गंभीरता' : '🔴 High'} ({severityCounts.HIGH})
          </button>
          <button
            onClick={() => setFilter('MODERATE')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'MODERATE'
                ? 'bg-[#BF9B7A] text-[#2d1f17] shadow-2xs font-semibold'
                : 'bg-[#BF9B7A]/15 text-chart-5 hover:bg-[#BF9B7A]/25'
            }`}
          >
            {isHindi ? '🟡 मध्यम' : '🟡 Moderate'} ({severityCounts.MODERATE})
          </button>
          <button
            onClick={() => setFilter('PROFICIENT')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'PROFICIENT'
                ? 'bg-[#555934] text-white shadow-2xs'
                : 'bg-[#555934]/10 text-[#555934] hover:bg-[#555934]/20'
            }`}
          >
            {isHindi ? '🟢 प्रवीण' : '🟢 Proficient'} ({severityCounts.PROFICIENT})
          </button>
        </div>
      </div>

      {/* Gap Cards */}
      <div className="space-y-4">
        {filteredGaps.map((gap) => (
          <GapCard key={gap.competencyId} gap={gap} isHindi={isHindi} />
        ))}
      </div>

      {/* Empty State */}
      {filteredGaps.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-white shadow-card">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-medium text-[#2d1f17] mb-2">
            {isHindi ? 'इस श्रेणी में कोई कमी नहीं है' : 'No gaps in this category'}
          </h3>
          <p className="text-muted-foreground">
            {isHindi
              ? 'इस फ़िल्टर के लिए सभी दक्षताएं लक्षित स्तर पर या उससे अधिक हैं।'
              : 'All competencies are at or above target level for this filter.'}
          </p>
        </div>
      )}
    </div>
  );
}
