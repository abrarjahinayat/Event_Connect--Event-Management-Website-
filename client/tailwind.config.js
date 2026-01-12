/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "sirin-stencil": ["var(--font-sirin-stencil)"],
        "rubik-maps": ["var(--font-rubik-maps)"],
        "outfit": ["var(--font-outfit)"],
      },
    },
  },
  plugins: [],
};
