// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "[text-align:justify]",
    "[text-justify:inter-word]",
    "[hyphens:auto]",
  ],
  theme: { extend: {} },
  plugins: [],
};
