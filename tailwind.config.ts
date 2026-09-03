import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "tip-orange": "#F97316",
        "tip-dark": "#0C0A09",
        "tip-card": "#1C1917",
        "tip-gold": "#FBBF24",
      },
    },
  },
  plugins: [],
};
export default config;
