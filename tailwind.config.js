/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Paleta Infantil (6-9 años)
        mint: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        sol: {
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
        },
        coral: {
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
        },
        // Paleta Intermedio (10-13 años)
        electric: {
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        turquoise: {
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
        },
        // Paleta Juvenil (14+ años)
        violet: {
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
        },
        magenta: {
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Nunito", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "game": "0 4px 0 0 rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.12)",
        "game-hover": "0 6px 0 0 rgba(0,0,0,0.15), 0 12px 32px rgba(0,0,0,0.15)",
        "game-active": "0 1px 0 0 rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)",
        "card": "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)",
        "float": "0 20px 60px rgba(0,0,0,0.15)",
      },
      animation: {
        "fadeIn": "fadeIn 0.3s ease-out forwards",
        "scaleUp": "scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slideUp": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slideDown": "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "wiggle": "wiggle 0.5s ease-in-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        "shake": "shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both",
        "pop": "pop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "celebration": "celebration 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "star-appear": "starAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "card-flip": "cardFlip 0.5s ease-in-out forwards",
        "shimmer": "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleUp: {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-10deg)" },
          "75%": { transform: "rotate(10deg)" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
        pop: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "70%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        celebration: {
          "0%": { transform: "scale(0.8) rotate(-5deg)", opacity: "0" },
          "50%": { transform: "scale(1.15) rotate(3deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        starAppear: {
          "0%": { transform: "scale(0) rotate(-30deg)", opacity: "0" },
          "60%": { transform: "scale(1.3) rotate(5deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        cardFlip: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      scale: {
        "102": "1.02",
        "98": "0.98",
      },
      screens: {
        xs: "360px",
      },
    },
  },
  plugins: [],
};
