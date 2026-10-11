/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ivory: "#f7f5ef",
        paper: "#fffdfa",
        emerald: { DEFAULT: "#0e3028", deep: "#17352e" },
        gold: { DEFAULT: "#bb8a4a", light: "#d8b776", champagne: "#dfbd7c" },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"DM Sans"', "Arial", "sans-serif"],
      },
      borderColor: {
        DEFAULT: "#d9d7ce",
      },
    },
  },
  plugins: [],
};
