import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#060608',
          surface: '#0E0E10',
          elevated: '#141416',
          border: '#1E1E22',
          'border-strong': '#2A2A30',
          text: '#F0EDE6',
          muted: '#6B6B72',
          gold: '#C9A84C',
          'gold-hover': '#D4B85C',
        },
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'ui-monospace', 'monospace'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        brand: '0.25em',
        widest: '0.3em',
      },
      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        ticker: 'ticker 28s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
