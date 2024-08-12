import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: ['**/*.json', '**/pnpm-lock.yaml', '**/*.md', '**/.eslintignore', '**/test-results', '**/playwright-report', 'playwright/.cache']
  },
  ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:playwright/playwright-test'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier
    },

    languageOptions: {
      globals: {
        ...globals.browser
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'script'
    },

    rules: {
      'no-unused-expressions': 'error',
      'sort-keys': 'off',

      indent: [
        'error',
        2,
        {
          SwitchCase: 1
        }
      ],

      'no-duplicate-imports': [
        'error',
        {
          includeExports: true
        }
      ],

      'comma-dangle': ['error', 'never'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': 'error',

      'max-len': [
        'warn',
        {
          code: 150,
          tabWidth: 2
        }
      ],

      'prettier/prettier': ['error']
    }
  }
];
