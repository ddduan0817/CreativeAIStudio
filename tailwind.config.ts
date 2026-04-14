import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: {
          bg: '#faf8f5',
          card: '#ffffff',
          border: '#e8e3db',
          'border-warm': '#ebe7e0',
        },
        literary: {
          primary: '#b08968',
          'primary-hover': '#9a7555',
          'primary-light': '#f3ece4',
          secondary: '#8b9a7e',
          'secondary-light': '#eef2eb',
        },
        'warm-text': {
          DEFAULT: '#3d3529',
          secondary: '#8a7e6d',
          muted: '#b5a99a',
          faint: '#c8bfb3',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
