export type Platform = 'twitch' | 'youtube' | 'kick' | 'tiktok' | 'trovo' | 'discord';

export type EventType = 'stream' | 'video' | 'event' | 'collab';

export interface CreatorConfig {
  activeDays: number[];           // 0=Dom, 1=Lun, ..., 6=Sáb
  streamingWindow: {
    start: string;                // "HH:mm" formato 24h
    end: string;                  // "HH:mm" formato 24h (puede ser día siguiente)
  };
  steamGridDbKey?: string;        // Encriptada en localStorage
  timezone: string;               // IANA timezone
  username?: string;              // Para links compartidos
  theme?: 'oled';                 // Futuro: temas
  id?: string;                    // Para almacenamiento en IndexedDB
}

export interface CalendarEvent {
  id: string;
  gameId: string;                 // SteamGridDB ID o slug local
  gameName: string;
  gameCover: string;              // URL CDN SteamGridDB (600x900 grid)
  gameHero?: string;              // URL banner hero (920x430) opcional
  type: EventType;
  title: string;
  start: string;                  // ISO 8601 completo con timezone
  end: string;                    // ISO 8601 completo con timezone
  platforms: Platform[];
  notes?: string;
  color: string;                  // Hash del gameName -> variante azul
  createdAt: string;              // ISO 8601
  updatedAt: string;              // ISO 8601
  isRecurring?: boolean;
  recurrenceRule?: RecurrenceRule;
}

export interface RecurrenceRule {
  frequency: 'weekly' | 'biweekly' | 'monthly';
  interval: number;
  daysOfWeek?: number[];          // Para weekly
  dayOfMonth?: number;            // Para monthly
  endDate?: string;               // ISO 8601
  occurrences?: number;
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
  type: 'grid' | 'hero' | 'logo' | 'icon';
  mime: string;
  size: number;
  hash: string;
}

export interface SteamGridDBSearchResponse {
  success: boolean;
  data: SteamGridDBGame[];
}

export interface SteamGridDBImagesResponse {
  success: boolean;
  data: SteamGridDBImage[];
}

export interface ShareData {
  version: number;
  config: CreatorConfig;
  events: CalendarEvent[];
  exportedAt: string;
  exportedBy: string;
  hash: string;
}

export interface ExportImageOptions {
  format: 'png' | 'jpeg';
  quality: number;
  width: number;
  height: number;
  includeWatermark: boolean;
  watermarkText: string;
}

export type ViewMode = 'editor' | 'shared' | 'kiosk';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: 'event' | 'game-search' | 'share' | 'settings' | 'export' | null;
  data?: unknown;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAY_NAMES_SHORT: Record<DayOfWeek, string> = {
  0: 'DOM',
  1: 'LUN',
  2: 'MAR',
  3: 'MIÉ',
  4: 'JUE',
  5: 'SÁB',
  6: 'VIE',
};

export const DAY_NAMES_LONG: Record<DayOfWeek, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Sábado',
  6: 'Viernes',
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  stream: 'Stream',
  video: 'Video',
  event: 'Evento',
  collab: 'Colab',
};

export const EVENT_TYPE_BADGES: Record<EventType, string> = {
  stream: 'badge-stream',
  video: 'badge-video',
  event: 'badge-event',
  collab: 'badge-collab',
};

export const PLATFORM_ICONS: Record<Platform, string> = {
  twitch: 'twitch',
  youtube: 'youtube',
  kick: 'kick',
  tiktok: 'tiktok',
  trovo: 'trovo',
  discord: 'discord',
};

export const DEFAULT_CONFIG: CreatorConfig = {
  activeDays: [1, 2, 5, 0], // Lun, Mar, Sáb, Dom
  streamingWindow: {
    start: '18:00',
    end: '02:00',
  },
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export const STREAMING_WINDOW_PRESETS = [
  { label: 'Tarde/Noche (18:00-02:00)', start: '18:00', end: '02:00' },
  { label: 'Noche (20:00-04:00)', start: '20:00', end: '04:00' },
  { label: 'Mañana/Tarde (10:00-18:00)', start: '10:00', end: '18:00' },
  { label: '24h (00:00-23:59)', start: '00:00', end: '23:59' },
  { label: 'Personalizado', start: '', end: '' },
];