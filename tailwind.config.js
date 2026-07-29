/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#E7E4D8",
        card: "#F7F5EC",
        ink: "#16233B",
        muted: "#6B6A5C",
        ledgerGreen: "#2E5E45",
        brass: "#9C7A2A",
        slateBlue: "#35566E",
        sealRed: "#9B2F22",
        line: "#CFC9B6",
        track: "#DAD6C6",
        tagbg: "#DEDACB",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Source Serif 4'", "serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
