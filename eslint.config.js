// @ts-check

// Core
const eslint = require("@eslint/js");
const globals = require("globals");
const tsEslint = require("typescript-eslint");

// Plugins
const reactRecommended = require("eslint-plugin-react/configs/recommended");
const hooksPlugin = require("eslint-plugin-react-hooks");
const nextPlugin = require("@next/eslint-plugin-next");

module.exports = tsEslint.config(
  {
    ignores: [".next/*"],
  },
  eslint.configs.recommended,
  ...tsEslint.configs.strict,
  ...tsEslint.configs.stylistic,
  reactRecommended,
  {
    rules: {
      // NextJS will handle this for us
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect", // You can add this if you get a warning about the React version when you lint
      },
    },
  },
  {
    plugins: {
      "react-hooks": hooksPlugin,
    },
    rules: {
      .../** @type {object}*/ (hooksPlugin.configs.recommended.rules),
    },
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    // REVIEW: Why am I not seeing this error in tsc cli?
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    // Teat some some config files with forced .js extension as common-js
    files: ["next.config.js", "eslint.config.js", "prettier.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
  },
);
