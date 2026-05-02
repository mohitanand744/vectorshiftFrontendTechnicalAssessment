/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#8a01bc',
        'primary-hover': '#aa0de3ff',
        'canvas-bg': '#050505',
        'node-bg': '#0d1117',
        'node-border': '#30363d',
      },
      boxShadow: {
        'neon-primary': '0 0 15px rgba(139, 92, 246, 0.4), 0 0 5px rgba(139, 92, 246, 0.2)',
        'neon-violet': '0 0 15px rgba(139, 92, 246, 0.5), 0 0 5px rgba(139, 92, 246, 0.3)',
        'neon-emerald': '0 0 15px rgba(16, 185, 129, 0.4), 0 0 5px rgba(16, 185, 129, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(0.98)' },
        }
      }
    },
  },
  plugins: [],
}
