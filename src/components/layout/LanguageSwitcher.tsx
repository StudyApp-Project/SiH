'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCallback } from 'react';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = useCallback(
    (lang: 'en' | 'hi') => {
      document.cookie = `locale=${lang};path=/;max-age=31536000`;
      router.replace(pathname, { scroll: false });
    },
    [router, pathname]
  );

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-lg px-2 py-1">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          document.documentElement.lang === 'en'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-700'
        }`}
        aria-pressed={document.documentElement.lang === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('hi')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          document.documentElement.lang === 'hi'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-700'
        }`}
        aria-pressed={document.documentElement.lang === 'hi'}
      >
        HI
      </button>
      <Globe className="h-3.5 w-3.5 text-slate-400" />
    </div>
  );
}
