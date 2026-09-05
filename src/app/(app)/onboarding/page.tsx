import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const t = await getTranslations('onboarding');

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
          {t('title')}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-400">
          {t('step1.title')} — {t('step1.subtitle')}
        </p>

        <div className="mt-6 flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                step === 1
                  ? 'bg-blue-700 text-white'
                  : step < 4
                  ? 'bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-zinc-400'
                  : 'bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500'
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-slate-500 dark:text-zinc-400 text-center">
          Onboarding flow coming soon. Please continue to Dashboard.
        </p>

        <div className="mt-6 flex justify-center">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
