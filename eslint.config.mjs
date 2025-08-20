import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import paths from 'eslint-plugin-paths';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import _import from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
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
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/eslint.config.js', '**/scripts', 'jest.config.js'],
  },
  ...fixupConfigRules(
    compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:import/recommended',
      'plugin:prettier/recommended',
    ),
  ),
  {
    plugins: {
      paths,
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(_import),
      'unused-imports': unusedImports,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        project: 'tsconfig.json',
      },
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },

      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },

    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      'import/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index', 'type'],
            'object',
          ],

          pathGroups: [
            {
              pattern: '*\\.module',
              group: 'sibling',

              patternOptions: {
                matchBase: true,
              },

              position: 'after',
            },
            {
              pattern: '*\\.service',
              group: 'sibling',

              patternOptions: {
                matchBase: true,
              },

              position: 'after',
            },
            {
              pattern: '*\\.controller',
              group: 'sibling',

              patternOptions: {
                matchBase: true,
              },

              position: 'after',
            },
            {
              pattern: '*\\.model',
              group: 'sibling',

              patternOptions: {
                matchBase: true,
              },

              position: 'after',
            },
            {
              pattern: '*\\.interface',
              group: 'sibling',

              patternOptions: {
                matchBase: true,
              },

              position: 'after',
            },
            {
              pattern: '*\\.dto',
              group: 'sibling',

              patternOptions: {
                matchBase: true,
              },

              position: 'after',
            },
            {
              pattern: '*\\.response-dto',
              group: 'sibling',

              patternOptions: {
                matchBase: true,
              },

              position: 'after',
            },
            {
              pattern: '*\\.controller',
              group: 'sibling',

              patternOptions: {
                matchBase: true,
              },

              position: 'after',
            },
            {
              pattern: '*\\.const',
              group: 'sibling',

              patternOptions: {
                matchBase: true,
              },

              position: 'after',
            },
            {
              pattern: '*\\.enum',
              group: 'sibling',

              patternOptions: {
                matchBase: true,
              },

              position: 'after',
            },
          ],

          'newlines-between': 'never',
        },
      ],

      'import/named': 'off',
      'no-restricted-imports': 'off',

      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: ['src'],
        },
      ],

      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'paths/alias': 'error',
    },
  },
];
