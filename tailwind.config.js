/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 15s linear infinite',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        float: {
          '0%': { 
            transform: 'translateY(100vh) rotate(0deg)',
            opacity: '0',
          },
          '10%': {
            opacity: '1',
          },
          '100%': { 
            transform: 'translateY(-100vh) rotate(360deg)',
            opacity: '0',
          },
        }
      },
      animationDelay: {
        '1000': '1000ms',
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
      }
    },
  },
  plugins: [],
} 