/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // This looks for HTML at the project root
    "./index.html", 
    
    // THIS LINE IS THE MOST IMPORTANT: It tells Tailwind to scan everything 
    // inside the 'src' folder (and all its sub-folders) for class names 
    "./src/**/*.{js,ts,jsx,tsx,vue,svelte}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}