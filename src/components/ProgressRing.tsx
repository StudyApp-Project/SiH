'use client';

import React from 'react';

interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  className?: string;
  color?: string;
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  showPercentage = true,
  className = '',
  color,
}: ProgressRingProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  // Determine color based on value if not provided
  const getRingColor = (val: number) => {
    if (color) return color;
    if (val >= 80) return 'text-emerald-600 dark:text-emerald-500';
    if (val >= 50) return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-500';
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-valuenow={normalizedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          className="text-slate-100 dark:text-zinc-800"
        />
        {/* Progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          className={`transition-all duration-1000 ease-out ${getRingColor(normalizedValue)}`}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {showPercentage && (
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 font-mono">
            {Math.round(normalizedValue)}%
          </span>
        )}
        {label && (
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 mt-0.5">
            {label}
          </span>
        )}
      </div>

      {sublabel && (
        <span className="mt-2 text-xs text-slate-500 dark:text-zinc-400 text-center">
          {sublabel}
        </span>
      )}
    </div>
  );
}

export default ProgressRing;
