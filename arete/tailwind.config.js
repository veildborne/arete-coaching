/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep':   '#070B14',
        'surface':   '#0D1424',
        'surface-2': '#111B2E',
        'gold':      '#D4B570',
        'gold-dark': '#C09A50',
        'muted':     '#8F9AAF',
        'warm':      '#F4EFE3',
        'success':   '#47D18C',
        'danger':    '#EF6B73',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
