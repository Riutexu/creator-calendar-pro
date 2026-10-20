import type { Toast } from '@/types';

const TOAST_CONTAINER_ID = 'toast-container';
const toasts: Toast[] = [];
let listeners: Set<(toasts: Toast[]) => void> = new Set();

function getContainer(): HTMLElement {
  let container = document.getElementById(TOAST_CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = TOAST_CONTAINER_ID;
    container.style.cssText = 'position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 400; display: flex; flex-direction: column; gap: 0.75rem; pointer-events: none; max-width: 28rem;';
    document.body.appendChild(container);
  }
  return container;
}

function notify(): void {
  listeners.forEach(cb => cb([...toasts]));
}

export function showToast(message: string, type: Toast['type'] = 'info', duration = 4000): string {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const toast: Toast = { id, type, message, duration };
  toasts.push(toast);
  notify();
  renderToast(toast);
  if (duration > 0) {
    setTimeout(() => dismissToast(id), duration);
  }
  return id;
}

export function dismissToast(id: string): void {
  const index = toasts.findIndex(t => t.id === id);
  if (index !== -1) {
    toasts.splice(index, 1);
    notify();
    const element = document.getElementById(`toast-${id}`);
    if (element) {
      element.style.animation = 'slideDown 200ms ease-in forwards';
      setTimeout(() => element.remove(), 200);
    }
  }
}

function renderToast(toast: Toast): void {
  const container = getContainer();
  const element = document.createElement('div');
  element.id = `toast-${toast.id}`;
  element.style.pointerEvents = 'auto';
  const typeClasses: Record<Toast['type'], string> = {
    success: 'border-emerald-500/50 bg-emerald-500/10',
    error: 'border-rose-500/50 bg-rose-500/10',
    warning: 'border-amber-500/50 bg-amber-500/10',
    info: 'border-oled-light/50 bg-oled-light/10',
  };
  const icons: Record<Toast['type'], string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };
  element.innerHTML = `
    <div class="flex items-center gap-3 px-4 py-3 rounded-card border min-w-[280px] max-w-md shadow-oled-lg animate-slide-up font-mono text-sm ${typeClasses[toast.type]}">
      <span style="font-size: 1.1em;">${icons[toast.type]}</span>
      <span class="flex-1 text-white">${toast.message}</span>
      <button onclick="window.dismissToast?.('${toast.id}')" class="text-text-muted hover:text-white transition-colors p-1" aria-label="Cerrar">✕</button>
    </div>
  `;
  container.appendChild(element);
}

export function toastSuccess(message: string, duration?: number): string {
  return showToast(message, 'success', duration);
}
export function toastError(message: string, duration?: number): string {
  return showToast(message, 'error', duration);
}
export function toastWarning(message: string, duration?: number): string {
  return showToast(message, 'warning', duration);
}
export function toastInfo(message: string, duration?: number): string {
  return showToast(message, 'info', duration);
}
export function subscribeToToasts(callback: (toasts: Toast[]) => void): () => void {
  listeners.add(callback);
  callback([...toasts]);
  return () => listeners.delete(callback);
}
if (typeof window !== 'undefined') {
  (window as any).dismissToast = dismissToast;
}