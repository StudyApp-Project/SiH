/**
 * integrationService.ts — Mock iGOT Karmayogi / DSEP Adapter
 *
 * Implements FR-IGOT-1, FR-IGOT-2
 * Provides synthetic data contract simulation for iGOT Karmayogi integration.
 * Ensures consistent PROVENANCE labels (SYNTHETIC_DEMO_DATA).
 */

import { type ProvenanceType } from '@/lib/types';

export const SYNTHETIC_MARKER: ProvenanceType = 'SYNTHETIC_DEMO_DATA';

export interface iGotCourseAdapter {
  id: string;
  igot_id: string;
  course_name: string;
  provider_name: string;
  provider_type: 'igot' | 'nssta' | 'tpac' | 'external';
  duration_minutes: number;
  provenance: ProvenanceType;
}

/**
 * Mock fetcher for official iGOT catalog data
 */
export async function fetchIGOTCatalog(): Promise<iGotCourseAdapter[]> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: 'mock-igot-capi-adv',
      igot_id: 'do_1138472910_capi_advanced',
      course_name: 'Advanced CAPI Tablet Operations',
      provider_name: 'NSSTA',
      provider_type: 'nssta',
      duration_minutes: 240,
      provenance: SYNTHETIC_MARKER,
    },
    {
      id: 'mock-igot-nsso-plfs',
      igot_id: 'do_1139482711_nsso_plfs',
      course_name: 'PLFS Concepts & Definitions',
      provider_name: 'NSSTA',
      provider_type: 'nssta',
      duration_minutes: 360,
      provenance: SYNTHETIC_MARKER,
    },
  ];
}
