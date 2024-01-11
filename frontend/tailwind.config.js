/** @type {import('tailwindcss').Config} */
import { theme } from 'tailwindcss/defaultConfig'
export default {
 content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', theme.fontFamily.sans],
      }
    },
  },
  plugins: [],
}

