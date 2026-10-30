import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sandigan: {
          navy: {
            DEFAULT: "#101B35",
            50: "#F2F4F8",
            100: "#DDE3ED",
            200: "#B8C5DB",
            300: "#8FA3C4",
            400: "#607DA5",
            500: "#3D5D8A",
            600: "#27426E",
            700: "#1A2E52",
            800: "#101B35",
            900: "#0A1122",
            950: "#050812",
          },
          teal: {
            DEFAULT: "#159A9A",
            50: "#EDF9F9",
            100: "#D4F1F1",
            200: "#ACE4E4",
            300: "#75D1D1",
            400: "#3BB8B8",
            500: "#159A9A",
            600: "#107A7A",
            700: "#0D5E5E",
            800: "#0B4747",
            900: "#093838",
          },
          emerald: {
            DEFAULT: "#16845B",
            50: "#EDF8F3",
            100: "#D3EFE3",
            200: "#ABE0CB",
            300: "#75CAAA",
            400: "#3FAD85",
            500: "#16845B",
            600: "#116948",
            700: "#0D5238",
            800: "#0A3F2B",
            900: "#083122",
          },
          gold: {
            DEFAULT: "#D6AE57",
            50: "#FDFBF5",
            100: "#FAF3E4",
            200: "#F4E4C0",
            300: "#ECD196",
            400: "#E2BD6F",
            500: "#D6AE57",
            600: "#BD9338",
            700: "#96742A",
            800: "#735820",
            900: "#554118",
          },
          surface: {
            light: "#F8FAFC",
            cardLight: "#FFFFFF",
            dark: "#0B1224",
            cardDark: "#101B35",
            elevatedDark: "#172344",
          },
          border: {
            light: "#E2E8F0",
            dark: "#1F2D4E",
          },
          text: {
            primaryLight: "#0F172A",
            secondaryLight: "#475569",
            mutedLight: "#64748B",
            primaryDark: "#F8FAFC",
            secondaryDark: "#CBD5E1",
            mutedDark: "#94A3B8",
          }
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-manrope)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        'soft-sm': '0 1px 2px 0 rgba(16, 27, 53, 0.05)',
        'soft': '0 4px 6px -1px rgba(16, 27, 53, 0.07), 0 2px 4px -2px rgba(16, 27, 53, 0.05)',
        'soft-md': '0 10px 15px -3px rgba(16, 27, 53, 0.08), 0 4px 6px -4px rgba(16, 27, 53, 0.04)',
        'soft-lg': '0 20px 25px -5px rgba(16, 27, 53, 0.1), 0 8px 10px -6px rgba(16, 27, 53, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
