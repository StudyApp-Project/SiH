'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { WifiOff, Wifi, RefreshCw, Check } from 'lucide-react';

export function OfflineIndicator() {
  const t = useTranslations('offline');
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const loadPendingCount = useCallback(async () => {
    return new Promise<number>((resolve) => {
      try {
        const openReq = indexedDB.open('statvidya-offline', 1);
        openReq.onsuccess = () => {
          const db = openReq.result;
          if (!db) { resolve(0); return; }
          const txn = db.transaction('pending_assessments', 'readonly');
          const store = txn.objectStore('pending_assessments');
          const countReq = store.count();
          countReq.onsuccess = () => resolve(countReq.result);
          countReq.onerror = () => resolve(0);
          txn.oncomplete = () => {};
          txn.onerror = () => resolve(0);
        };
        openReq.onerror = () => resolve(0);
      } catch {
        resolve(0);
      }
    });
  }, []);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      if (pendingCount > 0) {
        setIsSyncing(true);
        await syncPending();
        setIsSyncing(false);
        setPendingCount(0);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    loadPendingCount().then(setPendingCount);

    const interval = setInterval(() => {
      loadPendingCount().then(setPendingCount);
    }, 30_000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [pendingCount, loadPendingCount]);

  const syncPending = async () => {
    return Promise.resolve();
  };

  if (isOnline && pendingCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="assertive"
      className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 border-t border-slate-200 dark:bg-zinc-800 dark:border-zinc-700"
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
