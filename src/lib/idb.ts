import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
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
    value: { key: string; data: unknown; timestamp: number };
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
  await db.put('config', { ...config, id: 'main' });
}

export async function getShare(hash: string): Promise<ShareData | null> {
  const db = await getDB();
  const result = await db.get('shares', hash);
  return result ?? null;
}

export async function saveShare(share: ShareData): Promise<void> {
  const db = await getDB();
  await db.put('shares', share);
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await db.clear('events');
  await db.clear('config');
  await db.clear('shares');
  await db.clear('cache');
}