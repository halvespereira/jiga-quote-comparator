import type { Config } from "tailwindcss";

export default {
  content: ["./**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        xxlg: "1400px",
      },
    },
  },
  plugins: [],
} satisfies Config;
