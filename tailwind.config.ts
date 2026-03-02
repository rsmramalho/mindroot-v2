/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        light: '#e8e0d4',
        mind: '#c4a882',
        heart: '#d4856a',
        soul: '#8a9e7a',
        muted: '#a89478',
        bg: '#111318',
        surface: '#1a1d24',
        border: '#2a2d34',
        aurora: '#f0c674',
        zenite: '#e8e0d4',
        crepusculo: '#8a6e5a',
        'mod-purpose': '#c4a882',
        'mod-work': '#8a9e7a',
        'mod-family': '#d4856a',
        'mod-body': '#b8c4a8',
        'mod-mind': '#a89478',
        'mod-soul': '#8a6e5a',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
