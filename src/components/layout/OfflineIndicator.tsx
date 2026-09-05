'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { getPendingCount } from '@/services/offlineService';

function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

function getOnlineServerSnapshot() {
  return true;
}

const emptySubscribe = () => () => {};

export function OfflineIndicator() {
  const t = useTranslations('offline');
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot, getOnlineServerSnapshot);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const syncPending = useCallback(async () => {
    return Promise.resolve();
  }, []);

  const refreshCount = useCallback(async () => {
    const count = await getPendingCount();
    setPendingCount(count);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const runInitialSync = async () => {
      await refreshCount();
    };
    runInitialSync();

    const handleOnline = async () => {
      const currentCount = await getPendingCount();
      if (currentCount > 0) {
        setIsSyncing(true);
        await syncPending();
        setIsSyncing(false);
        await refreshCount();
      }
    };

    window.addEventListener('online', handleOnline);
    const interval = setInterval(refreshCount, 30_000);

    return () => {
      window.removeEventListener('online', handleOnline);
      clearInterval(interval);
    };
  }, [mounted, refreshCount, syncPending]);

  if (!mounted || (isOnline && pendingCount === 0 && !isSyncing)) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="assertive"
      className="flex items-center gap-2 px-4 py-2 text-sm bg-[#f7f2eb] border-t border-[#eeeeee]"
    >
      {!isOnline && (
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4 text-amber-600" />
          <span className="text-amber-700 font-medium">{t('offline')}</span>
          {pendingCount > 0 && (
            <span className="text-amber-600">
              {' '}({pendingCount} {t('pending')})
            </span>
          )}
        </div>
      )}
      {isOnline && isSyncing && (
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
          <span className="text-blue-700">{t('syncing')}</span>
        </div>
      )}
      {isOnline && pendingCount === 0 && !isSyncing && (
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-emerald-600" />
          <span className="text-emerald-700">{t('synced')}</span>
        </div>
      )}
    </div>
  );
}
