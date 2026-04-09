import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Ensure src directory is covered
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      fontFamily: {
        heading: ['var(--font-syne)'],
        body: ['var(--font-cormorant-garamond)'],
      },
      colors: {
        'pure-black': '#000000',
        'pure-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
};
export default config;
