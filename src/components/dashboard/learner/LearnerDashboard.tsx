'use client';

import React, { useState } from 'react';
import type { DashboardUserProps } from '@/components/dashboard/RoleDashboardRouter';
import { getPersonaFRAC } from '@/data/fracCadres';
import { useSafeLocale } from '@/lib/useSafeLocale';
import type { DemoPersona } from '@/lib/types';

import {
  calculateCourseTimeline,
  getLayeredCompetencies,
  getPersonalizedRecommendations,
  getRecentActivities,
  getProgressTrend,
  type LearnerActionCard,
} from '@/services/learnerProgressService';

import { LearnerWelcomeHeader } from './LearnerWelcomeHeader';
import { LearnerCourseStatusCard } from './LearnerCourseStatusCard';
import { LearnerCompetencyOverview } from './LearnerCompetencyOverview';
import { LearnerRecommendations } from './LearnerRecommendations';
import { LearnerRecentActivity } from './LearnerRecentActivity';
import { LearnerProgressTrendComponent } from './LearnerProgressTrend';

import { LearnerKarmaLedgerModal } from './modals/LearnerKarmaLedgerModal';
import { CAPIConnectivityModal } from './modals/CAPIConnectivityModal';
import { OfficerDossierModal } from './modals/OfficerDossierModal';
import { LearnerDrillModal } from './modals/LearnerDrillModal';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LearnerDashboard({ user }: { user: DashboardUserProps }) {
  // Retrieve official FRAC profile
  const profile = getPersonaFRAC(user);

  // Read global app locale from next-intl (with fallback to user preferred language)
  const globalLocale = useSafeLocale(user.user_metadata?.preferred_language || 'en');
  const isHindi = globalLocale === 'hi' || user.user_metadata?.preferred_language === 'hi';

  const displayName = isHindi && profile.name === 'Sunita Devi' ? 'सुनीता देवी' : profile.name;

  // Compute calculated course timeline, layered competencies, recommendations, activity, and trend
  const timeline = calculateCourseTimeline(profile);
  const layeredCompetencies = getLayeredCompetencies(profile.competencies, timeline.expectedProgress);
  const recommendations = getPersonalizedRecommendations(profile, timeline);
  const recentActivities = getRecentActivities(isHindi);
  const progressTrend = getProgressTrend();

  // Interactive Modal States
  const [activeDrillId, setActiveDrillId] = useState<string | null>(null);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [capiModalOpen, setCapiModalOpen] = useState(false);
  const [karmaModalOpen, setKarmaModalOpen] = useState(false);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);

  // Persona for dossier modal
  const activePersona: DemoPersona = {
    id: user.id || 'demo-learner',
    name: (user.user_metadata?.name as string) || profile.name,
    email: user.email || 'learner@mospi.gov.in',
    role: 'learner',
    designation: (user.user_metadata?.designation as string) || profile.designation,
    cadre: (user.user_metadata?.cadre as string) || profile.cadre,
    department: profile.department,
    preferred_language: isHindi ? 'hi' : 'en',
    organization_id: 'org-mospi',
  };

  const handleStartDrill = (drillId: string) => {
    setActiveDrillId(drillId);
  };

  const handleDrillComplete = (points: number) => {
    alert(
      isHindi
        ? `बधाई! आपके आधिकारिक कैडर प्रोफाइल में +${points} कर्म अंक जोड़ दिए गए हैं।`
        : `Congratulations! +${points} Karma Points have been credited to your official civil service dossier.`
    );
  };

  const handleActionClick = (card: LearnerActionCard) => {
    if (card.type === 'PRACTICE' || card.type === 'ASSESS') {
      // Open drill modal directly if practicing
      handleStartDrill('drill-1');
    }
  };

  // Check if brand new learner with zero competencies
  const isNewLearner = profile.competencies.length === 0;

  return (
    <div
      data-testid="learner-dashboard"
      className="space-y-6 pb-12 max-w-6xl mx-auto animate-in fade-in duration-200"
    >
      {/* Section A — Welcome Header (Lightweight, no location pill, no bulky profile bento) */}
      <LearnerWelcomeHeader name={displayName} isHindi={isHindi} />

      {/* New Learner Onboarding / Empty State Banner */}
      {isNewLearner ? (
        <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-8 shadow-xs text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-[#F8C858]/20 text-[#8C5B3E] flex items-center justify-center">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-[#2d1f17]">
            {isHindi ? 'आपकी शिक्षण यात्रा में आपका स्वागत है!' : 'Welcome to your Learning Journey!'}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {isHindi
              ? 'अपनी दक्षताओं का निदान करने और व्यक्तिगत अनुशंसाएं प्राप्त करने के लिए आधारभूत मूल्यांकन पूर्ण करें।'
              : 'Complete your baseline assessment to map your competencies and unlock personalized recommendations.'}
          </p>
          <Link
            href="/assignments"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#555934] text-white font-bold text-sm hover:bg-[#434728] transition-colors shadow-2xs"
          >
            <span>{isHindi ? 'आधारभूत मूल्यांकन आरंभ करें →' : 'Start Baseline Assessment →'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Section B — Overall Learning / Course Status (Layered Actual vs Expected Timeline) */}
          <LearnerCourseStatusCard timeline={timeline} isHindi={isHindi} />

          {/* Section C — Competency Section (Your Competencies with Layered Progress Bars) */}
          <LearnerCompetencyOverview
            competencies={layeredCompetencies}
            isHindi={isHindi}
          />

          {/* Section D — Personalized Recommendations (2-3 Action Cards) */}
          <LearnerRecommendations
            recommendations={recommendations}
            isHindi={isHindi}
            onActionClick={handleActionClick}
          />

          {/* Sections E & F — Recent Activity & Progress Trend (Compact side-by-side or stacked grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Section E — Recent Activity */}
            <LearnerRecentActivity
              activities={recentActivities}
              isHindi={isHindi}
              onViewAll={() => setKarmaModalOpen(true)}
            />

            {/* Section F — Progress Trend ("Am I improving?") */}
            <LearnerProgressTrendComponent trend={progressTrend} isHindi={isHindi} />
          </div>
        </>
      )}

      {/* Interactive Support Modals */}
      <OfficerDossierModal
        isOpen={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
        persona={activePersona}
        isHindi={isHindi}
      />

      <CAPIConnectivityModal
        isOpen={capiModalOpen}
        onClose={() => setCapiModalOpen(false)}
        isOfflineSimulated={isOfflineSimulated}
        onToggleOfflineSimulated={() => setIsOfflineSimulated(!isOfflineSimulated)}
        isHindi={isHindi}
      />

      <LearnerKarmaLedgerModal
        isOpen={karmaModalOpen}
        onClose={() => setKarmaModalOpen(false)}
        points={550}
        isHindi={isHindi}
      />

      <LearnerDrillModal
        isOpen={Boolean(activeDrillId)}
        drillId={activeDrillId || 'drill-schedule-0'}
        onClose={() => setActiveDrillId(null)}
        onComplete={handleDrillComplete}
        isHindi={isHindi}
      />
    </div>
  );
}
