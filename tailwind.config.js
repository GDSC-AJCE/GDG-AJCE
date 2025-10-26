/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',  // Extra small devices (large phones)
        // sm: '640px' - default
        // md: '768px' - default
        // lg: '1024px' - default
        // xl: '1280px' - default
        // 2xl: '1536px' - default
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
