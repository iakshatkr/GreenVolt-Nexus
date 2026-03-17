import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e7fff4',
          100: '#c8ffe6',
          200: '#95f7c8',
          300: '#5deaa7',
          400: '#33d48d',
          500: '#18b978',
          600: '#0f8c5c',
          700: '#0d6d49',
          800: '#0d563a',
          900: '#0d452f'
        },
        night: '#09111f',
        sun: '#f7c76a',
        cloud: '#050914',
        ink: '#e7edf7'
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        panel: '0 24px 80px rgba(0, 0, 0, 0.42)',
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(31, 227, 165, 0.12)'
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(circle at 15% 20%, rgba(24, 185, 120, 0.18), transparent 30%), radial-gradient(circle at 85% 18%, rgba(77, 126, 255, 0.18), transparent 24%), radial-gradient(circle at 50% 100%, rgba(247, 199, 106, 0.08), transparent 35%), linear-gradient(180deg, #040814 0%, #071120 48%, #03060d 100%)'
      }
    }
  },
  plugins: []
} satisfies Config;
