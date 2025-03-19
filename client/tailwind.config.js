/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        typing: {
          'from': { width: '0%' },
          'to': { width: '100%' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      animation: {
        "gradient-x": "gradient-x 5s ease infinite",
        typing: 'typing 4s steps(40, end), blink 0.75s step-end infinite',
        fadeIn: 'fadeIn 2s ease-in',
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left bottom",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right bottom",
          },
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
