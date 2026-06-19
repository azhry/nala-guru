/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        baby: {
          bg: '#f8f9fa',
          primary: '#864d61',
          secondary: '#42617d',
          accent: '#FFE66D',
          text: '#191c1d',
          'primary-container': '#ffb7ce',
          'secondary-container': '#bddefe',
          'tertiary': '#616207',
          'tertiary-container': '#d0d06f',
          'surface': '#f8f9fa',
          'surface-container': '#edeeef',
          'surface-container-high': '#e7e8e9',
          'surface-container-lowest': '#ffffff',
          'on-primary': '#ffffff',
          'on-primary-container': '#7b4458',
          'on-secondary-container': '#43627e',
          'on-surface-variant': '#514347',
          'error': '#ba1a1a',
          'error-container': '#ffdad6',
          'outline': '#837377',
          'outline-variant': '#d5c2c6',
        },
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        'nunito-sans': ['Nunito Sans', 'sans-serif'],
      },
      fontSize: {
        'answer': ['1.5rem', { lineHeight: '2rem' }],
        'headline-xl': ['80px', { lineHeight: '90px', letterSpacing: '-1px', fontWeight: '700' }],
        'headline-lg': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'headline-lg-mobile': ['40px', { lineHeight: '48px', fontWeight: '700' }],
        'label-xl': ['32px', { lineHeight: '40px', fontWeight: '800' }],
        'body-lg': ['24px', { lineHeight: '32px', fontWeight: '600' }],
      },
      minHeight: {
        'touch': '80px',
      },
      borderRadius: {
        'puffy': '2rem',
        'puffy-lg': '3rem',
      },
      boxShadow: {
        'puffy': '0 12px 0 0 rgba(0,0,0,0.05)',
        'puffy-active': '0 4px 0 0 rgba(0,0,0,0.05)',
        'soft': '0 10px 30px -10px rgba(134, 77, 97, 0.2)',
        'puffy-card': '0 20px 40px -10px rgba(134, 77, 97, 0.15)',
      },
    },
  },
  plugins: [],
};
