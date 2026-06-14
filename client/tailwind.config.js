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
        brand: {
          deepblue: {
            DEFAULT: '#0f172a', // Slate-900
            light: '#1e293b',   // Slate-800
            dark: '#020617',    // Slate-950
          },
          purple: {
            DEFAULT: '#7c3aed', // Violet-600
            light: '#a78bfa',   // Violet-400
            dark: '#5b21b6',    // Violet-800
          },
          cyan: {
            DEFAULT: '#06b6d4', // Cyan-500
            light: '#67e8f9',   // Cyan-300
            dark: '#0e7490',    // Cyan-700
          },
          success: '#10b981',   // Emerald-500
          warning: '#f97316',   // Orange-500
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"Fira Code"', 'monospace'],
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'neon': '0 0 15px rgba(6, 182, 212, 0.4)',
        'neon-purple': '0 0 15px rgba(124, 58, 237, 0.4)',
      }
    },
  },
  plugins: [],
}
