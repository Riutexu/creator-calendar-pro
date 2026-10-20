export type Platform = 'twitch' | 'youtube' | 'kick' | 'tiktok' | 'trovo' | 'discord';
export type EventType = 'stream' | 'video' | 'event' | 'collab';
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CreatorConfig {
  activeDays: number[];
  streamingWindow: { start: string; end: string };
  timezone: string;
  username: string;
  steamGridDbKey?: string;
  id?: string;
}

export interface ExportImageOptions {
  format: 'png' | 'jpeg';
  quality: number;
  width: number;
  height: number;
  includeWatermark: boolean;
  watermarkText: string;
}

export interface CalendarEvent {
  id: string;
  gameId: string;
  gameName: string;
  gameCover: string;
  gameHero?: string;
  type: EventType;
  title: string;
  start: string;
  end: string;
  platforms: Platform[];
  notes?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface SteamGridDBGame {
  id: number;
  name: string;
  steamId?: number;
  types: string[];
}

export interface SteamGridDBImage {
  id: number;
  url: string;
  width: number;
  height: number;
  type: string;
  mime: string;
  size: number;
  hash: string;
}

export interface ShareData {
  version: number;
  config: CreatorConfig;
  events: CalendarEvent[];
  exportedAt: string;
  exportedBy: string;
  hash: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export const DAY_NAMES_SHORT: Record<DayOfWeek, string> = {
  0: 'DOM', 1: 'LUN', 2: 'MAR', 3: 'MIÉ', 4: 'JUE', 5: 'SÁB', 6: 'VIE',
};
export const DAY_NAMES_LONG: Record<DayOfWeek, string> = {
  0: 'Domingo', 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Sábado', 6: 'Viernes',
};
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  stream: 'Stream', video: 'Video', event: 'Evento', collab: 'Colab',
};
export const EVENT_TYPE_BADGES: Record<EventType, string> = {
  stream: 'badge-stream', video: 'badge-video', event: 'badge-event', collab: 'badge-collab',
};
export const PLATFORM_ICONS: Record<Platform, string> = {
  twitch: 'twitch', youtube: 'youtube', kick: 'kick', tiktok: 'tiktok', trovo: 'trovo', discord: 'discord',
};
export const DEFAULT_CONFIG: CreatorConfig = {
  activeDays: [1, 2, 5, 0],
  streamingWindow: { start: '18:00', end: '02:00' },
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  username: '',
};