/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // PALETA OLED PURA - 4 COLORES EXACTOS + NEGRO PURO
        oled: {
          black: '#000000',      // Negro puro OLED - píxeles apagados
          dark: '#0A1628',       // Azul oscuro - cards, headers, elementos elevados
          neutral: '#1A3A5C',    // Azul neutro - bordes, separadores, hover
          light: '#3A7BC8',      // Azul claro - acentos, CTAs, glow, interactivo
        },
        // Semánticos basados en la paleta OLED
        primary: {
          DEFAULT: '#3A7BC8',
          hover: '#4A8FD0',
          active: '#2A6BB8',
          glow: 'rgba(58, 123, 200, 0.3)',
        },
        surface: {
          DEFAULT: '#0A1628',
          elevated: '#122038',
          overlay: 'rgba(10, 22, 40, 0.95)',
        },
        border: {
          DEFAULT: '#1A3A5C',
          hover: '#3A7BC8',
          focus: '#3A7BC8',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0C4DE',
          muted: '#6B8BAE',
          inverse: '#000000',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3A7BC8',
        },
        // Estados de días
        day: {
          active: '#0A1628',
          inactive: '#050A14',
          inactiveBorder: '#0F1E3A',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'pill': ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.025em', fontWeight: '500' }],
        'pill-sm': ['0.6875rem', { lineHeight: '1.25', letterSpacing: '0.025em', fontWeight: '500' }],
        'pill-xs': ['0.625rem', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '600', textTransform: 'uppercase' }],
      },
      spacing: {
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '7': '1.75rem',   // 28px
        '8': '2rem',      // 32px
        '9': '2.25rem',   // 36px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
        '14': '3.5rem',   // 56px
        '16': '4rem',     // 64px
      },
      borderRadius: {
        'pill': '9999px',
        'card': '12px',
        'card-sm': '8px',
        'card-lg': '16px',
      },
      boxShadow: {
        'oled-sm': '0 1px 2px rgba(0,0,0,0.5)',
        'oled-md': '0 4px 8px rgba(0,0,0,0.6)',
        'oled-lg': '0 8px 24px rgba(0,0,0,0.7)',
        'oled-glow': '0 0 24px rgba(58, 123, 200, 0.3)',
        'oled-glow-sm': '0 0 12px rgba(58, 123, 200, 0.2)',
        'pill': '0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        'pill-hover': '0 4px 12px rgba(0,0,0,0.6), 0 0 16px rgba(58, 123, 200, 0.3)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '350ms',
      },
      transitionTimingFunction: {
        'oled': 'ease-out',
      },
      animation: {
        'fade-in': 'fadeIn 250ms ease-out',
        'slide-up': 'slideUp 250ms ease-out',
        'slide-down': 'slideDown 250ms ease-out',
        'scale-in': 'scaleIn 150ms ease-out',
        'pulse-glow': 'pulseGlow 2000ms ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(58, 123, 200, 0.2)' },
          '50%': { boxShadow: '0 0 24px rgba(58, 123, 200, 0.4)' },
        },
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        'kiosk': '1920px',
      },
      minHeight: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      minWidth: {
        'touch': '44px',
        'time-col': '72px',
        'time-col-lg': '80px',
      },
      zIndex: {
        'dropdown': '100',
        'sticky': '200',
        'modal': '300',
        'modal-backdrop': '299',
        'toast': '400',
        'tooltip': '500',
      },
    },
  },
  plugins: [],
};