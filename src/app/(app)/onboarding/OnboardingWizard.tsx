'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function OnboardingWizard({ userId, orgId }: { userId: string; orgId: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cadre: '',
    roleId: '',
    designation: '',
    department: '',
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    // Simulated saving delay
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
      router.refresh();
    }, 1200);
  };

  const cadres = [
    { id: 'ISS', name: t('cadres.iss') },
    { id: 'SSS', name: t('cadres.sss') },
    { id: 'FOD', name: t('cadres.nssoFOD') },
    { id: 'NSSTA', name: t('cadres.nsstaFaculty') },
  ];

  const rolesByCadre: Record<string, {id: string, name: string}[]> = {
    'ISS': [
      { id: 'role-director', name: t('roles.deputyDirector') }, // Using deputy director translation as generic example
    ],
    'SSS': [
      { id: 'role-sso', name: t('roles.statisticalOfficer') },
      { id: 'role-jso', name: t('roles.statisticalOfficer') },
    ],
    'FOD': [
      { id: 'role-field-investigator', name: t('roles.fieldInvestigator') },
    ],
    'NSSTA': [
      { id: 'role-nssta-faculty', name: t('roles.trainer') },
    ]
  };

  return (
    <div className="mt-8">
      {/* Progress Bar */}
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex flex-col items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
              step === s
                ? 'bg-blue-700 text-white dark:bg-blue-600'
                : step > s
                ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                : 'bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500'
            }`}>
              {step > s ? '✓' : s}
            </div>
          </div>
        ))}
      </div>

      <div className="min-h-[300px]">
        {/* Step 1: Cadre Selection */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-100 mb-6">
              {t('onboarding.step1.subtitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cadres.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setFormData({ ...formData, cadre: c.id, roleId: '' }); handleNext(); }}
                  className={`p-6 rounded-xl border text-left transition-all ${
                    formData.cadre === c.id
                      ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-zinc-100">{c.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Role Selection */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-100 mb-6">
              {t('onboarding.step3.subtitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rolesByCadre[formData.cadre]?.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { setFormData({ ...formData, roleId: r.id }); handleNext(); }}
                  className={`p-6 rounded-xl border text-left transition-all ${
                    formData.roleId === r.id
                      ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-zinc-100">{r.name}</div>
                </button>
              ))}
            </div>
            {formData.cadre === 'FOD' && (
              <div className="mt-6 p-4 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-sm flex items-start gap-3">
                <span className="text-lg">ℹ️</span>
                <p>{t('onboarding.languageNote')}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Official Details */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 max-w-md mx-auto py-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-100 mb-2">
              {t('onboarding.step2.subtitle')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  {t('onboarding.department')}
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="e.g. NSSO"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  {t('onboarding.designation')}
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="e.g. Field Investigator (Grade II)"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 mt-4"
            >
              {t('common.next')}
            </button>
          </div>
        )}

        {/* Step 4: Self-Assessment */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-100 mb-2">
                {t('onboarding.step4.title')}
              </h2>
              <p className="text-slate-500 dark:text-zinc-400">
                {t('onboarding.step4.subtitle')}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 text-center space-y-4 my-8">
              <div className="text-4xl text-slate-400 mb-4">📋</div>
              <p className="text-slate-600 dark:text-zinc-300">
                Self-assessment placeholder. In production, this renders dynamic FRAC L1-L5 sliders for: <br/>
                <span className="font-semibold text-slate-900 dark:text-zinc-100 mt-2 block">
                  {rolesByCadre[formData.cadre]?.find(r => r.id === formData.roleId)?.name || 'your role'}
                </span>
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {t('common.loading')}
                </>
              ) : (
                t('common.submit')
              )}
            </button>
          </div>
        )}
      </div>

      {/* Back button logic */}
      <div className="mt-8 flex items-center h-10">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center gap-2"
          >
            ← {t('onboarding.back')}
          </button>
        )}
      </div>
    </div>
  );
}
