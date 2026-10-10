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
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        arabic: ["var(--font-arabic)", "Amiri", "serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3.4rem, 11vw, 11rem)", { lineHeight: "0.92", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.8rem, 7vw, 6.5rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2.1rem, 4.4vw, 4rem)", { lineHeight: "1.04", letterSpacing: "-0.015em" }],
      },
      letterSpacing: {
        "ultra-wide": "0.42em",
        "mega-wide": "0.6em",
      },
      maxWidth: {
        shell: "1560px",
      },
      backgroundImage: {
        "gold-sheen":
          "linear-gradient(100deg, transparent 20%, rgba(212,175,55,0.55) 45%, rgba(229,186,115,0.9) 50%, rgba(212,175,55,0.55) 55%, transparent 80%)",
      },
      boxShadow: {
        whisper: "0 1px 2px rgba(18,18,18,0.03), 0 12px 40px -24px rgba(18,18,18,0.18)",
        gallery: "0 40px 120px -60px rgba(18,18,18,0.45)",
        gilding: "0 0 0 1px rgba(200,162,97,0.35), 0 30px 80px -40px rgba(200,162,97,0.35)",
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
        shimmer: "shimmer 3.4s ease-in-out infinite",
        drift: "drift 22s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.6s cubic-bezier(0.22,1,0.36,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
