import eslint from '@eslint/js';
import json from '@eslint/json';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.ts', '**/*js', '**/*.mjs'],
    ...perfectionist.configs['recommended-alphabetical'],
  },
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  {
    files: ['**/*.json'],
    ignores: ['package-lock.json'],
    language: 'json/json',
    plugins: {
      json,
    },
    ...json.configs.recommended,
  },
  {
    files: ['**/*.jsonc'],
    language: 'json/jsonc',
    plugins: {
      json,
    },
    ...json.configs.recommended,
  },
  {
    files: ['**/*.json5'],
    language: 'json/json5',
    plugins: {
      json,
    },
    ...json.configs.recommended,
  },
);
