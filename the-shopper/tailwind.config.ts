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
          bg: '#080808',
          surface: '#101010',
          elevated: '#181818',
          border: '#222222',
          'border-strong': '#333333',
          text: '#F0EDE6',
          muted: '#767676',
          gold: '#C49A3C',
          'gold-hover': '#D4AA4C',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        brand: '0.25em',
        widest: '0.3em',
      },
    },
  },
  plugins: [],
}

export default config
