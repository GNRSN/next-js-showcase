// @ts-check

// Core
const eslint = require("@eslint/js");
const globals = require("globals");
const tsEslint = require("typescript-eslint");

// Plugins
const reactRecommended = require("eslint-plugin-react/configs/recommended");
const compilerPlugin = require("eslint-plugin-react-compiler");
const nextPlugin = require("@next/eslint-plugin-next");

// Utils
const { FlatCompat } = require("@eslint/eslintrc");
const { fixupConfigRules } = require("@eslint/compat");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

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
  // REVIEW: Possibly compiler plugin replaces the need for this?
  /** @see https://eslint.org/blog/2024/05/eslint-compatibility-utilities/#using-with-flatcompat */
  ...fixupConfigRules(compat.extends("plugin:react-hooks/recommended")),
  {
    plugins: {
      "react-compiler": compilerPlugin,
    },
    rules: {
      "react-compiler/react-compiler": "warn",
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
