module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:react/recommended',
    'eslint:recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    semi: 'error',
    'no-unused-vars': 'warn',
  },
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'createElement',
      version: 'detect',
      flowVersion: '0.53'
    },
  },
};
