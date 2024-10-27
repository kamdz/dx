import { includeIgnoreFile } from '@eslint/compat';
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  includeIgnoreFile(`${process.cwd()}/.gitignore`),
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  eslint.configs.recommended,
  {
    ...importPlugin.flatConfigs.recommended,
    ...importPlugin.flatConfigs.typescript
  },
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    rules: {
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off'
    }
  },
  eslintPluginPrettierRecommended
];
