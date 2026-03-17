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

      animation: {
        shimmer: 'shimmer 6s linear infinite',
        marquee: 'marquee 30s linear infinite', // ⬅️ más lenta y sin salto
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },

        // ⬅️ clave para loop perfecto
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },

      backgroundImage: {
        'shimmer-gradient':
          'linear-gradient(90deg, #ffffff, #ec4899, #e5e5e5)',
      },
    },
  },
  plugins: [],
};
