/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Funnel Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-out forwards',
        'drop': 'drop 0.5s ease-in forwards',
        'bounce': 'bounce 1s infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%': { 
            transform: 'translateY(120%)',
            opacity: '0'
          },
          '20%': {
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(0%)',
          },
        },
        drop: {
          '0%': { 
            transform: 'translateY(0%)',
          },
          '100%': { 
            transform: 'translateY(120%)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        }
      },
      animationDelay: {
        '1000': '1000ms',
        '2000': '2000ms',
        '3000': '3000ms',
      }
    },
  },
  plugins: [],
} 