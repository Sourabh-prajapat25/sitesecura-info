import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#080D19",
          secondary: "#0D1424",
          card: "#111C30",
          cardHover: "#16233B",
          subtle: "#0F182A",
        },
        primary: {
          DEFAULT: "#4F8CFF",
          hover: "#3B7BE8",
          glow: "rgba(79, 140, 255, 0.25)",
        },
        secondary: {
          DEFAULT: "#35D6E8",
          hover: "#22C1D4",
          glow: "rgba(53, 214, 232, 0.25)",
        },
        foreground: {
          DEFAULT: "#F5F7FF",
          muted: "#A4B0C4",
          subtle: "#6E7E99",
        },
        border: {
          DEFAULT: "rgba(79, 140, 255, 0.12)",
          subtle: "rgba(255, 255, 255, 0.07)",
          highlight: "rgba(79, 140, 255, 0.35)",
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#38BDF8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern": "linear-gradient(to right, rgba(79, 140, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(79, 140, 255, 0.05) 1px, transparent 1px)",
        "gradient-brand": "linear-gradient(135deg, #4F8CFF 0%, #35D6E8 100%)",
        "hero-glow": "radial-gradient(circle at 50% 0%, rgba(79, 140, 255, 0.15) 0%, rgba(53, 214, 232, 0.05) 40%, transparent 70%)",
      },
      animation: {
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
