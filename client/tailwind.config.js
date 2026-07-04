/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0a0a0d",
          900: "#111114",
          850: "#16161a",
          800: "#1c1c21",
          700: "#26262d",
          600: "#33333c",
        },
        accent: {
          DEFAULT: "#ff6b00",
          light: "#ff8c3d",
          dark: "#cc5500",
          50: "#fff3ea",
        },
        gold: "#d4af37",
        silver: "#c0c0c8",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        heading: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(255, 107, 0, 0.25)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        marquee: "marquee 25s linear infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
