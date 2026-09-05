import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const t = await getTranslations('dashboard');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
          {t('readinessIndex')}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
          Your current workforce readiness overview
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.231 9 11.623 5.176-1.392 9-5.531 9-11.623 0-1.316-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-zinc-400">{t('readinessIndex')}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-zinc-100">78%</p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
            <div className="h-full w-3/4 animate-pulse rounded-full bg-blue-600" />
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
            Based on 6 of 8 competencies assessed
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-zinc-400">{t('topGaps')}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-zinc-100">3</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
            High-severity gaps requiring immediate attention
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-zinc-400">{t('nextActions')}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-zinc-100">2</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
            Recommended courses available this week
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-50">{t('topGaps')}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
            Your highest-priority competency gaps based on role requirements
          </p>
          <div className="mt-4 space-y-4">
            {[
              { competency: 'Survey Sampling Design', current: 2, target: 4, severity: 'HIGH' },
              { competency: 'Household Listing Procedures', current: 3, target: 5, severity: 'MODERATE' },
              { competency: 'Data Scrutiny & Validation', current: 3, target: 5, severity: 'MODERATE' },
            ].map((gap, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-zinc-50">{gap.competency}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    L{gap.current} → L{gap.target}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  gap.severity === 'HIGH'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                }`}>
                  {gap.severity === 'HIGH' ? t('highSeverity') : t('moderateSeverity')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-50">{t('nextActions')}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
            Recommended courses to close your competency gaps
          </p>
          <div className="mt-4 space-y-4">
            {[
              { title: 'NSSO Survey Sampling Techniques', provider: 'iGOT Karmayogi', duration: '4 hours', priority: 'high' },
              { title: 'Field Data Collection Best Practices', provider: 'iGOT Karmayogi', duration: '3 hours', priority: 'medium' },
            ].map((course, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-zinc-50">{course.title}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">{course.provider} • {course.duration}</p>
                </div>
                <a
                  href="#"
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    course.priority === 'high'
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
                  }`}
                >
                  View Course
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
