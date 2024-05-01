module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:playwright/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  parserOptions: {
    project: true,
    tsConfig: './tsconfig.test.json',
  },
  rules: {
    ['@typescript-eslint/no-explicit-any']: 0,
    ['@typescript-eslint/no-floating-promises']: 2,
  },
};
