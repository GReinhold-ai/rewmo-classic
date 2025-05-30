module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'eslint:recommended', 'plugin:react/recommended'],
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'warn',
    'no-console': 'off',
  },
};
