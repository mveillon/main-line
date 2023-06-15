// from https://levelup.gitconnected.com/how-to-add-a-custom-eslint-configuration-to-a-create-react-app-project-aea3f7c1d7af

module.exports = {
  env: {
    browser: true, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    es6: true, // Enable all ECMAScript 6 features except for modules.
    jest: true, // Jest global variables like `it` etc.
    node: true // Defines things like process.env when generating through node
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jest/recommended",
    "plugin:testing-library/react",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module" // Allows for the use of imports
  },
  plugins: [
    "@typescript-eslint"
  ],
  root: true, // For configuration cascading.
  rules: {
    indent: [
      "error",
      2,
      {
        SwitchCase: 1
      }
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_"
      }
    ],
    "@typescript-eslint/ban-ts-comment": "off",
    "jest/no-conditional-expect": "off",
    "react-hooks/exhaustive-deps": "off"
  },
  settings: {
    react: {
      version: "detect" // Detect react version
    }
  }
};