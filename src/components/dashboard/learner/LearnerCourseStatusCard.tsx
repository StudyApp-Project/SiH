'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Target, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { LearnerCourseTimeline } from '@/services/learnerProgressService';

interface LearnerCourseStatusCardProps {
  timeline: LearnerCourseTimeline;
  isHindi?: boolean;
}

export function LearnerCourseStatusCard({ timeline, isHindi = false }: LearnerCourseStatusCardProps) {
  const t = useTranslations('learnerHome.status');

  const {
    courseTitle,
    courseTitle_hi,
    currentWeek,
    totalWeeks,
    expectedProgress,
    actualProgress,
    status,
    deltaPercent,
  } = timeline;

  const displayTitle = isHindi && courseTitle_hi ? courseTitle_hi : courseTitle;

  // Status badge style mapping
  const statusConfig = {
    ahead: {
      badgeBg: 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30',
      icon: CheckCircle2,
      label: t('ahead'),
      desc: t('aheadDesc', { delta: Math.abs(deltaPercent) }),
      barColor: 'from-[#555934] to-emerald-600',
    },
    'on-track': {
      badgeBg: 'bg-amber-500/15 text-amber-900 border-amber-500/30',
      icon: Target,
      label: t('onTrack'),
      desc: t('onTrackDesc'),
      barColor: 'from-[#555934] to-[#BF9B7A]',
    },
    behind: {
      badgeBg: 'bg-rose-500/15 text-rose-800 border-rose-500/30',
      icon: AlertTriangle,
      label: t('behind'),
      desc: t('behindDesc', { delta: Math.abs(deltaPercent) }),
      barColor: 'from-amber-600 to-rose-600',
    },
  }[status];

  const StatusIcon = statusConfig.icon;

  return (
    <div
      data-testid="learner-course-status"
      className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 sm:p-7 shadow-xs relative overflow-hidden"
    >
      {/* Top Header: Section Title & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#BF9B7A]/20">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5B3E]">
            {t('title')}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#2d1f17] mt-0.5">
            {displayTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('timelineSummary', {
              current: currentWeek,
              total: totalWeeks,
              expected: expectedProgress,
            })}
          </p>
        </div>

        {/* High-Level Status Indicator Pill */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 self-start sm:self-auto ${statusConfig.badgeBg}`}
          role="status"
          aria-label={`Status: ${statusConfig.label}`}
        >
          <StatusIcon className="h-4 w-4 shrink-0" />
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {/* Main Layered Progress Bar Section */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#2d1f17]">
            {t('courseProgress')}
          </span>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-muted-foreground">
              {t('expectedMarker')}: <strong className="text-[#8C5B3E]">{expectedProgress}%</strong>
            </span>
            <span className="text-[#2d1f17]">
              {t('actualMarker')}: <strong className="text-[#555934] text-sm">{actualProgress}%</strong>
            </span>
          </div>
        </div>

        {/* Progress Bar with layered actual and expected indicator */}
        <div
          className="relative h-6 w-full rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/35 overflow-visible p-0.5"
          role="progressbar"
          aria-valuenow={actualProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Course progress: ${actualProgress}% actual vs ${expectedProgress}% expected based on timeline`}
        >
          {/* Filled Actual Progress Bar */}
          <div
            className={`h-full rounded-xl bg-gradient-to-r ${statusConfig.barColor} transition-all duration-500 shadow-2xs`}
            style={{ width: `${Math.max(3, Math.min(100, actualProgress))}%` }}
          />

          {/* Expected Progress Vertical Marker */}
          <div
            className="absolute top-0 bottom-0 z-10 flex flex-col items-center pointer-events-none"
            style={{ left: `${Math.min(98, Math.max(2, expectedProgress))}%` }}
            title={`Expected benchmark: ${expectedProgress}%`}
          >
            {/* Thin vertical line across the bar */}
            <div className="w-0.5 h-full bg-[#2d1f17] shadow-sm" />
            {/* Indicator label tooltip pin below */}
            <div className="absolute top-7 bg-[#2d1f17] text-[#FAF6F0] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap -translate-x-1/2">
              ▲ {t('expectedMarker')} {expectedProgress}%
            </div>
          </div>
        </div>

        {/* Contextual explanatory description */}
        <div className="pt-5 flex items-center justify-between text-xs text-muted-foreground">
          <p className="text-[12px] font-medium text-[#705849]">
            {statusConfig.desc}
          </p>
          <span className="text-[11px] font-mono font-bold text-[#8C5B3E]">
            {deltaPercent >= 0 ? `+${deltaPercent}%` : `${deltaPercent}%`} vs timeline
          </span>
        </div>
      </div>
    </div>
  );
}
