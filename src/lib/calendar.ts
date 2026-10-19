import { format as formatDate, parseISO, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfDay, endOfDay, isWithinInterval, setHours, setMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import type { CalendarEvent, CreatorConfig, DayOfWeek } from '@/types';
import { DEFAULT_CONFIG, DAY_NAMES_SHORT, DAY_NAMES_LONG } from '@/types';

export function getWeekRange(date: Date = new Date(), config: CreatorConfig): { start: Date; end: Date } {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  return { start: weekStart, end: weekEnd };
}

export function getWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function formatWeekLabel(date: Date = new Date(), config: CreatorConfig): string {
  const { start, end } = getWeekRange(date, config);
  const weekNum = getWeekNumber(date);
  return `Semana ${weekNum} (${formatDate(start, 'd MMM', { locale: es })} - ${formatDate(end, 'd MMM', { locale: es })})`;
}

export function generateTimeSlots(config: CreatorConfig): string[] {
  const slots: string[] = [];
  const [startH, startM] = config.streamingWindow.start.split(':').map(Number);
  const [endH, endM] = config.streamingWindow.end.split(':').map(Number);

  let current = setMinutes(setHours(new Date(), startH), startM);
  const endTime = setMinutes(setHours(new Date(), endH), endM);

  if (endTime <= current) {
    endTime.setDate(endTime.getDate() + 1);
  }

  while (current < endTime) {
    slots.push(formatDate(current, 'HH:mm'));
    current = addMinutes(current, 60);
  }

  return slots;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function getEventsForWeek(events: CalendarEvent[], weekStart: Date, weekEnd: Date, config: CreatorConfig): Map<string, CalendarEvent[]> {
  const eventsBySlot = new Map<string, CalendarEvent[]>();

  const weekStartISO = startOfDay(weekStart).toISOString();
  const weekEndISO = endOfDay(weekEnd).toISOString();

  for (const event of events) {
    const eventStart = parseISO(event.start);
    const eventEnd = parseISO(event.end);

    if (isWithinInterval(eventStart, { start: weekStartISO, end: weekEndISO }) ||
        isWithinInterval(eventEnd, { start: weekStartISO, end: weekEndISO }) ||
        (eventStart <= weekStartISO && eventEnd >= weekEndISO)) {
      const dayKey = formatDate(eventStart, 'yyyy-MM-dd');
      const timeKey = formatDate(eventStart, 'HH:mm');
      const key = `${dayKey}-${timeKey}`;

      if (!eventsBySlot.has(key)) {
        eventsBySlot.set(key, []);
      }
      eventsBySlot.get(key)!.push(event);
    }
  }

  return eventsBySlot;
}

export function getEventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  return events.filter(event => {
    const eventStart = parseISO(event.start);
    const eventEnd = parseISO(event.end);
    return isWithinInterval(eventStart, { start: dayStart, end: dayEnd }) ||
           isWithinInterval(eventEnd, { start: dayStart, end: dayEnd }) ||
           (eventStart <= dayStart && eventEnd >= dayEnd);
  }).sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());
}

export function getEventPosition(event: CalendarEvent, config: CreatorConfig): { top: number; height: number } {
  const [startH, startM] = config.streamingWindow.start.split(':').map(Number);
  const eventStart = parseISO(event.start);
  const eventEnd = parseISO(event.end);

  const windowStartMinutes = startH * 60 + startM;
  const eventStartMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
  const eventEndMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();

  let top = eventStartMinutes - windowStartMinutes;
  let height = eventEndMinutes - eventStartMinutes;

  if (top < 0) {
    height += top;
    top = 0;
  }

  const slotHeight = 60; // 1 hora = 60px base
  return { top: top * (slotHeight / 60), height: height * (slotHeight / 60) };
}

export function formatEventTime(event: CalendarEvent, config: CreatorConfig): string {
  const start = parseISO(event.start);
  const end = parseISO(event.end);
  return `${formatDate(start, 'HH:mm')} - ${formatDate(end, 'HH:mm')}`;
}

export function getDayStatus(day: DayOfWeek, config: CreatorConfig): 'active' | 'inactive' {
  return config.activeDays.includes(day) ? 'active' : 'inactive';
}

export function getActiveDays(config: CreatorConfig): DayOfWeek[] {
  return config.activeDays as DayOfWeek[];
}

export function toggleDay(day: DayOfWeek, config: CreatorConfig): CreatorConfig {
  const newActiveDays = config.activeDays.includes(day)
    ? config.activeDays.filter(d => d !== day)
    : [...config.activeDays, day].sort((a, b) => a - b);

  return { ...config, activeDays: newActiveDays };
}

export function getColorForGame(gameName: string): string {
  const hash = hashString(gameName);
  const hue = 200 + (hash % 40);
  const saturation = 60 + (hash % 20);
  const lightness = 40 + (hash % 15);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function parseTimeString(timeStr: string, baseDate: Date = new Date()): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return setMinutes(setHours(baseDate, hours), minutes);
}

export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function isTimeInWindow(timeStr: string, config: CreatorConfig): boolean {
  const timeMinutes = timeStringToMinutes(timeStr);
  const startMinutes = timeStringToMinutes(config.streamingWindow.start);
  let endMinutes = timeStringToMinutes(config.streamingWindow.end);

  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

export function getNextWeek(date: Date): Date {
  return addWeeks(date, 1);
}

export function getPreviousWeek(date: Date): Date {
  return subWeeks(date, 1);
}

export function getToday(): Date {
  return startOfDay(new Date());
}

export function createEventFromForm(data: {
  gameId: string;
  gameName: string;
  gameCover: string;
  gameHero?: string;
  type: CalendarEvent['type'];
  title: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  platforms: CalendarEvent['platforms'];
  notes?: string;
}): CalendarEvent {
  const start = parseISO(`${data.date}T${data.startTime}`);
  const end = new Date(start.getTime() + data.durationMinutes * 60000);

  return {
    id: generateId(),
    gameId: data.gameId,
    gameName: data.gameName,
    gameCover: data.gameCover,
    gameHero: data.gameHero,
    type: data.type,
    title: data.title,
    start: start.toISOString(),
    end: end.toISOString(),
    platforms: data.platforms,
    notes: data.notes,
    color: getColorForGame(data.gameName),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getDefaultConfig(): CreatorConfig {
  return {
    ...DEFAULT_CONFIG,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export function validateConfig(config: Partial<CreatorConfig>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (config.activeDays !== undefined) {
    if (!Array.isArray(config.activeDays) || config.activeDays.length === 0) {
      errors.push('Debe haber al menos un día activo');
    }
    if (config.activeDays.some(d => d < 0 || d > 6)) {
      errors.push('Días inválidos (deben ser 0-6)');
    }
  }

  if (config.streamingWindow) {
    const startMinutes = timeStringToMinutes(config.streamingWindow.start);
    let endMinutes = timeStringToMinutes(config.streamingWindow.end);

    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }

    const durationHours = (endMinutes - startMinutes) / 60;
    if (durationHours < 2) {
      errors.push('La ventana de streaming debe ser de al menos 2 horas');
    }
    if (durationHours > 24) {
      errors.push('La ventana de streaming no puede exceder 24 horas');
    }
  }

  return { valid: errors.length === 0, errors };
}