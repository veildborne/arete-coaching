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
        bg:        '#070B14',
        surface:   '#0D1424',
        surface2:  '#111B2E',
        gold:      '#D4B570',
        'gold-muted': '#9E8650',
        amber:     '#C05000',
        success:   '#47D18C',
        danger:    '#EF6B73',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}