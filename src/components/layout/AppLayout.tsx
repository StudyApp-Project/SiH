'use client';

import { useTranslations } from 'next-intl';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Breadcrumb } from './Breadcrumb';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const t = useTranslations('nav');

  return (
    <div className="flex h-full">
      <Sidebar t={t} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar t={t} />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <Breadcrumb />
            <div className="mt-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
