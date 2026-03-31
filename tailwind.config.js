// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['Cormorant Garamond', 'serif'],
        body: ['Playfair Display', 'serif'],
      },

      colors: {
        primary: '#6f7f66',
        primaryDark: '#4f5a47',
        softPink: '#e6cfcf',
        softBlue: '#cfdde6',
        lightGray: '#f5f5f5',
      },

      animation: {
        shimmer: 'shimmer 6s linear infinite',
        marquee: 'marquee 30s linear infinite',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },

      backgroundImage: {
        'shimmer-gradient':
          'linear-gradient(90deg, #ffffff, #6f7f66, #e5e5e5)',
      },
    },
  },
  plugins: [],
};