import type { Config } from "tailwindcss";

export default {
  content: [
    "../../apps/*/app/**/*.{js,jsx,ts,tsx}",
    "../../packages/*/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
