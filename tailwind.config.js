module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        stone: {
          50: '#FAFAF9',
          100: '#F5F0EB',
          800: '#292524',
          900: '#1C1917',
        },
        copper: {
          DEFAULT: '#C2703E',
          light: '#D4915F',
          dark: '#A85C2E',
        },
        slate: {
          DEFAULT: '#64748B',
          light: '#94A3B8',
        },
        sage: {
          DEFAULT: '#6B8F71',
          light: '#8BAF8F',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
