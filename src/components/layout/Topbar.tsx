'use client';

import { useTranslations } from 'next-intl';
import { Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TopbarProps {
  t: (key: string) => string;
}

export function Topbar({ t }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-zinc-50">
          {t('dashboard')}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative flex items-center gap-2 rounded-lg hover:bg-slate-100 px-2 py-1.5 text-slate-600 transition-colors dark:hover:bg-zinc-800">
          <Bell className="h-5 w-5" />
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-lg hover:bg-slate-100 px-2 py-1.5 text-slate-600 transition-colors dark:hover:bg-zinc-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-zinc-50 hidden sm:inline">
              Amit Sharma
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-zinc-50">Amit Sharma</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">amit.sharma@mospi.gov.in</p>
              </div>
              <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:hover:bg-zinc-700">
                <User className="h-4 w-4" />
                Profile
              </button>
              <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:hover:bg-zinc-700">
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-zinc-700" />
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  {t('logout')}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
