import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--c-bg)",
        surface: "var(--c-surface)",
        "surface-2": "var(--c-surface-2)",
        border: "var(--c-border)",
        text: "var(--c-text)",
        "text-muted": "var(--c-text-muted)",
        "text-subtle": "var(--c-text-subtle)",
        primary: {
          DEFAULT: "var(--c-primary)",
          hover: "var(--c-primary-hover)",
          pressed: "var(--c-primary-pressed)",
        },
        focus: "var(--c-focus)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
      },
    },
  },
};

export default config;
