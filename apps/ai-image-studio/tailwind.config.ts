import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#121417",
        panel: "#1a1f24",
        border: "#2a3139",
        accent: "#7cc4ff"
      }
    }
  },
  darkMode: "class"
};

export default config;
