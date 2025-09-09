// colors.js

const tintColorLight = '#725437'; // coffee brown
const tintColorDark = '#c19a6b';  // latte brown

export const Colors = {
  light: {
    text: '#0c0907',        // almost black
    background: '#f0e2cd',  // light cream
    tint: tintColorLight,   // buttons / highlights
    icon: '#a39789',        // taupe gray
    input: '#f9f2e6',       // beige input fields
    tabIconDefault: '#a39789',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#f9f2e6',        // light cream
    background: '#0c0907',  // espresso black
    tint: tintColorDark,    // latte brown
    icon: '#8c7c6e',        // muted taupe-gray
    input: '#3a2f27',       // dark espresso input
    tabIconDefault: '#8c7c6e',
    tabIconSelected: tintColorDark,
  },
};
