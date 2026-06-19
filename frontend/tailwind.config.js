/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        baby: {
          bg: '#FFF8E7',
          primary: '#FF6B6B',
          secondary: '#4ECDC4',
          accent: '#FFE66D',
          text: '#2C3E50',
        },
      },
      fontSize: {
        'answer': ['1.5rem', { lineHeight: '2rem' }],
      },
      minHeight: {
        'touch': '80px',
      },
    },
  },
  plugins: [],
};
