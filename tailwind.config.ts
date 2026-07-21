import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05060a",
          900: "#0a0c14",
          800: "#10131f",
          700: "#161a2b",
          600: "#1f2438",
        },
        brand: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          violet: "#8b5cf6",
          pink: "#ec4899",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(34,211,238,0.45)",
        card: "0 8px 40px -12px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
