import QRCode from 'qrcode';
import type { ShareData, CreatorConfig, CalendarEvent } from '@/types';
import { saveShare } from './idb';
import { generateId } from './idb';

export async function generateShareLink(
  config: CreatorConfig,
  events: CalendarEvent[],
  username?: string
): Promise<{ hash: string; url: string; qrCodeDataUrl: string }> {
  const shareData: ShareData = {
    version: 1,
    config: sanitizeConfigForShare(config),
    events: sanitizeEventsForShare(events),
    exportedAt: new Date().toISOString(),
    exportedBy: username || 'anonymous',
  };

  const hash = generateShareHash();
  shareData.config.username = username;

  await saveShare({ ...shareData, hash });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const url = `${baseUrl}/shared?hash=${hash}`;

  const qrCodeDataUrl = await QRCode.toDataURL(url, {
    width: 256,
    margin: 2,
    color: {
      dark: '#3A7BC8',
      light: '#00000000',
    },
    errorCorrectionLevel: 'M',
  });

  return { hash, url, qrCodeDataUrl };
}

function generateShareHash(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let hash = '';
  for (let i = 0; i < 12; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

function sanitizeConfigForShare(config: CreatorConfig): CreatorConfig {
  return {
    activeDays: config.activeDays,
    streamingWindow: config.streamingWindow,
    timezone: config.timezone,
    username: config.username,
    theme: config.theme,
  };
}

function sanitizeEventsForShare(events: CalendarEvent[]): CalendarEvent[] {
  return events.map(event => ({
    ...event,
    notes: event.notes || undefined,
  }));
}

export async function getShareData(hash: string): Promise<ShareData | null> {
  const { getShare } = await import('./idb');
  return getShare(hash);
}

export function parseShareHashFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  const hashFromQuery = urlParams.get('hash');
  if (hashFromQuery) return hashFromQuery;

  const hashFromFragment = window.location.hash.slice(1);
  if (hashFromFragment) return hashFromFragment;

  return null;
}

export function isSharedView(): boolean {
  return parseShareHashFromUrl() !== null;
}

export function getShareUrl(hash: string): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/shared?hash=${hash}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export async function downloadICS(
  events: CalendarEvent[],
  config: CreatorConfig,
  username?: string
): Promise<void> {
  const icsContent = generateICSContent(events, config, username);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `calendario-${username || 'creator'}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateICSContent(
  events: CalendarEvent[],
  config: CreatorConfig,
  username?: string
): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Creator Calendar Pro//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Calendario de ${username || 'Creador'}`,
    'X-WR-TIMEZONE:' + config.timezone,
  ];

  for (const event of events) {
    const start = new Date(event.start);
    const end = new Date(event.end);

    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.id}@creator-calendar.pro`,
      `DTSTAMP:${formatICSDate(new Date(event.createdAt))}`,
      `DTSTART:${formatICSDate(start)}`,
      `DTEND:${formatICSDate(end)}`,
      `SUMMARY:${escapeICSText(event.title)}`,
      `DESCRIPTION:${escapeICSText(
        `${event.gameName} - ${event.type}\n${event.notes || ''}\n\nPlataformas: ${event.platforms.join(', ')}\n\nGenerado con Creator Calendar Pro`
      )}`,
      `LOCATION:${escapeICSText(event.platforms.join(', '))}`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

export function exportToJSON(
  config: CreatorConfig,
  events: CalendarEvent[],
  username?: string
): void {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    exportedBy: username,
    config: sanitizeConfigForShare(config),
    events: sanitizeEventsForShare(events),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `calendario-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importFromJSON(file: File): Promise<{ config: CreatorConfig; events: CalendarEvent[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.config || !data.events) {
          throw new Error('Formato de archivo inválido');
        }
        resolve({ config: data.config, events: data.events });
      } catch (err) {
        reject(new Error('Error al leer el archivo JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}