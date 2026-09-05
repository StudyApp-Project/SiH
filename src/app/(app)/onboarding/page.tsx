import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import OnboardingWizard from './OnboardingWizard';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const t = await getTranslations('onboarding');

  // NOTE: In production we would check if the user already has a role
  // and redirect to /dashboard if onboarding is already complete

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm border-gray-200 bg-white">
        <div className="text-center mb-8">
           <h1 className="text-2xl font-bold text-slate-900 text-gray-900">
             {t('title')}
           </h1>
           <p className="mt-2 text-slate-600 text-gray-500">
             Let&apos;s build your official FRAC competency profile
           </p>
        </div>

        <OnboardingWizard
          userId={user.id}
          orgId={user.user_metadata?.organization_id || ''}
        />
      </div>
    </div>
  );
}
