/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        slab: ['Roboto Slab', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
        premium: ['Cinzel', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
