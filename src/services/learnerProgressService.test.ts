import { describe, it, expect } from 'vitest';
import {
  calculateCourseTimeline,
  getLayeredCompetencies,
  getPersonalizedRecommendations,
  getRecentActivities,
  getProgressTrend,
} from './learnerProgressService';
import { getPersonaFRAC } from '@/data/fracCadres';

describe('learnerProgressService', () => {
  const profileAmit = getPersonaFRAC('demo-amit');
  const profileSunita = getPersonaFRAC('demo-sunita');

  describe('calculateCourseTimeline', () => {
    it('calculates expected progress based on elapsed weeks and total weeks', () => {
      // 7 weeks of 12 weeks = 58%
      const timeline = calculateCourseTimeline(profileAmit, {
        totalWeeks: 12,
        currentWeek: 7,
        actualProgress: 68,
      });

      expect(timeline.expectedProgress).toBe(58);
      expect(timeline.actualProgress).toBe(68);
      expect(timeline.status).toBe('ahead');
      expect(timeline.statusLabel).toContain('ahead');
    });

    it('identifies behind schedule when actual is noticeably below expected', () => {
      const timeline = calculateCourseTimeline(profileAmit, {
        totalWeeks: 12,
        currentWeek: 8,
        actualProgress: 40,
      });

      // 8 / 12 = 67% expected, actual = 40% -> behind
      expect(timeline.expectedProgress).toBe(67);
      expect(timeline.status).toBe('behind');
      expect(timeline.statusLabel).toContain('Behind');
    });

    it('identifies on schedule when actual is within tolerance of expected', () => {
      const timeline = calculateCourseTimeline(profileAmit, {
        totalWeeks: 10,
        currentWeek: 5,
        actualProgress: 50,
      });

      // 5 / 10 = 50% expected, actual = 50% -> on-track
      expect(timeline.expectedProgress).toBe(50);
      expect(timeline.status).toBe('on-track');
    });
  });

  describe('getLayeredCompetencies', () => {
    it('computes layered actual and expected percentages for competencies', () => {
      const layered = getLayeredCompetencies(profileAmit.competencies, 58);
      expect(layered.length).toBeGreaterThan(0);

      const first = layered[0];
      expect(first.actualPercent).toBeGreaterThanOrEqual(0);
      expect(first.actualPercent).toBeLessThanOrEqual(100);
      expect(first.expectedPercent).toBeGreaterThanOrEqual(0);
      expect(['ahead', 'on-track', 'behind']).toContain(first.status);
    });
  });

  describe('getPersonalizedRecommendations', () => {
    it('generates 2-3 personalized action cards prioritized by learner gaps', () => {
      const timeline = calculateCourseTimeline(profileAmit);
      const recs = getPersonalizedRecommendations(profileAmit, timeline);

      expect(recs.length).toBeGreaterThanOrEqual(2);
      expect(recs.length).toBeLessThanOrEqual(3);

      // Verify each card contains necessary fields
      for (const rec of recs) {
        expect(rec.title).toBeTruthy();
        expect(rec.explanation).toBeTruthy();
        expect(rec.ctaText).toBeTruthy();
        expect(rec.href).toBeTruthy();
        expect(['ASSESS', 'CONTINUE', 'PRACTICE', 'REASSESS']).toContain(rec.type);
      }
    });

    it('includes specific activities relevant to Sunita Devi', () => {
      const timeline = calculateCourseTimeline(profileSunita);
      const recs = getPersonalizedRecommendations(profileSunita, timeline);

      expect(recs.length).toBeGreaterThanOrEqual(2);
      const titles = recs.map((r) => r.title).join(' ');
      expect(titles.length).toBeGreaterThan(10);
    });
  });

  describe('getRecentActivities', () => {
    it('returns 3-4 meaningful learning activities', () => {
      const activities = getRecentActivities();
      expect(activities.length).toBeGreaterThanOrEqual(3);
      expect(activities.length).toBeLessThanOrEqual(4);

      expect(activities[0].title).toBeTruthy();
      expect(activities[0].date).toBeTruthy();
    });
  });

  describe('getProgressTrend', () => {
    it('returns lightweight trend points and summary gain', () => {
      const trend = getProgressTrend();
      expect(trend.points.length).toBe(4);
      expect(trend.summaryGain).toContain('+');
    });
  });
});
