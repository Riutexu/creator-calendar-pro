// Client-side calendar logic - transpiled by Vite
import { getConfig, getAllEvents, saveEvent, deleteEvent } from '@/lib/idb';
import { getWeekRange, generateTimeSlots, getEventsForWeek, getWeekNumber, formatWeekLabel, createEventFromForm } from '@/lib/calendar';
import { generateShareLink, exportToJSON, downloadICS } from '@/lib/share';
import { toastSuccess, toastError, toastInfo } from '@/lib/toast';
import { DAY_NAMES_SHORT, type DayOfWeek } from '@/types';
import type { CalendarEvent, CreatorConfig } from '@/types';

interface CalendarConfig extends Omit<CreatorConfig, 'username'> {
  username: string;
}

let currentConfig: CalendarConfig = {
  activeDays: [1, 2, 5, 0],
  streamingWindow: { start: '18:00', end: '02:00' },
  timezone: 'Europe/Madrid',
  username: '',
  steamGridDbKey: undefined,
};
let currentWeekStart = new Date();

export async function loadWeek(weekStart: Date) {
  currentWeekStart = weekStart;
  try {
    const cfg = ((await getConfig()) as CalendarConfig | undefined) || currentConfig;
    currentConfig = cfg;
    const events = await getAllEvents();
    const { start, end } = getWeekRange(weekStart, cfg);
    const timeSlots = generateTimeSlots(cfg);
    const eventsBySlot = getEventsForWeek(events, start, end, cfg);

    renderCalendar(cfg, timeSlots, eventsBySlot, start, end);
    updateWeekLabel(start, end, cfg);
  } catch (error) {
    console.error('Error loading week:', error);
    toastError?.('Error al cargar la semana');
  }
}

function renderCalendar(cfg: CalendarConfig, timeSlots: string[], eventsBySlot: Map<string, CalendarEvent[]>, start: Date, end: Date) {
  // Render time column
  const timeColumn = document.getElementById('time-slots');
  if (timeColumn) {
    timeColumn.innerHTML = timeSlots.map((slot, index) => `
      <div class="flex items-end justify-end min-h-[60px] pb-2 text-xs font-mono text-text-muted select-none" style="height: 60px;" aria-label="Hora: ${slot}">
        ${slot}
        ${index < timeSlots.length - 1 ? '<div class="absolute w-full border-t border-oled-neutral/30" style="bottom: 0; left: 0;" aria-hidden="true" />' : ''}
      </div>
    `).join('');
  }

  const dayColumns = document.getElementById('day-columns');
  if (!dayColumns) return;

  const dayOrder: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];
  const columns = dayOrder.map((day, idx) => {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + idx);
    const dateStr = dayDate.toISOString().split('T')[0];
    const isActive = cfg.activeDays.includes(day);

    let slotsHtml = timeSlots.map((slot, si) => {
      const key = `${dateStr}-${slot}`;
      const dayEvents = eventsBySlot.get(key) || [];
      const isLast = si === timeSlots.length - 1;

      const eventsHtml = dayEvents.map((event: CalendarEvent, ei: number) => `
        <div class="pill-event relative z-10 mx-1 my-0.5 animate-scale-in" data-event-id="${event.id}" style="border-left-color: ${event.color};" tabindex="0" role="listitem" aria-label="${event.title} - ${event.gameName}">
          <img src="${event.gameCover}" alt="" class="w-4 h-6 object-cover rounded-sm flex-shrink-0" loading="lazy" onerror="this.style.display='none'" />
          <span class="truncate max-w-[140px] font-mono text-pill font-medium text-white">${event.title}</span>
          <span class="badge ${['badge-stream','badge-video','badge-event','badge-collab'][['stream','video','event','collab'].indexOf(event.type)] || 'badge-stream'} ml-1 flex-shrink-0">
            ${event.type === 'stream' ? '🔴' : event.type === 'video' ? '📹' : event.type === 'event' ? '📅' : '🤝'}
          </span>
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-oled-elevated border border-oled-neutral rounded-card-sm text-xs font-mono text-text-secondary whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-fast z-tooltip pointer-events-none">
            <div class="font-medium text-white">${event.gameName}</div>
            <div>${event.title}</div>
            <div class="text-text-muted">${event.platforms.join(', ')}</div>
            ${event.notes ? `<div class="truncate max-w-[200px]">${event.notes}</div>` : ''}
          </div>
        </div>
      `).join('');

      const addButton = isActive ? `
        <button type="button" class="absolute inset-0 w-full h-full flex items-center justify-center text-text-muted/30 hover:text-oled-light/50 hover:bg-oled-neutral/20 transition-all duration-fast rounded-card-sm mx-1 my-0.5" data-create-day="${day}" data-create-time="${slot}" aria-label="Crear evento en ${DAY_NAMES_SHORT[day as DayOfWeek]} a las ${slot}"><span class="text-xs font-mono">+</span></button>
      ` : '';

      return `
        <div class="relative min-h-[60px] border-b border-oled-neutral/30" data-time="${slot}" data-slot-key="${key}">
          ${eventsHtml}
          ${addButton}
          ${!isLast ? '<div class="absolute bottom-0 left-2 right-2 border-t border-oled-neutral/20" aria-hidden="true" />' : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="flex-1 min-w-0 relative" data-day="${day}" data-date="${dateStr}" data-active="${isActive}" role="gridcell" aria-label="${DAY_NAMES_SHORT[day as DayOfWeek]}">
        <div class="sticky top-0 z-10 px-2 py-2 text-center font-mono text-pill font-medium border-b border-oled-neutral ${isActive ? 'bg-oled-dark text-white' : 'bg-oled-inactive text-text-muted'}">
          <span class="flex items-center justify-center gap-1.5">
            ${DAY_NAMES_SHORT[day as DayOfWeek]}
            <span class="text-xs font-sans">${dayDate.getDate()}</span>
            ${!isActive ? '<span class="badge badge-warning ml-1">⚠ INACTIVO</span>' : ''}
          </span>
        </div>
        <div class="flex flex-col min-h-[calc(100vh-120px)]" role="list" aria-label="Eventos de ${DAY_NAMES_SHORT[day as DayOfWeek]}">
          ${slotsHtml}
        </div>
      </div>
    `;
  }).join('');

  dayColumns.innerHTML = columns;
  attachEventListeners();
}

function attachEventListeners() {
  document.querySelectorAll('[data-create-day]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const day = parseInt(target.dataset.createDay!);
      const time = target.dataset.createTime!;
      (window as any).openEventModal?.(null, { day, time });
    });
  });

  document.querySelectorAll('[data-event-id]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('button')) return;
      const eventId = pill.getAttribute('data-event-id');
      (window as any).openEventModal?.(eventId);
    });
  });

  document.querySelectorAll('.pill-event').forEach(el => {
    (el as HTMLElement).addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const eventId = el.getAttribute('data-event-id');
        (window as any).openEventModal?.(eventId);
      }
    });
  });
}

function updateWeekLabel(start: Date, end: Date, cfg: CalendarConfig) {
  const label = document.getElementById('week-label');
  if (label) {
    label.textContent = `Semana ${getWeekNumber(start)} · ${formatWeekLabel(start, cfg)}`;
  }
}

(window as any).prevWeek = () => {
  currentWeekStart = new Date(currentWeekStart.getTime() - 7 * 86400000);
  loadWeek(currentWeekStart);
};

(window as any).nextWeek = () => {
  currentWeekStart = new Date(currentWeekStart.getTime() + 7 * 86400000);
  loadWeek(currentWeekStart);
};

(window as any).todayWeek = () => {
  currentWeekStart = new Date();
  loadWeek(currentWeekStart);
};

(window as any).openShareModal = async () => {
  const cfg = await getConfig();
  const events = await getAllEvents();
  const { url, qrCodeDataUrl } = await generateShareLink(cfg!, events, cfg?.username);

  const modal = document.getElementById('share-modal');
  if (modal) {
    (modal as any)._show?.(url, qrCodeDataUrl, cfg?.username);
  }
};

(window as any).openEventModal = (eventId: string | null, initialData?: { day: number; time: string }) => {
  const modal = document.getElementById('event-modal');
  if (modal) {
    (modal as any)._show?.(eventId, initialData);
  }
};

(window as any).closeEventModal = () => {
  const modal = document.getElementById('event-modal');
  if (modal) {
    (modal as any)._hide?.();
  }
};

(window as any).saveEventFromModal = async (data: any) => {
  const event = createEventFromForm(data);
  await saveEvent(event);
  toastSuccess?.('Evento guardado');
  loadWeek(currentWeekStart);
};

(window as any).deleteEventFromModal = async (id: string) => {
  if (confirm('¿Eliminar este evento?')) {
    await deleteEvent(id);
    toastSuccess?.('Evento eliminado');
    loadWeek(currentWeekStart);
  }
};

(window as any).openGameSearchModal = () => {
  const input = document.getElementById('game-search') as HTMLInputElement;
  input?.focus();
};

(window as any).closeShareModal = () => {
  const modal = document.getElementById('share-modal');
  if (modal) {
    (modal as any)._hide?.();
  }
};

(window as any).copyShareLink = async () => {
  const input = document.getElementById('share-url-input') as HTMLInputElement;
  await navigator.clipboard.writeText(input.value);
  toastSuccess?.('Link copiado al portapapeles');
};

(window as any).downloadShareICS = async () => {
  const cfg = await getConfig();
  const events = await getAllEvents();
  await downloadICS(events, cfg!, cfg?.username);
  toastSuccess?.('Archivo .ics descargado');
};

(window as any).exportShareImage = () => {
  document.getElementById('export-image-btn')?.click();
};

(window as any).exportShareJSON = async () => {
  const cfg = await getConfig();
  const events = await getAllEvents();
  exportToJSON(cfg!, events, cfg?.username);
  toastSuccess?.('JSON exportado');
};

(window as any).deleteEvent = async (id: string) => {
  if (confirm('¿Eliminar este evento?')) {
    await deleteEvent(id);
    toastSuccess?.('Evento eliminado');
    loadWeek(currentWeekStart);
  }
};

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    currentWeekStart = new Date(currentWeekStart.getTime() - 7 * 86400000);
    loadWeek(currentWeekStart);
  } else if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    currentWeekStart = new Date(currentWeekStart.getTime() + 7 * 86400000);
    loadWeek(currentWeekStart);
  }
});

// Initial load
loadWeek(currentWeekStart);