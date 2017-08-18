module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:unicorn/recommended",
    "prettier"
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
    allowImportExportEverywhere: false,
    codeFrame: false,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  plugins: ["unicorn", "prettier"],
  rules: {
    "capitalized-comments": "off",
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
        singleQuote: true,
        semi: false,
        useTabs: true
      }
    ]
  }
};
