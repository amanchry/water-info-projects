/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "space-grotesk": ["var(--font-space-grotesk)", "sans-serif"],
      },
      colors: {
        primary1: "#264C73",
        primary2: "#165286",
        secondary1: "#842828",
        secondary2: "#267029",
        secondary3: "#977E2E",
        gray1: "#8B8D98",
        cardtext: "#32669A",
      },
    },
  },
  plugins: [],
  important: true,
};