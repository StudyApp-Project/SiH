'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { TrendingUp } from 'lucide-react';
import type { LearnerProgressTrend } from '@/services/learnerProgressService';

interface LearnerProgressTrendProps {
  trend: LearnerProgressTrend;
  isHindi?: boolean;
}

export function LearnerProgressTrendComponent({
  trend,
  isHindi = false,
}: LearnerProgressTrendProps) {
  const t = useTranslations('learnerHome.progressTrend');
  const points = trend.points;

  // Compute SVG viewBox dimensions and line coordinates
  const svgWidth = 320;
  const svgHeight = 120;
  const paddingX = 35;
  const paddingY = 25;

  const minScore = 35;
  const maxScore = 80;

  const coords = points.map((pt, idx) => {
    const x =
      paddingX + (idx / Math.max(1, points.length - 1)) * (svgWidth - paddingX * 2);
    const y =
      svgHeight -
      paddingY -
      ((pt.score - minScore) / (maxScore - minScore)) * (svgHeight - paddingY * 2);
    return { x, y, score: pt.score, month: isHindi ? pt.month_hi : pt.month };
  });

  // Construct smooth SVG path
  const pathD = coords.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pt.x},${pt.y}`;
  }, '');

  // Fill area under the line
  const areaD = `${pathD} L ${coords[coords.length - 1].x},${svgHeight - 12} L ${coords[0].x},${svgHeight - 12} Z`;

  const summary = isHindi && trend.summaryGain_hi ? trend.summaryGain_hi : trend.summaryGain;

  return (
    <div
      data-testid="learner-progress-trend"
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

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[11px] font-bold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{summary}</span>
          </span>
        </div>

        {/* Lightweight SVG Sparkline Chart */}
        <div className="mt-4 pt-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-28 overflow-visible"
            aria-label={`Progress trend chart showing progression from ${points[0]?.score}% to ${points[points.length - 1]?.score}%`}
            role="img"
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#555934" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#555934" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle baseline grid line */}
            <line
              x1={paddingX}
              y1={svgHeight - 14}
              x2={svgWidth - paddingX}
              y2={svgHeight - 14}
              stroke="#BF9B7A"
              strokeOpacity="0.3"
              strokeDasharray="3 3"
            />

            {/* Gradient filled area under curve */}
            <path d={areaD} fill="url(#trendGradient)" />

            {/* Main Trend Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#555934"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data points & Score Callouts */}
            {coords.map((pt, i) => {
              const isLast = i === coords.length - 1;

              return (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isLast ? 5 : 4}
                    fill={isLast ? '#F8C858' : '#555934'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-transform hover:scale-125"
                  />
                  {/* Score badge above marker */}
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-bold fill-[#2d1f17]"
                  >
                    {pt.score}%
                  </text>
                  {/* Month label below */}
                  <text
                    x={pt.x}
                    y={svgHeight - 2}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-[#705849]"
                  >
                    {pt.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <p className="text-[11px] text-[#705849] mt-3 pt-2 border-t border-[#BF9B7A]/15 font-medium">
        {t('improving')}
      </p>
    </div>
  );
}
