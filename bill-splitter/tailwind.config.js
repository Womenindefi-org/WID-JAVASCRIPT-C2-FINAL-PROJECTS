/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'solana-purple': '#9945FF',
        'solana-green': '#14F195',
        'dark-bg': '#121212',
        'card-bg': '#1A1A1A',
        'light-gray': '#A0A0A0',
        'input-bg': '#2C2C2C',
        'attention': '#FFD700',
        'danger': '#FF4545',
      }
    },
  },
  plugins: [],
}