/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    colors: {
      background: "#F0F0F0",
      primary: "#202020",
      accent: "#909090",
      links: "#00BFA5",
      borders: "#E0E0E0",
    },
    fontFamily: {
      inconsolata: ["Inconsolata", "Courier New", "Courier", "monospace"],
      "source-code-pro": [
        "Source Code Pro",
        "Courier New",
        "Courier",
        "monospace",
      ],
    },
    extend: {},
  },
  plugins: [],
};
