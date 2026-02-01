/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#dbe8ff",
          200: "#bfd4ff",
          300: "#97b7ff",
          400: "#6f95ff",
          500: "#4f6bff",
          600: "#3a4df2",
          700: "#2f3ad0",
          800: "#2a33a7",
          900: "#262f86",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
