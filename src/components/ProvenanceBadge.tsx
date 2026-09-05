'use client';

import React from 'react';
import type { ProvenanceType } from '@/lib/types';

// ============================================================================
// PROVENANCE BADGE COMPONENT
// ============================================================================

interface ProvenanceBadgeProps {
  provenance: ProvenanceType;
  showLabel?: boolean;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PROVENANCE_CONFIG: Record<
  ProvenanceType,
  {
    label: string;
    icon: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    description: string;
  }
> = {
  VERIFIED_OFFICIAL: {
    label: 'Verified Official',
    icon: '✅',
    bgColor: 'bg-green-50 dark:bg-green-950',
    borderColor: 'border-green-300 dark:border-green-700',
    textColor: 'text-green-700 dark:text-green-300',
    description: 'Matches real government structure or fact from official sources (MoSPI, NSSTA, FRAC)',
  },
  PROPOSED_FRAMEWORK: {
    label: 'Proposed Framework',
    icon: '⚠️',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    borderColor: 'border-amber-300 dark:border-amber-700',
    textColor: 'text-amber-700 dark:text-amber-300',
    description: 'Structurally grounded in official methodology, but specific content is our proposal',
  },
  PROPOSED_METHODOLOGY: {
    label: 'Proposed Methodology',
    icon: '⚠️',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    borderColor: 'border-amber-300 dark:border-amber-700',
    textColor: 'text-amber-700 dark:text-amber-300',
    description: 'Our team proposed formula or methodology (e.g., gap severity calculation)',
  },
  SYNTHETIC_DEMO_DATA: {
    label: 'Demo Data',
    icon: '🟡',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    borderColor: 'border-yellow-300 dark:border-yellow-700',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    description: 'Fabricated for demonstration; no claim to real-world accuracy',
  },
};

/**
 * ProvenanceBadge Component
 * Renders a visual badge indicating data provenance with optional tooltip
 */
export function ProvenanceBadge({
  provenance,
  showLabel = true,
  showTooltip = true,
  size = 'md',
}: ProvenanceBadgeProps) {
  const config = PROVENANCE_CONFIG[provenance];
  const [showTooltipContent, setShowTooltipContent] = React.useState(false);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-2.5 py-1.5 text-sm gap-1.5',
    lg: 'px-3 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="relative inline-block">
      <div
        className={`
          flex items-center rounded-md border
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          ${sizeClasses[size]}
          font-medium transition-colors duration-200
          ${showTooltip ? 'cursor-help hover:opacity-80' : ''}
        `}
        onMouseEnter={() => showTooltip && setShowTooltipContent(true)}
        onMouseLeave={() => setShowTooltipContent(false)}
        title={config.description}
      >
        <span className={iconSizes[size]}>{config.icon}</span>
        {showLabel && <span>{config.label}</span>}
      </div>

      {/* Tooltip */}
      {showTooltipContent && showTooltip && (
        <div
          className={`
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
            bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900
            rounded-md px-3 py-2 text-xs font-normal whitespace-nowrap
            pointer-events-none shadow-lg
          `}
        >
          {config.description}
          {/* Tooltip arrow */}
          <div
            className={`
              absolute top-full left-1/2 -translate-x-1/2
              border-4 border-transparent
              border-t-gray-900 dark:border-t-gray-100
            `}
          />
        </div>
      )}
    </div>
  );
}

/**
 * ProvenanceBadgeInline
 * Compact inline variant (no label, just icon)
 */
export function ProvenanceBadgeInline({ provenance }: Pick<ProvenanceBadgeProps, 'provenance'>) {
  return <ProvenanceBadge provenance={provenance} showLabel={false} size="sm" />;
}

/**
 * ProvenanceIndicator
 * Text-only indicator (no badge styling)
 */
export function ProvenanceIndicator({ provenance }: Pick<ProvenanceBadgeProps, 'provenance'>) {
  const config = PROVENANCE_CONFIG[provenance];
  return (
    <span className="text-xs font-medium" title={config.description}>
      {config.icon} {config.label}
    </span>
  );
}

/**
 * ProvenanceDisclosure
 * Full description card for legal/compliance page
 */
export function ProvenanceDisclosure() {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
      <h3 className="text-lg font-semibold">Data Provenance & Transparency</h3>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        StatVidya explicitly labels every domain data element with its origin and verification status. This
        transparency ensures you always know whether data represents official government fact, our team's proposal,
        or demonstration simulations.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(Object.entries(PROVENANCE_CONFIG) as Array<[ProvenanceType, (typeof PROVENANCE_CONFIG)[ProvenanceType]]>).map(
          ([type, config]) => (
            <div
              key={type}
              className={`rounded-md border p-4 ${config.bgColor} ${config.borderColor}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{config.icon}</span>
                <span className={`font-semibold ${config.textColor}`}>{config.label}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{config.description}</p>
            </div>
          )
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
        <p>
          <strong>Questions?</strong> Read more about our framework alignment in the{' '}
          <a href="/docs/frac" className="underline hover:text-gray-700 dark:hover:text-gray-200">
            FRAC documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default ProvenanceBadge;
