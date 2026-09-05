import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import SignupForm from './SignupForm';

export const dynamic = 'force-dynamic';

export default async function SignupPage() {
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white shadow-sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m16 0h3m-3-3v3m-6-6h.01M13 16h2m-2-2h.01M16 13.5v3M8 13.5v3M11.5 18h.01M16.5 18h.01M7.5 18h.05M12 18h.05M16.5 13.5H16.51M12 13.5H12.01" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg">StatVidya</span>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                  MoSPI • NSSTA
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">{t('signup')}</h1>
            <p className="mt-2 text-sm text-slate-600">Create your StatVidya account</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <Suspense>
              <SignupForm />
            </Suspense>

            <p className="mt-4 text-center text-sm text-slate-600">
              {t('hasAccount')}{' '}
              <a href="/auth/login" className="font-medium text-blue-700 hover:text-blue-800">
                {t('login')}
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
