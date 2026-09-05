import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
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
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">{t('demoPersona')}</h1>
            <p className="mt-2 text-sm text-slate-600">{t('demoSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {t('login')}
              </h2>
              <Suspense>
                <LoginForm />
              </Suspense>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-700">{t('demoPersona')}</p>
              <DemoPersonaCard
                icon="building"
                name="Amit Sharma"
                role="Junior Statistical Officer (SSS)"
                dept="MoSPI Headquarters"
                email="amit.sharma@mospi.gov.in"
                lang="en"
                t={t}
              />
              <DemoPersonaCard
                icon="search"
                name="Sunita Devi"
                role="Field Investigator (NSSO FOD)"
                dept="NSSO Field Operations Division"
                email="sunita.devi@nssO.gov.in"
                lang="hi"
                t={t}
              />
              <DemoPersonaCard
                icon="graduation-cap"
                name="Dr. Priya Verma"
                role="NSSTA Faculty (Trainer)"
                dept="NSSTA"
                email="priya.verma@nssta.gov.in"
                lang="en"
                t={t}
              />
              <DemoPersonaCard
                icon="bar-chart"
                name="Rajesh Kumar"
                role="Additional Director General (Admin)"
                dept="MoSPI"
                email="rajesh.kumar@mospi.gov.in"
                lang="en"
                t={t}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DemoPersonaCard({
  icon,
  name,
  role,
  dept,
  email,
  lang,
  t,
}: {
  icon: string;
  name: string;
  role: string;
  dept: string;
  email: string;
  lang: 'en' | 'hi';
  t: (key: string) => string;
}) {
  return (
    <button
      type="button"
      onClick={() => selectDemoPersona(email, lang)}
      className="w-full flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-colors text-left"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        {icon === 'building' && (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-18v18" />
          </svg>
        )}
        {icon === 'search' && (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        )}
        {icon === 'graduation-cap' && (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.5 3.5-6.5 3.5" />
          </svg>
        )}
        {icon === 'bar-chart' && (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 13.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-6.75zM16.5 13.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-6.75z" />
          </svg>
        )}
      </div>
      <div>
        <p className="font-semibold text-slate-900">{name}</p>
        <p className="text-sm text-slate-600">{role}</p>
        <p className="text-xs text-slate-500 mt-0.5">{dept}</p>
        <p className="text-xs text-slate-400 mt-1 font-mono">{email}</p>
      </div>
    </button>
  );
}

function selectDemoPersona(email: string, lang: 'en' | 'hi') {
  window.location.href = `/api/sso/demo-persona?email=${encodeURIComponent(email)}&lang=${lang}`;
}
