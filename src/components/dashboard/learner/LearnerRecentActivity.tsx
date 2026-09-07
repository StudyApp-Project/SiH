'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  CheckCircle2,
  BookOpen,
  TrendingUp,
  Award,
  ArrowRight,
} from 'lucide-react';
import type { LearnerActivityItem } from '@/services/learnerProgressService';

interface LearnerRecentActivityProps {
  activities: LearnerActivityItem[];
  isHindi?: boolean;
  onViewAll?: () => void;
}

export function LearnerRecentActivity({
  activities,
  isHindi = false,
  onViewAll,
}: LearnerRecentActivityProps) {
  const t = useTranslations('learnerHome.recentActivity');

  if (!activities || activities.length === 0) {
    return null;
  }

  const getActivityIcon = (type: LearnerActivityItem['type']) => {
    switch (type) {
      case 'assessment':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-700 bg-emerald-500/15',
        };
      case 'module':
        return {
          icon: BookOpen,
          color: 'text-[#8C5B3E] bg-[#8C5B3E]/15',
        };
      case 'competency':
        return {
          icon: TrendingUp,
          color: 'text-blue-700 bg-blue-500/15',
        };
      case 'milestone':
      default:
        return {
          icon: Award,
          color: 'text-[#555934] bg-[#555934]/15',
        };
    }
  };

  return (
    <div
      data-testid="learner-recent-activity"
      className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-xs flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#BF9B7A]/20">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5B3E]">
              {t('subtitle')}
            </span>
            <h2 className="text-base font-bold text-[#2d1f17] mt-0.5">
              {t('title')}
            </h2>
          </div>
        </div>

        {/* 3-4 Activity items list */}
        <div className="mt-4 space-y-3">
          {activities.slice(0, 4).map((item) => {
            const iconConfig = getActivityIcon(item.type);
            const Icon = iconConfig.icon;
            const title = isHindi && item.title_hi ? item.title_hi : item.title;
            const detail = isHindi && item.detail_hi ? item.detail_hi : item.detail;
            const date = isHindi && item.date_hi ? item.date_hi : item.date;

            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-2.5 rounded-2xl bg-[#FAF6F0]/50 border border-[#BF9B7A]/20 hover:bg-[#FAF6F0] transition-colors"
              >
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconConfig.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-[#2d1f17] line-clamp-1">
                      {title}
                    </p>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                      {date}
                    </span>
                  </div>
                  {detail && (
                    <p className="text-[11px] font-medium text-[#8C5B3E] mt-0.5">
                      {detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer link to view full history */}
      {onViewAll && (
        <div className="mt-4 pt-3 border-t border-[#BF9B7A]/20">
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#555934] hover:text-[#434728] transition-colors cursor-pointer"
          >
            <span>{t('viewHistory')}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
