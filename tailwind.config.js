/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'bold-bg': '#FDFCFB',
        'bold-surface': '#FFFFFF',
        'bold-surface-variant': '#F3EFFF',
        'bold-text': '#1D1B1E',
        'bold-text-secondary': '#49454F',
        'bold-primary': '#6750A4',
        'bold-primary-container': '#EADDFF',
        'bold-secondary-container': '#D0BCFF',
        'bold-border': '#E7E0EC',
        'bold-border-muted': '#CAC4D0',
        'bold-pink': '#FFD8E4',
        'bold-dark-pink-text': '#31111D',
        'bold-gold': '#D09C00',
        'bold-emerald': '#1B8A4E',
        'bold-cyan': '#007A94',
        'bold-magenta': '#9E1F8C',
        'bold-coral': '#BF360C',
      },
    },
  },
  plugins: [],
};
