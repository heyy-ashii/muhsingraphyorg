import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        "canvas-2": "rgb(var(--canvas-2) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--ink-soft) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        gold: {
          DEFAULT: "rgb(var(--gold) / <alpha-value>)",
          bright: "rgb(var(--gold-bright) / <alpha-value>)",
          deep: "rgb(var(--gold-deep) / <alpha-value>)",
        },
        coral: "rgb(var(--coral) / <alpha-value>)",
        forest: "rgb(var(--forest) / <alpha-value>)",
        lime: "rgb(var(--lime) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-sans)", "Poppins", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Poppins", "system-ui", "sans-serif"],
        mono: ["var(--font-sans)", "Poppins", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "Amiri", "serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.8rem, 7vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.2rem, 5vw, 3.6rem)", { lineHeight: "1.04", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(1.6rem, 3vw, 2.4rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        "ultra-wide": "0.14em",
        "mega-wide": "0.2em",
      },
      maxWidth: {
        shell: "1280px",
      },
      backgroundImage: {
        "gold-sheen": "none",
      },
      boxShadow: {
        whisper: "0 1px 2px rgba(17,17,17,0.04)",
        gallery: "0 12px 40px -28px rgba(17,17,17,0.22)",
        gilding: "0 1px 2px rgba(17,17,17,0.06)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
        velvet: "cubic-bezier(0.65, 0.05, 0.36, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0) rotate(0deg)" },
          "50%": { transform: "translate3d(0,-2.2%,0) rotate(1.4deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 46s linear infinite",
        "marquee-slow": "marquee 72s linear infinite",
        "marquee-fast": "marquee 28s linear infinite",
        shimmer: "shimmer 3.4s ease-in-out infinite",
        drift: "drift 22s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.6s cubic-bezier(0.22,1,0.36,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
