/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '128': '32rem',
      },
      colors: {
        transparent: 'transparent',
        black: '#000000',
        rpi_red: '#d6001c',
        rpi_dark_gray: '#54585a',
        rpi_light_gray: '#9ea2a2'
      }
    },
  },
  plugins: [],
}

