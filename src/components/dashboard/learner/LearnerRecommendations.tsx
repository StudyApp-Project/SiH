'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  ClipboardCheck,
  PlayCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import type { LearnerActionCard } from '@/services/learnerProgressService';

interface LearnerRecommendationsProps {
  recommendations: LearnerActionCard[];
  isHindi?: boolean;
  onActionClick?: (card: LearnerActionCard) => void;
}

export function LearnerRecommendations({
  recommendations,
  isHindi = false,
  onActionClick,
}: LearnerRecommendationsProps) {
  const t = useTranslations('learnerHome.recommendations');

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const getTypeStyle = (type: LearnerActionCard['type']) => {
    switch (type) {
      case 'ASSESS':
        return {
          icon: ClipboardCheck,
          badgeColor: 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30',
          ctaBg: 'bg-[#555934] text-white hover:bg-[#434728]',
        };
      case 'CONTINUE':
        return {
          icon: PlayCircle,
          badgeColor: 'bg-amber-500/15 text-amber-900 border-amber-500/30',
          ctaBg: 'bg-[#8C5B3E] text-white hover:bg-[#704830]',
        };
      case 'REASSESS':
        return {
          icon: RotateCcw,
          badgeColor: 'bg-purple-500/15 text-purple-800 border-purple-500/30',
          ctaBg: 'bg-purple-700 text-white hover:bg-purple-800',
        };
      case 'PRACTICE':
      default:
        return {
          icon: Sparkles,
          badgeColor: 'bg-blue-500/15 text-blue-800 border-blue-500/30',
          ctaBg: 'bg-[#2d1f17] text-[#FAF6F0] hover:bg-black',
        };
    }
  };

  return (
    <div
      data-testid="learner-recommendations"
      className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 sm:p-7 shadow-xs"
    >
      {/* Header */}
      <div className="pb-4 border-b border-[#BF9B7A]/20">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5B3E]">
          {t('subtitle')}
        </span>
        <h2 className="text-base sm:text-lg font-bold text-[#2d1f17] mt-0.5">
          {t('title')}
        </h2>
      </div>

      {/* 2-3 Action Cards Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((card, idx) => {
          const typeStyle = getTypeStyle(card.type);
          const Icon = typeStyle.icon;
          const badgeText = isHindi && card.badge_hi ? card.badge_hi : card.badge;
          const titleText = isHindi && card.title_hi ? card.title_hi : card.title;
          const explanationText =
            isHindi && card.explanation_hi ? card.explanation_hi : card.explanation;
          const ctaText = isHindi && card.ctaText_hi ? card.ctaText_hi : card.ctaText;

          return (
            <div
              key={card.id}
              className="rounded-2xl bg-[#FAF6F0]/60 border border-[#BF9B7A]/30 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-card-elevated hover:bg-white hover:border-[#BF9B7A] group"
            >
              <div>
                {/* Top Badge: Action Type & Priority rank */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${typeStyle.badgeColor}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{badgeText}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-muted-foreground">
                    #{idx + 1}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="font-bold text-sm text-[#2d1f17] group-hover:text-[#555934] transition-colors leading-snug line-clamp-2">
                  {titleText}
                </h3>

                {/* Why it is relevant */}
                <p className="text-xs text-[#705849] mt-2 line-clamp-3 leading-relaxed">
                  {explanationText}
                </p>
              </div>

              {/* Clear CTA Button */}
              <div className="mt-5 pt-3 border-t border-[#BF9B7A]/20">
                {onActionClick ? (
                  <button
                    type="button"
                    onClick={() => onActionClick(card)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer group-hover:gap-2.5 ${typeStyle.ctaBg}`}
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <Link
                    href={card.href}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs group-hover:gap-2.5 ${typeStyle.ctaBg}`}
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
