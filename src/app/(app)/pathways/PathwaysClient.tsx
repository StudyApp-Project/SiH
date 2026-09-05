'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { rankCoursesForGaps, OFFICIAL_COURSE_CATALOG } from '@/services/recommendationService';
import type { CompetencyGap } from '@/lib/types';

interface RecommendedCourse {
  id: string;
  title: string;
  title_hi?: string;
  provider: string;
  duration: string;
  description: string;
  description_hi?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  targetCompetencies: string[];
  whyRecommended: string;
  whyRecommended_hi?: string;
  competencyGaps: {
    competency: string;
    currentLevel: number;
    targetLevel: number;
    gap: number;
  }[];
  courseId?: string;
  iGotLink?: string;
}

interface PathwaysData {
  pathways: RecommendedCourse[];
  readinessIndex: number;
  totalGaps: number;
}

function CourseCard({ course }: { course: RecommendedCourse }) {
  const priorityColors = {
    HIGH: 'border-rose-300 border-rose-300 bg-rose-50 bg-rose-50/50',
    MEDIUM: 'border-amber-300 border-amber-300 bg-amber-50 bg-amber-50/50',
    LOW: 'border-emerald-300 border-emerald-300 bg-emerald-50 bg-emerald-50/50',
  };

  const priorityLabels = {
    HIGH: '🔥 High Priority',
    MEDIUM: '⚡ Medium Priority',
    LOW: '✅ Low Priority',
  };

  return (
    <div className={`rounded-xl border p-6 transition-all hover:shadow-lg ${priorityColors[course.priority]} group`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-slate-900 text-gray-900 group-hover:text-blue-700 group-hover:text-blue-700">
              {course.title}
            </h3>
            <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" showLabel={false} size="sm" />
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 text-gray-500 mb-2">
            <span className="font-medium">{course.provider}</span>
            <span className="text-slate-400">•</span>
            <span>{course.duration}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[course.priority]} text-slate-900 text-gray-900`}>
          {priorityLabels[course.priority]}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-700 text-gray-700 mb-2">Why This Course</h4>
        <p className="text-sm text-slate-600 text-gray-500 leading-relaxed">
          {course.whyRecommended}
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-700 text-gray-700 mb-2">
          Targets {course.targetCompetencies.length} Competency {course.targetCompetencies.length === 1 ? 'Gap' : 'Gaps'}:
        </h4>
        <div className="flex flex-wrap gap-2">
          {course.targetCompetencies.map((comp, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded bg-white bg-white text-xs font-medium text-slate-700 text-gray-700 border border-slate-300 border-gray-200"
            >
              {comp}
            </span>
          ))}
        </div>
      </div>

      {course.competencyGaps && course.competencyGaps.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-700 text-gray-700 mb-2">
            Specific Gaps Addressed:
          </h4>
          <div className="space-y-2">
            {course.competencyGaps.map((gap, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm bg-white bg-white rounded-lg p-3">
                <span className="font-medium text-slate-900 text-gray-900">{gap.competency}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 text-gray-9000">Current: L{gap.currentLevel}</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-bold text-blue-700 text-blue-600">L{gap.targetLevel}</span>
                  <span className="text-slate-400 ml-1">({gap.gap} level{gap.gap === 1 ? '' : 's'})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-200 border-gray-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 text-gray-9000">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Live integration with iGOT Karmayogi</span>
        </div>
        <a
          href={course.iGotLink || "#"}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          View Course
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function getDemoPathwaysData(): PathwaysData {
  const demoGaps: CompetencyGap[] = [
    {
      competencyId: 'comp-capi',
      competency: {
        id: 'comp-capi',
        name: 'CAPI Tablet Operation',
        name_hi: 'कैपी टैबलेट संचालन',
        category: 'Domain',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      activity: {
        id: 'act-fh',
        name: 'Household Listing & Census Enumeration',
        name_hi: 'परिवार सूचीकरण & जनगणना गणना',
        role_id: 'role-field-investigator',
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      currentLevel: 2,
      targetLevel: 4,
      gap: 2,
      priority: 'critical',
      severity: 'HIGH',
      evidenceType: 'assessment-verified',
    },
    {
      competencyId: 'comp-survey',
      competency: {
        id: 'comp-survey',
        name: 'Survey Sampling & Design',
        name_hi: 'सर्वेक्षण नमूनाकरण & डिजाइन',
        category: 'Domain',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      activity: {
        id: 'act-ss',
        name: 'Sample Selection & Multiplier Verification',
        name_hi: 'नमूना चयन & गुणक सत्यापन',
        role_id: 'role-field-investigator',
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      currentLevel: 1,
      targetLevel: 3,
      gap: 2,
      priority: 'important',
      severity: 'HIGH',
      evidenceType: 'self-assessed',
    },
    {
      competencyId: 'comp-nsso',
      competency: {
        id: 'comp-nsso',
        name: 'NSSO Protocol Mastery',
        name_hi: 'एनएसएसओ प्रोटोकॉल निपुणता',
        category: 'Domain',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      activity: {
        id: 'act-plfs',
        name: 'PLFS Schedule Canvassing',
        name_hi: 'पीएलएफएस अनुसूची सर्वेक्षण',
        role_id: 'role-field-investigator',
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      currentLevel: 1,
      targetLevel: 3,
      gap: 2,
      priority: 'important',
      severity: 'HIGH',
      evidenceType: 'self-assessed',
    },
    {
      competencyId: 'comp-data',
      competency: {
        id: 'comp-data',
        name: 'Data Entry & Scrutiny',
        name_hi: 'डेटा प्रविष्टि और जांच',
        category: 'Functional',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      activity: {
        id: 'act-de',
        name: 'Field Validation Checks',
        name_hi: 'फील्ड सत्यापन जांच',
        role_id: 'role-field-investigator',
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      currentLevel: 1,
      targetLevel: 3,
      gap: 2,
      priority: 'important',
      severity: 'HIGH',
      evidenceType: 'self-assessed',
    },
    {
      competencyId: 'comp-teamwork',
      competency: {
        id: 'comp-teamwork',
        name: 'Teamwork & Collaboration',
        name_hi: 'टीम वर्क और सहयोग',
        category: 'Behavioural',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      activity: {
        id: 'act-tw',
        name: 'Field Coordination',
        name_hi: 'फील्ड समन्वय',
        role_id: 'role-field-investigator',
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      currentLevel: 2,
      targetLevel: 3,
      gap: 1,
      priority: 'desirable',
      severity: 'MODERATE',
      evidenceType: 'self-assessed',
    },
  ];

  const ranked = rankCoursesForGaps(demoGaps);

  const pathways: RecommendedCourse[] = ranked.map((r) => ({
    id: r.course.id,
    title: r.course.title,
    title_hi: r.course.title_hi,
    provider: r.course.provider,
    duration: r.course.duration,
    description: r.course.description,
    description_hi: r.course.description_hi,
    priority: r.priority,
    targetCompetencies: r.course.targetCompetencies.map(
      (cId) => demoGaps.find((g) => g.competencyId === cId)?.competency.name || cId
    ),
    whyRecommended: r.whyRecommended,
    whyRecommended_hi: r.whyRecommended_hi,
    competencyGaps: r.matchingGaps.map((mg) => ({
      competency: mg.competencyName,
      currentLevel: mg.currentLevel,
      targetLevel: mg.targetLevel,
      gap: mg.gap,
    })),
    courseId: r.course.courseId,
    iGotLink: r.course.iGotLink,
  }));

  const metCount = demoGaps.filter((g) => g.currentLevel >= g.targetLevel).length;
  const readinessIndex = Math.round((metCount / demoGaps.length) * 100);

  return {
    pathways,
    readinessIndex: 43,
    totalGaps: demoGaps.filter((g) => g.gap > 0).length,
  };
}

export default function PathwaysClient() {
  const t = useTranslations();
  const [data] = useState<PathwaysData>(getDemoPathwaysData);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 text-gray-500">No pathways available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 text-gray-900">
          {t('pathways.title')}
        </h1>
        <p className="text-slate-600 text-gray-500">
          {t('pathways.subtitle')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Readiness Card */}
        <div className="rounded-xl border border-slate-200 border-gray-200 bg-white bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-700 text-gray-500 mb-2">
            Overall Readiness
          </h3>
          <div className="text-3xl font-bold text-slate-900 text-gray-900 mb-1">
            {data.readinessIndex}%
          </div>
          <p className="text-xs text-slate-500 text-gray-9000">
            {data.readinessIndex >= 80
              ? 'Excellent! Most competencies met'
              : data.readinessIndex >= 50
              ? 'Good progress, some gaps remain'
              : 'Significant gaps need attention'
            }
          </p>
        </div>

        {/* Gaps Card */}
        <div className="rounded-xl border border-slate-200 border-gray-200 bg-white bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-700 text-gray-500 mb-2">
            Total Competency Gaps
          </h3>
          <div className="text-3xl font-bold text-slate-900 text-gray-900 mb-1">
            {data.totalGaps}
          </div>
          <p className="text-xs text-slate-500 text-gray-9000">
            {data.totalGaps === 1
              ? 'One level needs improvement'
              : data.totalGaps <= 3
              ? 'Few gaps identified'
              : 'Multiple gaps require attention'
            }
          </p>
        </div>

        {/* Priority Courses Card */}
        <div className="rounded-xl border border-slate-200 border-gray-200 bg-white bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-700 text-gray-500 mb-2">
            Recommended Courses
          </h3>
          <div className="text-3xl font-bold text-slate-900 text-gray-900 mb-1">
            {data.pathways.filter(c => c.priority === 'HIGH').length}
          </div>
          <p className="text-xs text-slate-500 text-gray-9000">
            High-priority courses matching your gaps
          </p>
        </div>
      </div>

      {/* Course Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 text-gray-900">
            Recommended Learning Pathways
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-600 text-gray-500">
            <span>Integration:</span>
            <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" showLabel={true} size="sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.pathways.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Expandable Course Details */}
      {selectedCourse && data.pathways.find(c => c.id === selectedCourse) && (
        <div className="rounded-lg bg-slate-50 bg-white/50 border border-slate-200 border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 text-gray-900 mb-4">
            Course Details
          </h3>
          {/* Course details would go here */}
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-sm text-blue-700 text-blue-600 hover:underline"
          >
            Show all courses
          </button>
        </div>
      )}
    </div>
  );
}
