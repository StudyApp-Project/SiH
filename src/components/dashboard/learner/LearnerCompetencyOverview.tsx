'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, CheckCircle2, Target, AlertTriangle, Info } from 'lucide-react';
import type { LayeredCompetencyProgress } from '@/services/learnerProgressService';

interface LearnerCompetencyOverviewProps {
  competencies: LayeredCompetencyProgress[];
  isHindi?: boolean;
}

export function LearnerCompetencyOverview({
  competencies,
  isHindi = false,
}: LearnerCompetencyOverviewProps) {
  const t = useTranslations('learnerHome.competencies');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!competencies || competencies.length === 0) {
    return null;
  }

  // Display top 4-5 competencies
  const displayItems = competencies.slice(0, 5);

  const getStatusBadge = (status: 'ahead' | 'on-track' | 'behind') => {
    switch (status) {
      case 'ahead':
        return {
          icon: CheckCircle2,
          text: t('ahead'),
          className: 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30',
        };
      case 'on-track':
        return {
          icon: Target,
          text: t('onTrack'),
          className: 'bg-amber-500/15 text-amber-900 border-amber-500/30',
        };
      case 'behind':
      default:
        return {
          icon: AlertTriangle,
          text: t('needsAttention'),
          className: 'bg-rose-500/15 text-rose-800 border-rose-500/30',
        };
    }
  };

  return (
    <div
      data-testid="learner-competencies"
      className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 sm:p-7 shadow-xs"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#BF9B7A]/20">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5B3E]">
            {t('subtitle')}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#2d1f17] mt-0.5">
            {t('title')}
          </h2>
        </div>

        {/* Link to dedicated page */}
        <Link
          href="/skill-gap"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#555934] hover:text-[#434728] transition-colors self-start sm:self-auto"
        >
          <span>{t('viewAll')}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Competency list with layered progress bars */}
      <div className="mt-5 space-y-5">
        {displayItems.map((comp) => {
          const name = isHindi && comp.name_hi ? comp.name_hi : comp.name;
          const statusMeta = getStatusBadge(comp.status);
          const StatusIcon = statusMeta.icon;
          const isHovered = hoveredId === comp.id;

          const deltaText =
            comp.deltaPercent > 0
              ? `+${comp.deltaPercent}% ahead`
              : comp.deltaPercent < 0
              ? `${Math.abs(comp.deltaPercent)}% behind`
              : 'On schedule';

          return (
            <div
              key={comp.id}
              className="group relative rounded-2xl p-3 -mx-2 transition-colors hover:bg-[#FAF6F0]/60 focus-within:bg-[#FAF6F0]/60"
              onMouseEnter={() => setHoveredId(comp.id)}
              onMouseLeave={() => setHoveredId(null)}
              tabIndex={0}
              role="group"
              aria-label={`${name}: ${comp.actualPercent}% actual vs ${comp.expectedPercent}% expected. Status: ${statusMeta.text}`}
            >
              {/* Top row: Name, Level, Status pill */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#2d1f17] truncate">
                      {name}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#FAF6F0] border border-[#BF9B7A]/30 text-[#705849] shrink-0">
                      L{comp.currentLevel} → L{comp.targetLevel}
                    </span>
                  </div>
                </div>

                {/* Status pill & Actual % */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-bold text-[#2d1f17]">
                    {comp.actualPercent}%
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border ${statusMeta.className}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    <span>{statusMeta.text}</span>
                  </span>
                </div>
              </div>

              {/* Layered Progress Bar */}
              <div
                className="relative h-3.5 w-full rounded-full bg-[#FAF6F0] border border-[#BF9B7A]/30 overflow-visible p-0.5"
                role="progressbar"
                aria-valuenow={comp.actualPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {/* Actual progress: filled bar (primary) */}
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    comp.status === 'ahead'
                      ? 'bg-emerald-600'
                      : comp.status === 'behind'
                      ? 'bg-rose-500'
                      : 'bg-[#555934]'
                  }`}
                  style={{ width: `${Math.max(4, Math.min(100, comp.actualPercent))}%` }}
                />

                {/* Expected progress: thin vertical reference marker */}
                <div
                  className="absolute top-0 bottom-0 z-10 flex flex-col items-center pointer-events-none"
                  style={{ left: `${Math.min(98, Math.max(2, comp.expectedPercent))}%` }}
                >
                  <div className="w-1 h-full bg-[#2d1f17] rounded-full shadow-xs -translate-x-1/2" />
                </div>
              </div>

              {/* Interactive Tooltip / Hover detail */}
              <div
                className={`mt-1.5 flex items-center justify-between text-[11px] transition-opacity duration-150 ${
                  isHovered ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Info className="h-3 w-3 text-[#8C5B3E]" />
                  <span>
                    {t('actual')}: <strong>{comp.actualPercent}%</strong> • {t('expected')}: <strong>{comp.expectedPercent}%</strong>
                  </span>
                </div>
                <span className="font-mono text-[#8C5B3E] font-semibold text-[11px]">
                  {deltaText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
