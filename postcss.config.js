/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},   // <- v4 plugin
    // If you actively use @import in CSS, add this above:
    // "postcss-import": {},
  },
};
