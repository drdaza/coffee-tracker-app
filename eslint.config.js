// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      "dist/*",
      "bun.lock",
      "node_modules/*",
      ".expo/*",
      "web-build/*",
      "*.tsbuildinfo",
    ],
  },
]);
