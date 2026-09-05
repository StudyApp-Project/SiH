'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { RadarChart, type RadarDataPoint } from '@/components/RadarChart';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { ProgressRing } from '@/components/ProgressRing';

interface CompetencyRecord {
  competencyId: string;
  competencyName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  evidenceType: 'assessment-verified' | 'self-assessed';
  lastUpdated: string;
}

interface CompetencyHistoryEntry {
  date: string;
  level: number;
  source: 'self-assessment' | 'course-completion' | 'assessment-score';
}

interface ProfileData {
  name: string;
  email: string;
  designation: string;
  cadre: string;
  department: string;
  organization: string;
  role: string;
  karmaPoints: number;
  aparMilestone: string;
  readinessIndex: number;
  joinedDate: string;
  assessmentsCompleted: number;
  coursesCompleted: number;
  competencyRecords: CompetencyRecord[];
  competencyHistory: Record<string, CompetencyHistoryEntry[]>;
}

function getDemoProfileData(): ProfileData {
  return {
    name: 'Sunita Devi',
    email: 'sunita.devi@mospi.gov.in',
    designation: 'Field Investigator (Grade II)',
    cadre: 'FOD - NSSO',
    department: 'Field Operations Division',
    organization: 'MoSPI Demo Organization',
    role: 'Field Investigator',
    karmaPoints: 1275,
    aparMilestone: '2025-2026: Exceeded Expectations',
    readinessIndex: 67,
    joinedDate: '2023-06-15',
    assessmentsCompleted: 8,
    coursesCompleted: 4,
    competencyRecords: [
      {
        competencyId: 'comp-capi',
        competencyName: 'CAPI Tablet Operation',
        category: 'Domain',
        currentLevel: 3,
        targetLevel: 4,
        evidenceType: 'assessment-verified',
        lastUpdated: '2025-08-10',
      },
      {
        competencyId: 'comp-nsso',
        competencyName: 'NSSO Protocol Mastery',
        category: 'Domain',
        currentLevel: 3,
        targetLevel: 3,
        evidenceType: 'assessment-verified',
        lastUpdated: '2025-07-22',
      },
      {
        competencyId: 'comp-survey',
        competencyName: 'Survey Sampling & Design',
        category: 'Functional',
        currentLevel: 2,
        targetLevel: 3,
        evidenceType: 'self-assessed',
        lastUpdated: '2025-06-01',
      },
      {
        competencyId: 'comp-data',
        competencyName: 'Data Entry & Scrutiny',
        category: 'Functional',
        currentLevel: 3,
        targetLevel: 3,
        evidenceType: 'assessment-verified',
        lastUpdated: '2025-08-05',
      },
      {
        competencyId: 'comp-teamwork',
        competencyName: 'Teamwork & Collaboration',
        category: 'Behavioural',
        currentLevel: 3,
        targetLevel: 2,
        evidenceType: 'self-assessed',
        lastUpdated: '2025-05-15',
      },
      {
        competencyId: 'comp-ethics',
        competencyName: 'Statistical Ethics & Integrity',
        category: 'Behavioural',
        currentLevel: 4,
        targetLevel: 2,
        evidenceType: 'assessment-verified',
        lastUpdated: '2025-07-01',
      },
    ],
    competencyHistory: {
      'comp-capi': [
        { date: '2025-08-10', level: 3, source: 'assessment-score' },
        { date: '2025-05-20', level: 2, source: 'assessment-score' },
        { date: '2025-02-15', level: 2, source: 'self-assessment' },
        { date: '2024-11-01', level: 1, source: 'self-assessment' },
      ],
      'comp-nsso': [
        { date: '2025-07-22', level: 3, source: 'assessment-score' },
        { date: '2025-04-10', level: 3, source: 'course-completion' },
        { date: '2025-01-05', level: 2, source: 'assessment-score' },
      ],
    },
  };
}

export default function ProfileClient() {
  const t = useTranslations();
  const [data] = useState<ProfileData>(getDemoProfileData);
  const [activeTab, setActiveTab] = useState<'overview' | 'competencies' | 'history'>('overview');

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 text-gray-500">Profile data unavailable</p>
      </div>
    );
  }

  // Build radar data from competency records
  const radarData: RadarDataPoint[] = data.competencyRecords.map((record) => ({
    label: record.competencyName.split(' ').slice(0, 2).join(' '),
    current: record.currentLevel,
    target: record.targetLevel,
  }));

  // Group competencies by category
  const byCategory = data.competencyRecords.reduce((acc, record) => {
    if (!acc[record.category]) acc[record.category] = [];
    acc[record.category].push(record);
    return acc;
  }, {} as Record<string, CompetencyRecord[]>);

  const categoryColors: Record<string, string> = {
    Behavioural: 'border-blue-300 border-blue-300 bg-blue-50 bg-blue-50',
    Functional: 'border-amber-300 border-amber-300 bg-amber-50 bg-amber-50/30',
    Domain: 'border-purple-300 border-purple-300 bg-purple-50 bg-purple-50',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 border-gray-200 bg-linear-to-br from-blue-50 to-indigo-50 from-blue-50 to-indigo-50 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {data.name.split(' ').map(n => n[0]).join('')}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 text-gray-900">
              {data.name}
            </h1>
            <p className="text-slate-600 text-gray-500 font-medium">
              {data.designation}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-500 text-gray-9000">
              <span>{data.department}</span>
              <span>•</span>
              <span>{data.cadre}</span>
              <span>•</span>
              <span>{data.organization}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700 text-blue-600 font-mono">
                {data.karmaPoints.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 text-gray-9000 mt-1">Karma Points</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-700 text-emerald-600">
                {data.assessmentsCompleted}
              </div>
              <p className="text-xs text-slate-500 text-gray-9000 mt-1">Assessments</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-700 text-amber-600">
                {data.coursesCompleted}
              </div>
              <p className="text-xs text-slate-500 text-gray-9000 mt-1">Courses</p>
            </div>
          </div>
        </div>

        {/* APAR Milestone */}
        <div className="mt-6 p-4 rounded-lg bg-white/60 bg-white/60 border border-slate-200 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 bg-emerald-100">
              <span className="text-xl">🏆</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 text-gray-700">{t('profile.aparMilestone')}</p>
              <p className="text-lg font-bold text-emerald-700 text-emerald-600">{data.aparMilestone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 border-gray-200">
        {(['overview', 'competencies', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-blue-700 text-blue-700 border-blue-300 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Readiness */}
          <div className="rounded-xl border border-slate-200 border-gray-200 bg-white bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 text-gray-900 mb-6">
              {t('dashboard.readinessIndex')}
            </h3>
            <div className="flex justify-center">
              <ProgressRing
                value={data.readinessIndex}
                size={160}
                label="Overall"
                sublabel={`${data.competencyRecords.filter(c => c.currentLevel >= c.targetLevel).length}/${data.competencyRecords.length} at target`}
              />
            </div>
          </div>

          {/* Radar */}
          <div className="rounded-xl border border-slate-200 border-gray-200 bg-white bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 text-gray-900 mb-6">
              {t('profile.competencyRadar')}
            </h3>
            <RadarChart data={radarData} size={280} showLegend />
          </div>
        </div>
      )}

      {activeTab === 'competencies' && (
        <div className="space-y-6">
          {Object.entries(byCategory).map(([category, records]) => (
            <div
              key={category}
              className={`rounded-xl border p-6 ${categoryColors[category] || ''}`}
            >
              <h3 className="text-lg font-semibold text-slate-900 text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-current opacity-60"></span>
                {category} Competencies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {records.map((record) => (
                  <div
                    key={record.competencyId}
                    className="bg-white bg-white/50 rounded-lg p-4 border border-slate-200 border-gray-200"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-medium text-slate-900 text-gray-900">
                          {record.competencyName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <ProvenanceBadge provenance="PROPOSED_FRAMEWORK" showLabel={false} size="sm" />
                          {record.evidenceType === 'assessment-verified' ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 bg-emerald-100 text-emerald-700 text-emerald-600">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 bg-blue-50 text-blue-700 text-blue-600">
                              Self-Assessed
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 text-gray-9000">
                        {record.lastUpdated}
                      </span>
                    </div>

                    {/* Level Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 text-gray-500">Current</span>
                        <span className="font-bold text-slate-900 text-gray-900">
                          L{record.currentLevel}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 bg-white rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            record.currentLevel >= record.targetLevel
                              ? 'bg-emerald-600 bg-emerald-600'
                              : record.currentLevel >= record.targetLevel - 1
                              ? 'bg-amber-500 bg-amber-500'
                              : 'bg-rose-500 bg-rose-500'
                          }`}
                          style={{ width: `${(record.currentLevel / 5) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 text-gray-9000">
                        <span>Target: L{record.targetLevel}</span>
                        {record.currentLevel >= record.targetLevel ? (
                          <span className="text-emerald-600 text-emerald-600 font-medium">✓ Met</span>
                        ) : (
                          <span className="text-rose-600 text-rose-600 font-medium">
                            {record.targetLevel - record.currentLevel} to go
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 border-gray-200 bg-white bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 text-gray-900 mb-6">
              {t('profile.growthHistory')}
            </h3>

            {Object.entries(data.competencyHistory).map(([competencyId, history]) => {
              const record = data.competencyRecords.find(r => r.competencyId === competencyId);
              if (!record) return null;

              return (
                <div key={competencyId} className="mb-8 last:mb-0">
                  <h4 className="font-medium text-slate-900 text-gray-900 mb-4">
                    {record.competencyName}
                  </h4>
                  <div className="relative pl-6 border-l-2 border-slate-200 border-gray-200 space-y-4">
                    {history.map((entry, idx) => (
                      <div key={idx} className="relative">
                        {/* Timeline dot */}
                        <div className={`absolute -left-6.25 w-4 h-4 rounded-full border-2 bg-white bg-white ${
                          entry.source === 'assessment-score'
                            ? 'border-blue-600 border-blue-300'
                            : entry.source === 'course-completion'
                            ? 'border-emerald-600 border-emerald-600'
                            : 'border-slate-400 border-gray-300'
                        }`} />

                        <div className="bg-slate-50 bg-white/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-900 text-gray-900">
                              Level {entry.level}
                            </span>
                            <span className="text-xs text-slate-500 text-gray-9000">
                              {new Date(entry.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={`px-2 py-0.5 rounded ${
                              entry.source === 'assessment-score'
                                ? 'bg-blue-100 bg-blue-50 text-blue-700 text-blue-600'
                                : entry.source === 'course-completion'
                                ? 'bg-emerald-100 bg-emerald-100 text-emerald-700 text-emerald-600'
                                : 'bg-slate-200 bg-white text-slate-600 text-gray-500'
                            }`}>
                              {entry.source === 'assessment-score' ? '📝 Assessment Score' :
                               entry.source === 'course-completion' ? '📚 Course Completion' :
                               '✍️ Self-Assessment'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Provenance Footer */}
      <div className="rounded-lg bg-slate-50 bg-white/50 border border-slate-200 border-gray-200 p-4 flex items-start gap-3">
        <span className="text-lg">ℹ️</span>
        <div className="text-xs text-slate-600 text-gray-500 space-y-1">
          <p>
            <strong>Demo Data:</strong> This profile displays synthetic data for demonstration purposes.
            In production, data is tied to real assessment results and competency records.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span>Provenance:</span>
            <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" showLabel={true} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
