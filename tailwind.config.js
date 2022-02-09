module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "spotify-100": "#FFFFFF",
        "spotify-200": "#FFFFFF4D",
        "spotify-300": "#B3B3B3",
        "spotify-400": "#1DB954",
        "spotify-500": "#535353",
        "spotify-700": "#333333",
        "spotify-800": "#181818",
        "spotify-900": "#121212",
        "spotify-1000": "#00000080",
        "spotify-1100": "#00000099",
        "spotify-1200": "#000000B3",
        "spotify-1300": "#000000",
        "spotify-text-100": "#FFFFFF",
        "spotify-text-200": "#B3B3B3",
        "spotify-text-300": "#2E77D0",
        "spotify-text-400": "535353",
        "spotify-text-500": "#181818",
        "spotify-text-600": "#000000",
        "red-1000": "rgb(36, 2, 2)"
      },

      width: {
        header: "calc(100% - 16rem)",
        table: "calc(100vw - 315px)"
      },
      height: {
        navbarList: "calc(100vh-7rem)",
        "playlist-table": "calc(100vh - 16rem)"
      },

      maxWidth: {
        table: "calc(100vw - 315px)",
        "heading-text": "calc(50vw - 310px)"
      },

      gridTemplateColumns: {
        spotify100: "repeat(auto-fit,minmax(310px,1fr))",
        spotify200: "repeat(auto-fit,minmax(200px,1fr))"
      }
    }
  },
  plugins: [require("tailwind-scrollbar")],
  variants: {
    scrollbar: ["rounded"]
  }
};
