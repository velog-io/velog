/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  ignorePatterns: ["apps/**", "packages/**", "node_modules/", "dist/"],
  env: {
    node: true,
    jest: true,
  },
  globals: {
    react: true,
    jsx: true,
  },
};
