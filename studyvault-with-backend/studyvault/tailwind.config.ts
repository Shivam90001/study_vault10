import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17213B",
        paper: "#FAF9F4",
        panel: "#FFFFFF",
        brand: {
          DEFAULT: "#2E4374",
          dark: "#1C2B4F",
          light: "#4A5F94",
        },
        amber: {
          DEFAULT: "#D98E3B",
          dark: "#B8712A",
        },
        brick: "#B65C3D",
        sage: "#5C7A5E",
        line: "#E3DFD3",
        muted: "#6B7280",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-plex)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};
export default config;
