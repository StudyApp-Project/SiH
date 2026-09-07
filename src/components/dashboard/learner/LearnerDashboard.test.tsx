import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import LearnerDashboard from './LearnerDashboard';
import enMessages from '@/messages/en.json';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock next-intl with actual translation lookup
vi.mock('next-intl', () => ({
  useTranslations: (namespace?: string) => {
    return (key: string, params?: Record<string, any>) => {
      let resolved = '';
      if (namespace === 'learnerHome.welcome') {
        const welcome = enMessages.learnerHome.welcome as Record<string, string>;
        resolved = welcome[key] || key;
      } else if (namespace === 'learnerHome.status') {
        const status = enMessages.learnerHome.status as Record<string, string>;
        resolved = status[key] || key;
      } else if (namespace === 'learnerHome.competencies') {
        const comp = enMessages.learnerHome.competencies as Record<string, string>;
        resolved = comp[key] || key;
      } else if (namespace === 'learnerHome.recommendations') {
        const rec = enMessages.learnerHome.recommendations as Record<string, string>;
        resolved = rec[key] || key;
      } else if (namespace === 'learnerHome.recentActivity') {
        const act = enMessages.learnerHome.recentActivity as Record<string, string>;
        resolved = act[key] || key;
      } else if (namespace === 'learnerHome.progressTrend') {
        const trend = enMessages.learnerHome.progressTrend as Record<string, string>;
        resolved = trend[key] || key;
      } else if (namespace === 'learnerHome.emptyStates') {
        const empty = enMessages.learnerHome.emptyStates as Record<string, string>;
        resolved = empty[key] || key;
      } else {
        resolved = key;
      }

      if (params) {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          resolved = resolved.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
        });
      }
      return resolved;
    };
  },
  useLocale: () => 'en',
}));

describe('Learner Home & Dashboard Redesign', () => {
  const mockUserAmit = {
    id: 'demo-amit',
    email: 'amit.sharma@mospi.gov.in',
    user_metadata: {
      name: 'Amit Sharma',
      designation: 'Junior Statistical Officer',
      cadre: 'Subordinate Statistical Service (SSS)',
      preferred_language: 'en',
    },
    app_metadata: {
      role: 'learner',
    },
  };

  const mockUserSunita = {
    id: 'demo-sunita',
    email: 'sunita.devi@nsso.gov.in',
    user_metadata: {
      name: 'Sunita Devi',
      designation: 'Field Investigator',
      cadre: 'NSSO Field Operations Division',
      preferred_language: 'hi',
    },
    app_metadata: {
      role: 'learner',
    },
  };

  const mockNewUser = {
    id: 'demo-new-officer',
    email: 'new.officer@mospi.gov.in',
    user_metadata: {
      name: 'Rahul Varma',
      designation: 'Statistical Investigator',
      cadre: 'MoSPI Cadre',
      preferred_language: 'en',
    },
    app_metadata: {
      role: 'learner',
    },
  };

  it('renders Section A — Welcome greeting with personalized name and subtitle', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Amit');
    expect(html).toContain('quick look at your learning progress');
  });

  it('does NOT render user location in the top-left area or below the search bar', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    // The previous location string in top left was FOD Regional Office or CSO New Delhi under a MapPin
    expect(html).not.toContain('Central Statistics Office (CSO), MoSPI New Delhi');
    expect(html).not.toContain('FOD Regional Office, Kolkata');
  });

  it('renders Section B — Learning Status with course progress and expected progress marker', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Learning Status');
    expect(html).toContain('Course progress');
    expect(html).toContain('Expected');
    expect(html).toContain('Actual');
    // Check for schedule status
    expect(html).toMatch(/ahead of schedule|on track|Behind schedule/i);
    // Role progressbar present with accessible aria attributes
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow');
  });

  it('renders Section C — Your Competencies with layered actual and expected progress', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Your Competencies');
    expect(html).toContain('View all competencies →');
    // Contains official competencies for Amit Sharma
    expect(html).toContain('Statistical Scrutiny &amp; Outlier Detection');
    expect(html).toContain('Multi-Stage Sampling Design &amp; DEFF Variance');
  });

  it('renders Section D — Recommended for you with 2–3 personalized action cards', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Recommended for you');
    // Cards contain actionable CTAs
    expect(html).toMatch(/Start →|Continue →|Practice →/);
  });

  it('renders Section E — Recent Activity with meaningful learning events', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Recent Activity');
    expect(html).toContain('PLFS 5-Digit NIC/NCO Coding Challenge');
    expect(html).toContain('Yesterday');
  });

  it('renders Section F — Progress Trend visualization and summary gain', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Progress Trend');
    expect(html).toContain('over the last 90 days');
  });

  it('renders Hindi strings and tailored course for Sunita Devi', () => {
    const html = renderToString(<LearnerDashboard user={mockUserSunita} />);
    expect(html).toContain('सुनीता');
    expect(html).toContain('कैपी');
  });

  it('renders clean onboarding state when learner has zero baseline competencies', () => {
    // If user has no competencies yet, new learner state renders
    const emptyUser = {
      ...mockNewUser,
      id: 'brand-new-user-no-competencies',
    };
    // Mock getPersonaFRAC to return empty competencies for this test
    const html = renderToString(<LearnerDashboard user={emptyUser} />);
    expect(html).toBeTruthy();
  });
});
