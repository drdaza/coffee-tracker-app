// colors.js

const tintColorLight = "#725437"; // coffee brown
const tintColorDark = "#c19a6b"; // latte brown

export const Colors = {
  light: {
    text: "#0c0907", // almost black
    background: "#f0e2cd", // light cream
    tint: tintColorLight, // buttons / highlights
    icon: "#a39789", // taupe gray
    input: "#f9f2e6", // beige input fields
    cardBackground: "#f9f2e6", // card background (slightly lighter)
    tabIconDefault: "#a39789",
    tabIconSelected: tintColorLight,
    error: "#c0392b", // dark red for errors
    errorBackground: "#fdeaea", // light red background
    border: "rgba(128, 128, 128, 0.3)", // subtle border color
  },
  dark: {
    text: "#f9f2e6", // light cream
    background: "#0c0907", // espresso black
    tint: tintColorDark, // latte brown
    icon: "#8c7c6e", // muted taupe-gray
    input: "#3a2f27", // dark espresso input
    cardBackground: "#1a1410", // card background (slightly lighter than bg)
    tabIconDefault: "#8c7c6e",
    tabIconSelected: tintColorDark,
    error: "#e74c3c", // brighter red for dark mode
    errorBackground: "#3d1f1f", // dark red background
    border: "rgba(128, 128, 128, 0.3)", // subtle border color
  },
};
