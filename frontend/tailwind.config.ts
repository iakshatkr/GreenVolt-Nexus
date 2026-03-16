import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf4',
          100: '#d6f5e3',
          200: '#b0eacb',
          300: '#7ed8aa',
          400: '#45be82',
          500: '#219f66',
          600: '#157f52',
          700: '#126544',
          800: '#115037',
          900: '#0f422f'
        },
        night: '#082032',
        sun: '#f4b860',
        cloud: '#f7f9fb'
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        panel: '0 20px 45px rgba(8, 32, 50, 0.12)'
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top left, rgba(33, 159, 102, 0.3), transparent 35%), radial-gradient(circle at bottom right, rgba(244, 184, 96, 0.22), transparent 30%)'
      }
    }
  },
  plugins: []
} satisfies Config;

