/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Red Hat Display"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
        },
        bg: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        text: {
          light: '#1e293b',
          dark: '#cbd5e1',
        },
      },
    },
  },
  plugins: [],
};