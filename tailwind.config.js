/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'base': '#F4F4F4',
      'baseDark': '#EDEDED',
      'neutral': '#ACACAC',
      'clarita': '#656565',
      'negrita': '#262626',
      'fondoInput': '#e6e6e6',
      'red': '#D33939',
      'green': '#4CBB17',
      'blue': {
        100: '#E3E1FF',
        200: '#AAA7E2',
        400: '#6560AA',
        500: '#646283',
        600: '#3E3D4F',
      }
    },
    extend: {},
  },
  plugins: [],
}

