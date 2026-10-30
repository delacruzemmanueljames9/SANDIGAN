import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sandigan: {
          navy: "#101B35",
          "navy-light": "#1A2A4E",
          "navy-dark": "#0B1224",
          teal: "#159A9A",
          "teal-hover": "#117D7D",
          "teal-light": "#E6F6F6",
          emerald: "#16845B",
          "emerald-light": "#E8F5F0",
          gold: "#D6AE57",
          "gold-light": "#FDF8ED",
          surface: {
            light: "#F8FAFC",
            dark: "#0F172A",
          },
          border: {
            light: "#E2E8F0",
            dark: "#1E293B",
          }
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
