import { openDB, type IDBPDatabase } from 'idb';

export const OFFLINE_DB_NAME = 'statvidya-offline';
export const OFFLINE_DB_VERSION = 3;
export const PENDING_ASSESSMENTS_STORE = 'pending_assessments';

export interface PendingAssessment {
  id?: number;
  local_id: string;
  assessment_id: string;
  user_id: string;
  answers: Record<string, unknown>;
  preliminary_score?: number;
  submitted_at: string;
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  retry_count: number;
  last_error?: string;
}

let dbPromise: Promise<IDBPDatabase | null> | null = null;

export async function getOfflineDB(): Promise<IDBPDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return null;
  }

  if (!dbPromise) {
    dbPromise = openDB(OFFLINE_DB_NAME, OFFLINE_DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(PENDING_ASSESSMENTS_STORE)) {
          const store = db.createObjectStore(PENDING_ASSESSMENTS_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('local_id', 'local_id', { unique: true });
          store.createIndex('status', 'status', { unique: false });
        }
      },
    }).catch((err) => {
      console.warn('[OfflineService] Failed to open IndexedDB:', err);
      dbPromise = null;
      return null;
    });
  }

  return dbPromise;
}

export async function getPendingCount(): Promise<number> {
  try {
    const db = await getOfflineDB();
    if (!db || !db.objectStoreNames.contains(PENDING_ASSESSMENTS_STORE)) {
      return 0;
    }
    return await db.count(PENDING_ASSESSMENTS_STORE);
  } catch (err) {
    console.warn('[OfflineService] Failed to count pending assessments:', err);
    return 0;
  }
}

export async function getPendingAssessments(): Promise<PendingAssessment[]> {
  try {
    const db = await getOfflineDB();
    if (!db || !db.objectStoreNames.contains(PENDING_ASSESSMENTS_STORE)) {
      return [];
    }
    return await db.getAll(PENDING_ASSESSMENTS_STORE);
  } catch (err) {
    console.warn('[OfflineService] Failed to retrieve pending assessments:', err);
    return [];
  }
}

export async function enqueuePendingAssessment(
  assessment: Omit<PendingAssessment, 'id' | 'status' | 'retry_count' | 'submitted_at'>
): Promise<number | null> {
  try {
    const db = await getOfflineDB();
    if (!db || !db.objectStoreNames.contains(PENDING_ASSESSMENTS_STORE)) {
      return null;
    }
    const record: PendingAssessment = {
      ...assessment,
      status: 'PENDING',
      retry_count: 0,
      submitted_at: new Date().toISOString(),
    };
    return (await db.add(PENDING_ASSESSMENTS_STORE, record)) as number;
  } catch (err) {
    console.warn('[OfflineService] Failed to enqueue assessment:', err);
    return null;
  }
}

export async function removePendingAssessment(id: number): Promise<boolean> {
  try {
    const db = await getOfflineDB();
    if (!db || !db.objectStoreNames.contains(PENDING_ASSESSMENTS_STORE)) {
      return false;
    }
    await db.delete(PENDING_ASSESSMENTS_STORE, id);
    return true;
  } catch (err) {
    console.warn('[OfflineService] Failed to remove pending assessment:', err);
    return false;
  }
}

export async function clearPendingAssessments(): Promise<void> {
  try {
    const db = await getOfflineDB();
    if (!db || !db.objectStoreNames.contains(PENDING_ASSESSMENTS_STORE)) {
      return;
    }
    await db.clear(PENDING_ASSESSMENTS_STORE);
  } catch (err) {
    console.warn('[OfflineService] Failed to clear pending assessments:', err);
  }
}
