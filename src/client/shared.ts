// Client-side shared calendar logic
import { getDefaultConfig } from '@/lib/calendar';
import { getShareData, parseShareHashFromUrl } from '@/lib/share';
import { getWeekRange, generateTimeSlots, getEventsForWeek, getWeekNumber, formatWeekLabel } from '@/lib/calendar';
import { DAY_NAMES_SHORT } from '@/types';
import { toastError } from '@/lib/toast';

const config = getDefaultConfig();
const dayOrder = [1, 2, 3, 4, 5, 6, 0];

let currentConfig = { ...config };
let currentEvents: any[] = [];
let currentWeekStart = new Date();

async function loadShareData() {
  const hash = parseShareHashFromUrl();
  if (!hash) {
    window.location.href = '/';
    return;
  }

  try {
    const shareData = await getShareData(hash);

    if (!shareData) {
      toastError?.('Calendario no encontrado');
      setTimeout(() => window.location.href = '/', 2000);
      return;
    }

    currentConfig = shareData.config;
    currentEvents = shareData.events;

    const titleEl = document.getElementById('share-title');
    if (titleEl) {
      titleEl.textContent = `Calendario de @${currentConfig.username || 'creador'}`;
    }

    renderCalendar();
  } catch (error) {
    console.error('Error loading share data:', error);
    toastError?.('Error al cargar el calendario');
  }
}

function renderCalendar() {
  const { generateTimeSlots, getWeekRange, getEventsForWeek, getWeekNumber, formatWeekLabel } = await import('/src/lib/calendar.ts');
  const cfg = currentConfig;
  const { start, end } = getWeekRange(currentWeekStart, cfg);
  const timeSlots = generateTimeSlots(cfg);
  const eventsBySlot = getEventsForWeek(currentEvents, start, end, cfg);

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

  // Render day columns
  const dayColumns = document.getElementById('day-columns');
  if (!dayColumns) return;

  const columns = dayOrder.map((day, idx) => {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + idx);
    const dateStr = dayDate.toISOString().split('T')[0];
    const isActive = cfg.activeDays.includes(day);

    let slotsHtml = timeSlots.map((slot, si) => {
      const key = `${dateStr}-${slot}`;
      const dayEvents = eventsBySlot.get(key) || [];
      const isLast = si === timeSlots.length - 1;

      const eventsHtml = dayEvents.map((event: any, ei: number) => `
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

      return `
        <div class="relative min-h-[60px] border-b border-oled-neutral/30" data-time="${slot}" data-slot-key="${key}">
          ${eventsHtml}
          ${!isLast ? '<div class="absolute bottom-0 left-2 right-2 border-t border-oled-neutral/20" aria-hidden="true" />' : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="flex-1 min-w-0 relative" data-day="${day}" data-date="${dateStr}" data-active="${isActive}" role="gridcell" aria-label="${DAY_NAMES_SHORT[day]}">
        <div class="sticky top-0 z-10 px-2 py-2 text-center font-mono text-pill font-medium border-b border-oled-neutral ${isActive ? 'bg-oled-dark text-white' : 'bg-oled-inactive text-text-muted'}">
          <span class="flex items-center justify-center gap-1.5">
            ${DAY_NAMES_SHORT[day]}
            <span class="text-xs font-sans">${dayDate.getDate()}</span>
            ${!isActive ? '<span class="badge badge-warning ml-1">⚠ INACTIVO</span>' : ''}
          </span>
        </div>
        <div class="flex flex-col min-h-[calc(100vh-120px)]" role="list" aria-label="Eventos de ${DAY_NAMES_SHORT[day]}">
          ${slotsHtml}
        </div>
      </div>
    `;
  }).join('');

  dayColumns.innerHTML = columns;

  // Update week label
  const label = document.getElementById('week-label');
  if (label) {
    label.textContent = `Semana ${getWeekNumber(currentWeekStart)} · ${formatWeekLabel(currentWeekStart, cfg)} · Vista de solo lectura`;
  }
}

(window as any).prevWeek = () => {
  currentWeekStart = new Date(currentWeekStart.getTime() - 7 * 86400000);
  renderCalendar();
};

(window as any).nextWeek = () => {
  currentWeekStart = new Date(currentWeekStart.getTime() + 7 * 86400000);
  renderCalendar();
};

(window as any).todayWeek = () => {
  currentWeekStart = new Date();
  renderCalendar();
};

// Initial load
loadShareData();