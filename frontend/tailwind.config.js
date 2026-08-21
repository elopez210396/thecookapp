/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#dc2626',
          green: '#22c55e',
        },
      },
    },
  },
  plugins: [],
};
