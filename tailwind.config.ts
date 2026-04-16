import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070710",
          900: "#0b0b17",
          800: "#11111f",
          700: "#17172a",
          600: "#1f1f36",
          500: "#2a2a45",
          400: "#3a3a5a",
          300: "#5a5a80",
          200: "#9a9ab8",
          100: "#d4d4e6",
        },
        brand: {
          50: "#f1efff",
          100: "#e4dfff",
          200: "#c8bfff",
          300: "#a795ff",
          400: "#8b6cff",
          500: "#7043ff",
          600: "#5a28ff",
          700: "#4816d6",
          800: "#3512a3",
          900: "#220976",
        },
        accent: {
          cyan: "#29e5d6",
          pink: "#ff5acf",
          lime: "#c6ff5a",
          orange: "#ff8a3b",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Inter",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "ui-sans-serif",
          "Inter",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,94,255,0.3), 0 12px 40px -12px rgba(124,94,255,0.45)",
        panel: "0 10px 40px -20px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "mesh-grad":
          "radial-gradient(1200px 600px at 10% -10%, rgba(112,67,255,0.25), transparent 60%), radial-gradient(900px 500px at 110% 10%, rgba(41,229,214,0.18), transparent 60%), radial-gradient(700px 400px at 50% 120%, rgba(255,90,207,0.15), transparent 60%)",
        "grid-fade":
          "linear-gradient(to bottom, rgba(9,9,20,0) 0%, rgba(9,9,20,0.7) 60%, #070710 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.2s linear infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
