import html2canvas from 'html2canvas';
import type { ExportImageOptions } from '@/types';

export async function exportCalendarAsImage(
  element: HTMLElement,
  options: Partial<ExportImageOptions> = {}
): Promise<Blob> {
  const opts: ExportImageOptions = {
    format: 'png',
    quality: 1.0,
    width: 1920,
    height: 1080,
    includeWatermark: true,
    watermarkText: 'creator-calendar.pro',
    ...options,
  };

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#000000',
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    onclone: (clonedDoc) => {
      if (opts.includeWatermark) {
        addWatermark(clonedDoc, opts.watermarkText);
      }
      hideUIElements(clonedDoc);
    },
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, `image/${opts.format}`, opts.quality);
  });
}

function addWatermark(doc: Document, text: string): void {
  const target = doc.querySelector('.calendar-grid') || doc.body;
  const watermark = doc.createElement('div');
  watermark.style.cssText = `
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: rgba(58, 123, 200, 0.4);
    pointer-events: none;
    user-select: none;
    z-index: 9999;
    text-shadow: 0 0 8px rgba(0,0,0,0.8);
  `;
  watermark.textContent = text;
  target.appendChild(watermark);
}

function hideUIElements(doc: Document): void {
  const selectors = [
    '.header-actions',
    '.settings-btn',
    '.export-btn',
    '.share-btn',
    '.week-nav',
    '[data-hide-on-export]',
  ];

  selectors.forEach(selector => {
    doc.querySelectorAll(selector).forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateExportFilename(username?: string): string {
  const now = new Date();
  const week = getWeekNumber(now);
  const dateStr = now.toISOString().split('T')[0];
  const userPart = username ? `@${username}` : 'calendario';
  return `calendario-semana-${week}-${userPart}-${dateStr}.png`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export async function exportAndDownload(
  element: HTMLElement,
  username?: string,
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
  try {
    const blob = await exportCalendarAsImage(element, { format });
    const filename = generateExportFilename(username).replace('.png', `.${format}`);
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Error exporting image:', error);
    throw new Error('No se pudo generar la imagen. Intenta de nuevo.');
  }
}