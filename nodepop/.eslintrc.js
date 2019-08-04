module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "no-var": 2,
    "prefer-const": 2,
    "no-debugger": 2,
    "no-console": [2, { allow: ["info", "error"] }]
  }
};
