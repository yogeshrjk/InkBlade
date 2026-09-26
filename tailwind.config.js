/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f8f8f6',
          100: '#efefe9',
          200: '#dedecc',
          300: '#c5c5ac',
          400: '#a6a687',
          500: '#8a8a6b',
          600: '#6f6f54',
          700: '#585843',
          800: '#434335',
          850: '#2d2d24',
          900: '#1e1e18',
          950: '#10100d',
        },
        cinnabar: {
          400: '#ef4444',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
        },
        sumi: {
          bg: '#141413',
          card: '#1c1c1a',
          cardHover: '#252522',
          border: '#33332d',
          gold: '#c5a059',
          red: '#c0392b',
        },
        parchment: {
          bg: '#f7f5ed',
          card: '#ffffff',
          border: '#e4dfd5',
          text: '#24211e',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Songti SC"', '"Noto Serif JP"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'ink-pulse': 'inkPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        inkPulse: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.98)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
