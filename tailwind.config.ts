import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          green: "#10E7B2",
          cyan: "#16D4FF",
          blue: "#28B8FF",
          navy: "#03153F",
          deep: "#041D63"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(3, 21, 63, 0.10)"
      },
      borderRadius: {
        xl: "0.75rem"
      }
    }
  },
  plugins: []
};

export default config;
