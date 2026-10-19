// Client-side settings logic
import { getConfig, saveConfig, getAllEvents, getDB } from '@/lib/idb';
import { validateConfig, getDefaultConfig } from '@/lib/calendar';
import { exportToJSON, importFromJSON, downloadICS, generateShareLink } from '@/lib/share';
import { createSteamGridDBClient } from '@/lib/steamgriddb';
import { toastSuccess, toastError, toastInfo } from '@/lib/toast';
import { DEFAULT_CONFIG } from '@/types';

interface CalendarConfig {
  activeDays: number[];
  streamingWindow: { start: string; end: string };
  timezone: string;
  username: string;
  steamGridDbKey?: string;
  id?: string;
}

const config: CalendarConfig = { ...DEFAULT_CONFIG };

function updateActiveDaysUI(activeDays: number[]) {
  document.querySelectorAll('[data-day]').forEach(btn => {
    const day = parseInt(btn.getAttribute('data-day')!);
    const isActive = activeDays.includes(day);
    btn.classList.toggle('pill-active-day', isActive);
    btn.classList.toggle('pill-inactive-day', !isActive);
    btn.setAttribute('aria-pressed', String(isActive));
    const indicator = btn.querySelector('span:last-child') as HTMLElement;
    if (indicator) {
      indicator.className = `w-2 h-2 rounded-full ${isActive ? 'bg-oled-light' : 'bg-oled-neutral'}`;
    }
  });
}

(window as any).toggleActiveDay = async (day: number) => {
  const cfg = (await getConfig()) || config;
  const newActiveDays = cfg.activeDays.includes(day)
    ? cfg.activeDays.filter(d => d !== day)
    : [...cfg.activeDays, day].sort((a, b) => a - b);

  await saveConfig({ ...cfg, activeDays: newActiveDays });
  toastSuccess?.(newActiveDays.includes(day) ? 'Día activado' : 'Día desactivado');
  updateActiveDaysUI(newActiveDays);
};

(window as any).updateStreamingWindow = async (window_: { start: string; end: string }) => {
  const cfg = (await getConfig()) || config;

  const validation = validateConfig({ streamingWindow: window_ });
  if (!validation.valid) {
    toastError?.(validation.errors[0]);
    return;
  }

  await saveConfig({ ...cfg, streamingWindow: window_ });
  toastSuccess?.('Horario actualizado');
};

(window as any).saveApiKey = async (key: string) => {
  const cfg = (await getConfig()) || config;
  await saveConfig({ ...cfg, steamGridDbKey: key.trim() });
  toastSuccess?.('API Key guardada');
};

(window as any).testApiKey = async () => {
  const input = document.getElementById('api-key') as HTMLInputElement;
  const statusEl = document.getElementById('api-key-status');
  const testBtn = document.querySelector('button[onclick="window.testApiKey?.()"]') as HTMLButtonElement;

  const key = input.value.trim();
  if (!key) {
    toastError?.('Ingresa una API Key primero');
    return;
  }

  testBtn.disabled = true;
  testBtn.innerHTML = '<svg class="animate-spin-slow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1" stroke-linecap="round" /></svg> Probando...';

  try {
    const client = createSteamGridDBClient(key);
    const result = await client.testConnection();

    if (result.valid) {
      statusEl.textContent = '✅ ' + result.message;
      statusEl.className = 'text-xs text-emerald-400 min-h-[20px]';
      toastSuccess?.('Conexión exitosa');
    } else {
      statusEl.textContent = '❌ ' + result.message;
      statusEl.className = 'text-xs text-rose-400 min-h-[20px]';
      toastError?.(result.message);
    }
  } catch (error) {
    statusEl.textContent = '❌ Error de conexión';
    statusEl.className = 'text-xs text-rose-400 min-h-[20px]';
    toastError?.('Error al probar la conexión');
  } finally {
    testBtn.disabled = false;
    testBtn.textContent = 'Probar Conexión';
  }
};

(window as any).exportJSON = async () => {
  const cfg = await getConfig();
  const events = await getAllEvents();
  exportToJSON(cfg!, events, cfg?.username);
  toastSuccess?.('JSON exportado');
};

(window as any).downloadICS = async () => {
  const cfg = await getConfig();
  const events = await getAllEvents();
  await downloadICS(events, cfg!, cfg?.username);
  toastSuccess?.('Archivo .ics descargado');
};

(window as any).generateShareLink = async () => {
  const cfg = await getConfig();
  const events = await getAllEvents();
  const { url, qrCodeDataUrl } = await generateShareLink(cfg!, events, cfg?.username);

  const modal = document.getElementById('settings-share-modal');
  if (modal) {
    (modal as any)._show?.(url, qrCodeDataUrl, cfg?.username);
  }
};

(window as any).exportImage = () => {
  document.getElementById('export-image-btn')?.click();
};

(window as any).importJSON = async (file: File | undefined) => {
  if (!file) return;
  const { importFromJSON } = await import('/src/lib/share.ts');
  const { saveEvent, saveConfig } = await import('/src/lib/idb.ts');

  try {
    const { config: importedConfig, events: importedEvents } = await importFromJSON(file);

    await saveConfig(importedConfig);
    for (const event of importedEvents) {
      await saveEvent(event);
    }

    toastSuccess?.(`${importedEvents.length} eventos importados`);
    setTimeout(() => location.reload(), 1000);
  } catch {
    toastError?.('Error al importar el archivo');
  }
};

(window as any).clearAllData = async () => {
  if (!confirm('⚠️ Esto borrará TODOS tus eventos y configuración. ¿Estás seguro?')) return;
  if (!confirm('Última confirmación: ¿Borrar todo irrevocablemente?')) return;

  const db = await getDB();
  await db.clear('events');
  await db.clear('config');
  await db.clear('shares');
  await db.clear('cache');

  toastSuccess?.('Todos los datos borrados');
  setTimeout(() => location.reload(), 1000);
};

// Initialize active days UI on load
document.addEventListener('DOMContentLoaded', async () => {
  const cfg = (await getConfig()) || config;
  updateActiveDaysUI(cfg.activeDays);
});