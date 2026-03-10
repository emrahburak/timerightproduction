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
