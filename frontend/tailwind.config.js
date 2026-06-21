/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#1e40af", // Harmonious premium blue
        "background-light": "#f8fafc",
        "background-dark": "#0f172a",
      },
      fontFamily: {
        "sans": ["Roboto", "sans-serif"],
        "display": ["Roboto", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
