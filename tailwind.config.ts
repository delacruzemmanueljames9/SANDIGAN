import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sandigan: {
          midnight: "#101B35",
          teal: "#159A9A",
          emerald: "#16845B",
          gold: "#D6AE57",
          darkNavy: "#0B132B",
          slate: "#1C2541",
          softTeal: "#E6F6F6",
          softEmerald: "#E8F5EE",
          softGold: "#FBF7ED",
        },
        tk: {
          lightblue: "#DCEAF7",
          lavender: "#DCD6F7",
          cream: "#F6E8D6",
          softgreen: "#DCEFE5",
          deepblue: "#31556B",
          darkblue: "#1E3645",
          midnight: "#11222E",
          teal: "#4A90A4",
          emerald: "#2E7D5B",
          violet: "#6C5CE7",
          coral: "#E66767",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-manrope)", "Manrope", "sans-serif"],
        display: ["var(--font-manrope)", "Manrope", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(49, 85, 107, 0.08)",
        card: "0 10px 30px -4px rgba(49, 85, 107, 0.12)",
        glow: "0 0 25px rgba(220, 214, 247, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
