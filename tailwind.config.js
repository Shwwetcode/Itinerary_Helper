/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50:  '#FFFDF9',
          100: '#FAF6F0',
          200: '#F5EDE3',
          300: '#EDE0D0',
          400: '#DFD0BA',
          500: '#CCBA9E',
        },
        espresso: {
          50:  '#F5F0EB',
          100: '#E0D5C9',
          200: '#C4B09A',
          300: '#9E8469',
          400: '#7A6250',
          500: '#6B5344',
          600: '#5A4438',
          700: '#4A3629',
          800: '#3D2B1F',
          900: '#2C1E14',
        },
        terracotta: {
          50:  '#FEF2EB',
          100: '#FDDFC8',
          200: '#F5C4A0',
          300: '#E6A67A',
          400: '#D4915A',
          500: '#C06B3E',
          600: '#A95A33',
          700: '#8C4A2A',
        },
        sage: {
          50:  '#F2F5F0',
          100: '#DDE6D9',
          200: '#C2D4BC',
          300: '#A8C0A0',
          400: '#8BA888',
          500: '#6E9168',
          600: '#587A52',
        },
        sandstone: {
          50:  '#FBF7F1',
          100: '#F0E8DC',
          200: '#E2D5C3',
          300: '#D4C2AA',
          400: '#C6AF91',
          500: '#B89C78',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.7s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-warm': 'glowWarm 3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowWarm: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
