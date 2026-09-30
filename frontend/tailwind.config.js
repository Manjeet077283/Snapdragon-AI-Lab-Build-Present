/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        snapdark: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569'
        },
        snapaccent: {
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF'
        }
      }
    },
  },
  plugins: [],
}
