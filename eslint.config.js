// eslint.config.js
import js from '@eslint/js';

export default [
  // Ignore non-source directories
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
  },
  // Apply recommended JS rules to source files
  {
    ...js.configs.recommended,
    files: ['src/**/*.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
