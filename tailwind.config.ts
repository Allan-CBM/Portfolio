import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  // Resolve relative to this file, so the build works from any working directory.
  content: { relative: true, files: ["./src/**/*.{ts,tsx}"] },
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", xl: "3rem" },
      screens: { "2xl": "1600px" },
    },
    extend: {
      colors: {
        background: withAlpha("--background"),
        foreground: withAlpha("--foreground"),
        card: { DEFAULT: withAlpha("--card"), foreground: withAlpha("--foreground") },
        border: withAlpha("--border"),
        input: withAlpha("--border"),
        ring: withAlpha("--accent"),
        muted: { DEFAULT: withAlpha("--card"), foreground: withAlpha("--muted") },
        accent: { DEFAULT: withAlpha("--accent"), foreground: withAlpha("--background") },
        secondary: { DEFAULT: withAlpha("--secondary"), foreground: withAlpha("--foreground") },
        primary: { DEFAULT: withAlpha("--foreground"), foreground: withAlpha("--background") },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(3.75rem, 13vw, 15rem)", { lineHeight: "0.84", letterSpacing: "-0.055em" }],
        "display-xl": ["clamp(3rem, 8.4vw, 9.5rem)", { lineHeight: "0.9", letterSpacing: "-0.045em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 6.5rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-md": ["clamp(2rem, 4vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-sm": ["clamp(1.5rem, 2.6vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
      },
      letterSpacing: {
        label: "0.22em",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "marquee-reverse": { from: { transform: "translateX(-50%)" }, to: { transform: "translateX(0)" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-5%, 4%)" },
          "40%": { transform: "translate(4%, -6%)" },
          "60%": { transform: "translate(-3%, 2%)" },
          "80%": { transform: "translate(6%, -2%)" },
        },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        "marquee-reverse": "marquee-reverse var(--marquee-duration, 40s) linear infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        grain: "grain 8s steps(8) infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
