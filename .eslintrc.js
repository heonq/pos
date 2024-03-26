module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],

  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },

  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint', 'prettier'],

  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        'import/extensions': 'off',
        'class-methods-use-this': 'off',
        'no-process-exit': 'error',
        'max-depth': ['error', 2],
        'max-lines-per-function': ['error', 15],
        'no-unused-vars': 'off',
        'no-undef': 'off',
      },
    ],
  },
};
