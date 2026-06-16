/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Roboto", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        "firm-navy": {
          DEFAULT: "#1E4C7E",
          light: "#2A6299",
          dark: "#153A61",
        },
        "firm-lime": {
          DEFAULT: "#AED136",
          light: "#B5DD5A",
          dark: "#7FB01E",
        },
        "firm-destructive": {
          DEFAULT: "#FF6158",
          dark: "#E5554D",
        },
        "firm-foreground": "var(--foreground)",
        "firm-muted": {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        "firm-border": "var(--border)",
        "firm-card": "var(--card)",
        "firm-background": "var(--background)",
        "firm-ring": "var(--ring)",
      },
      borderRadius: {
        firm: "var(--radius)",
        "firm-sm": "var(--radius-sm)",
      },
      boxShadow: {
        "firm-navy": "0 4px 14px rgba(29, 76, 126, 0.2)",
        "firm-lime": "0 4px 14px rgba(174, 209, 54, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
