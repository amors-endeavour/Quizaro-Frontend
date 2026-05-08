import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#2D3748",
        brand: "#5A67D8",
        brandHover: "#4C51BF",
        bg: "#FFFFFF",
        surface: "#F7FAFC",
        muted: "#A0AEC0",
        error: "#E53E3E",
        success: "#38A169",
        warning: "#D69E2E",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        full: "9999px",
      },
      spacing: {
        "sp-1": "4px",
        "sp-2": "8px",
        "sp-3": "12px",
        "sp-4": "16px",
        "sp-5": "24px",
        "sp-6": "32px",
        "sp-7": "48px",
        "sp-8": "64px",
      },
      fontFamily: {
        display: ["var(--font-barlow)", "system-ui", "sans-serif"],
        heading: ["var(--font-barlow)", "system-ui", "sans-serif"],
        body: ["var(--font-barlow)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        display: ["48px", { lineHeight: "1.1", fontWeight: "700" }],
        h1: ["36px", { lineHeight: "1.15", fontWeight: "700" }],
        h2: ["28px", { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["24px", { lineHeight: "1.25", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        sm: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        mono: ["14px", { lineHeight: "1.6", fontWeight: "400" }],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px rgba(0, 0, 0, 0.07)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px rgba(0, 0, 0, 0.15)",
        focus: "0 0 0 3px rgba(90, 103, 216, 0.4)",
        inner: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
