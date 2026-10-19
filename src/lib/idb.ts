import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { CalendarEvent, CreatorConfig, ShareData } from '@/types';

interface CalendarDB extends DBSchema {
  events: {
    key: string;
    value: CalendarEvent;
    indexes: { 'by-date': string; 'by-game': string };
  };
  config: {
    key: string;
    value: CreatorConfig;
  };
  shares: {
    key: string;
    value: ShareData;
    indexes: { 'by-hash': string };
  };
  cache: {
    key: string;
    value: { data: unknown; timestamp: number };
    indexes: { 'by-expiry': number };
  };
}

let dbInstance: IDBPDatabase<CalendarDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<CalendarDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<CalendarDB>('creator-calendar-db', 1, {
    upgrade(db) {
      const eventStore = db.createObjectStore('events', { keyPath: 'id' });
      eventStore.createIndex('by-date', 'start');
      eventStore.createIndex('by-game', 'gameId');

      db.createObjectStore('config', { keyPath: 'id' });

      const shareStore = db.createObjectStore('shares', { keyPath: 'hash' });
      shareStore.createIndex('by-hash', 'hash');

      const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
      cacheStore.createIndex('by-expiry', 'timestamp');
    },
  });

  return dbInstance;
}

export async function getAllEvents(): Promise<CalendarEvent[]> {
  const db = await getDB();
  return db.getAll('events');
}

export async function getEventsByDateRange(start: string, end: string): Promise<CalendarEvent[]> {
  const db = await getDB();
  const allEvents = await db.getAllFromIndex('events', 'by-date', IDBKeyRange.bound(start, end));
  return allEvents;
}

export async function getEvent(id: string): Promise<CalendarEvent | undefined> {
  const db = await getDB();
  return db.get('events', id);
}

export async function saveEvent(event: CalendarEvent): Promise<void> {
  const db = await getDB();
  await db.put('events', { ...event, updatedAt: new Date().toISOString() });
}

export async function deleteEvent(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('events', id);
}

export async function getConfig(): Promise<CreatorConfig | undefined> {
  const db = await getDB();
  return db.get('config', 'main');
}

export async function saveConfig(config: CreatorConfig): Promise<void> {
  const db = await getDB();
  await db.put('config', { id: 'main', ...config });
}

export async function getShare(hash: string): Promise<ShareData | undefined> {
  const db = await getDB();
  return db.get('shares', hash);
}

export async function saveShare(share: ShareData): Promise<void> {
  const db = await getDB();
  await db.put('shares', share);
}

export async function getCache<T>(key: string, maxAgeMs = 3600000): Promise<T | null> {
  const db = await getDB();
  const entry = await db.get('cache', key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > maxAgeMs) {
    await db.delete('cache', key);
    return null;
  }
  return entry.data as T;
}

export async function setCache(key: string, data: unknown): Promise<void> {
  const db = await getDB();
  await db.put('cache', { key, data, timestamp: Date.now() });
}

export async function clearOldCache(maxAgeMs = 86400000): Promise<void> {
  const db = await getDB();
  const cutoff = Date.now() - maxAgeMs;
  const tx = db.transaction('cache', 'readwrite');
  const index = tx.store.index('by-expiry');
  let cursor = await index.openCursor(IDBKeyRange.upperBound(cutoff));
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}