import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        surface: "var(--surface)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        gold: "var(--gold)",
        "gold-soft": "var(--gold-soft)",
        success: "var(--success)",
        "focus-ring": "var(--focus-ring)",
      },
      borderRadius: {
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(0,0,0,.35)",
        lift: "0 10px 30px rgba(0,0,0,.35)",
      },
      maxWidth: {
        container: "var(--container-max)",
      },
      spacing: {
        gutter: "var(--gutter)",
        "section-y": "var(--section-y)",
      },
    },
  },
};

export default config;
