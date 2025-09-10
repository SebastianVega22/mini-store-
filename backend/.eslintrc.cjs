module.exports = {
  env: { node: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:promise/recommended',
    'plugin:n/recommended',
    'plugin:import/recommended',
    'prettier'
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'script' },
  rules: { 'n/no-unsupported-features/es-builtins': 'off' }
};
