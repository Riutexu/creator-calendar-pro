/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        oled: {
          black: '#000000',
          dark: '#0A1628',
          neutral: '#1A3A5C',
          light: '#3A7BC8',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0C4DE',
          muted: '#6B8BAE',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        oled: '0 0 24px rgba(58, 123, 200, 0.3)',
        'oled-lg': '0 8px 32px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
};