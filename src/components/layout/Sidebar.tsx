'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  LayoutDashboard,
  Target,
  Flag,
  UserCircle,
  FileText,
  ClipboardList,
  Brain,
  ClipboardCheck,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
  { href: '/skill-gap', icon: Target, label: 'nav.skillGap' },
  { href: '/pathways', icon: Flag, label: 'nav.pathways' },
  { href: '/profile', icon: UserCircle, label: 'nav.profile' },
];

const trainerItems = [
  { href: '/documents', icon: FileText, label: 'nav.documents' },
  { href: '/mcq-generator', icon: Brain, label: 'nav.mcqGenerator' },
  { href: '/review-queue', icon: ClipboardCheck, label: 'nav.reviewQueue' },
];

const adminItems = [
  { href: '/admin/analytics', icon: BarChart3, label: 'nav.adminAnalytics' },
];

interface SidebarProps {
  t: (key: string) => string;
}

export function Sidebar({ t }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="flex h-14 items-center border-b border-slate-200 px-4 dark:border-zinc-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white shadow-sm">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">StatVidya</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white shadow-sm">
            <Building2 className="h-4 w-4" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="mb-2">
          <p className={`text-[10px] font-semibold uppercase tracking-wider text-slate-400 pb-1 ${collapsed ? 'text-center' : ''}`}>
            Main
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center px-0' : ''
                } ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{t(item.label)}</span>}
              </Link>
            );
          })}
        </div>

        <div className="mb-2">
          <p className={`text-[10px] font-semibold uppercase tracking-wider text-slate-400 pb-1 ${collapsed ? 'text-center' : ''}`}>
            Content
          </p>
          {trainerItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center px-0' : ''
                } ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{t(item.label)}</span>}
              </Link>
            );
          })}
        </div>

        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-wider text-slate-400 pb-1 ${collapsed ? 'text-center' : ''}`}>
            Administration
          </p>
          {adminItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center px-0' : ''
                } ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{t(item.label)}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-200 p-2 dark:border-zinc-800">
        <Link
          href="/"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <ClipboardList className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>{t('nav.logout')}</span>}
        </Link>
      </div>
    </aside>
  );
}
