import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import SignupForm from './SignupForm';
import { BarChart3, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SignupPage() {
  const t = await getTranslations('auth');

  return (
    <div className="flex-1 flex flex-col">
      {/* Institutional Header */}
      <header className="border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <a href="/auth/login" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 dark:bg-blue-600 text-white shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-slate-900 dark:text-zinc-100">
                  StatVidya
                </span>
                <span className="rounded-md bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:text-blue-300">
                  MoSPI • NSSTA
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 hidden sm:block">
                National Statistical Systems Training Academy
              </p>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Official Registration</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {t('signup')}
            </h1>
            <p className="text-sm text-slate-600 dark:text-zinc-400">
              Create your official StatVidya workforce competency profile
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
            <Suspense>
              <SignupForm />
            </Suspense>

            <p className="mt-5 text-center text-xs text-slate-600 dark:text-zinc-400 border-t border-slate-100 dark:border-zinc-800 pt-4">
              {t('hasAccount')}{' '}
              <a href="/auth/login" className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {t('login')}
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 text-center text-xs text-slate-500 dark:text-zinc-400">
        <p>Ministry of Statistics and Programme Implementation (MoSPI) • National Statistical Systems Training Academy (NSSTA)</p>
      </footer>
    </div>
  );
}
