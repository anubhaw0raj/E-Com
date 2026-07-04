/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        Audiowide: ["Audiowide", "Orbitron", "sans-serif"],
      },
    },
  },
  plugins: [],
};
