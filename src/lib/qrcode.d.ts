declare module 'qrcode' {
  export function toDataURL(text: string, options?: {
    width?: number;
    margin?: number;
    color?: { dark: string; light: string };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }): Promise<string>;
  export function toDataURL(text: string, callback: (err: Error | null, url: string) => void): void;
}