'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCallback } from 'react';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLanguageChange = useCallback(
    (lang: 'en' | 'hi') => {
      if (typeof document !== 'undefined') {
        document.cookie = `locale=${lang};path=/;max-age=31536000`;
      }
      router.replace(pathname, { scroll: false });
    },
    [router, pathname]
  );

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white border border-[#eeeeee] rounded-lg shadow-md px-2 py-1 z-50">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          currentLocale === 'en'
            ? 'bg-[#8b9a6e] text-white'
            : 'text-stone-600 hover:bg-[#f7f2eb]'
        }`}
        aria-pressed={currentLocale === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('hi')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          currentLocale === 'hi'
            ? 'bg-[#8b9a6e] text-white'
            : 'text-stone-600 hover:bg-[#f7f2eb]'
        }`}
        aria-pressed={currentLocale === 'hi'}
      >
        HI
      </button>
      <Globe className="h-3.5 w-3.5 text-stone-400" />
    </div>
  );
}
