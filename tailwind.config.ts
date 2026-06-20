import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#64748b",
        line: "#d7dee8",
        cloud: "#f7f8fb",
        cobalt: "#2454ff",
        teal: "#0f766e",
        coral: "#e85d4f",
        amber: "#b7791f"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(17, 24, 39, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
