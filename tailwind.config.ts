import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A0F1E',
        warm: '#F5F0E8',
        gold: '#C9A84C',
        slate: '#64748B',
        ink: '#172033',
      },
      fontFamily: {
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        display: ['var(--font-playfair)', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        card: '0 18px 50px rgba(10, 15, 30, 0.12)',
        glow: '0 18px 55px rgba(201, 168, 76, 0.22)',
      },
    },
  },
  plugins: [],
};

export default config;
