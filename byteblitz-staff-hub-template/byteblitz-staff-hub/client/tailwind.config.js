module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'byteblitz-purple': '#8B5CF6',
          'byteblitz-dark': '#0F0F0F',
          'byteblitz-gray': '#1A1A1A',
        },
        fontFamily: {
          'redhat': ['Red Hat Display', 'sans-serif'],
        },
        animation: {
          'gradient': 'gradient 6s ease infinite',
        },
        keyframes: {
          gradient: {
            '0%, 100%': {
              'background-size': '200% 200%',
              'background-position': 'left center'
            },
            '50%': {
              'background-size': '200% 200%',
              'background-position': 'right center'
            }
          }
        }
      },
    },
    plugins: [],
  }
  