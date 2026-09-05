'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';

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
  const demoCourses: RecommendedCourse[] = [
    {
      id: 'course-survey-sampling',
      title: 'NSSO Survey Sampling Fundamentals',
      title_hi: 'एनएसएसओ सर्वेक्षण नमूनाकरण मूल बातें',
      provider: 'iGOT Karmayogi',
      duration: '12 hours',
      description: 'Advanced sampling techniques for official statistics collection',
      description_hi: 'आधिकारिक सांख्यिकी संग्रह के लिए उन्नत नमूनाकरण तकनीक',
      priority: 'HIGH',
      targetCompetencies: ['Survey Sampling & Design', 'Statistical Estimation & Analysis'],
      whyRecommended: 'Critical for Field Investigators to achieve Level 4 in CAPI operations and Level 3 in unit-level processing',
      whyRecommended_hi: 'कैपी संचालन में स्तर 4 और इकाई-स्तर प्रसंस्करण में स्तर 3 प्राप्त करने के लिए महत्वपूर्ण',
      competencyGaps: [
        { competency: 'Survey Sampling & Design', currentLevel: 1, targetLevel: 3, gap: 2 },
        { competency: 'Statistical Estimation & Analysis', currentLevel: 1, targetLevel: 4, gap: 3 },
      ],
      courseId: 'course-123',
      iGotLink: '#',
    },
    {
      id: 'course-capi-operation',
      title: 'CAPI Tablet Operation for Field Investigators',
      title_hi: 'फील्ड जांचकर्ताओं के लिए कैपी टैबलेट संचालन',
      provider: 'NSSTA',
      duration: '8 hours',
      description: 'Complete hands-on training on CAPI tablets for household surveys',
      description_hi: 'घरेलू सर्वेक्षण के लिए कैपी टैबलेट पर पूरा हाथों-पर-अभ्यास प्रशिक्षण',
      priority: 'HIGH',
      targetCompetencies: ['CAPI Tablet Operation', 'Data Entry & Scrutiny'],
      whyRecommended: 'Addresses highest-priority gap for Field Investigator role (critical competency with 70% skill deficit)',
      whyRecommended_hi: 'फील्ड इन्वेस्टिगेटर भूमिका के लिए उच्चतम प्राथमिकता वाले अंतराल (30% क्षमता घाटे)',
      competencyGaps: [
        { competency: 'CAPI Tablet Operation', currentLevel: 2, targetLevel: 4, gap: 2 },
        { competency: 'Data Entry & Scrutiny', currentLevel: 1, targetLevel: 3, gap: 2 },
      ],
      courseId: 'course-456',
      iGotLink: '#',
    },
    {
      id: 'course-python-stats',
      title: 'Python for Statistical Analysis',
      title_hi: 'सांख्यिकीय विश्लेषण के लिए पायथन',
      provider: 'iGOT Karmayogi',
      duration: '20 hours',
      description: 'Statistical computing and data analysis using Python in official statistics',
      description_hi: 'आधिकारिक सांख्यिकी में सांख्यिकीय कंप्यूटिंग और डेटा विश्लेषण',
      priority: 'MEDIUM',
      targetCompetencies: ['Python for Statistical Analysis', 'Statistical Estimation & Analysis'],
      whyRecommended: 'Supports both functional and domain competency needs for JSO cadre promotion',
      whyRecommended_hi: 'जेएसओ कैडर पदोन्नति के लिए कार्यात्मक और डोमेन दक्षता आवश्यकताओं का समर्थन करता है',
      competencyGaps: [
        { competency: 'Python for Statistical Analysis', currentLevel: 1, targetLevel: 3, gap: 2 },
        { competency: 'Statistical Estimation & Analysis', currentLevel: 1, targetLevel: 4, gap: 3 },
      ],
      courseId: 'course-789',
      iGotLink: '#',
    },
    {
      id: 'course-teamwork-collaboration',
      title: 'Teamwork & Collaboration for Statistical Teams',
      title_hi: 'सांख्यिकीय टीमों के लिए टीमवर्क और सहयोग',
      provider: 'NSSTA',
      duration: '6 hours',
      description: 'Developing effective collaboration skills for statistical teams',
      description_hi: 'सांख्यिकीय टीमों के लिए प्रभावी सहयोग कौशल विकसित करना',
      priority: 'LOW',
      targetCompetencies: ['Teamwork & Collaboration'],
      whyRecommended: 'Supports behavioral competency requirements for all official statistical roles',
      whyRecommended_hi: 'सभी आधिकारिक सांख्यिकीय भूमिकाओं के लिए व्यवहारिक दक्षता आवश्यकताओं का समर्थन करता है',
      competencyGaps: [
        { competency: 'Teamwork & Collaboration', currentLevel: 2, targetLevel: 3, gap: 1 },
      ],
      courseId: 'course-999',
      iGotLink: '#',
    },
  ];

  const demoCompetencies = [
    { current: 2, target: 4 },
    { current: 1, target: 3 },
    { current: 1, target: 3 },
    { current: 4, target: 2 },
    { current: 1, target: 4 },
    { current: 1, target: 4 },
  ];

  const met = demoCompetencies.filter(c => c.current >= c.target).length;
  const readiness = Math.round((met / demoCompetencies.length) * 100);
  const highPriorityCourses = demoCourses.filter(c => c.priority === 'HIGH');

  return {
    pathways: highPriorityCourses,
    readinessIndex: readiness,
    totalGaps: demoCompetencies.reduce((sum, c) => sum + Math.max(0, c.target - c.current), 0),
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
