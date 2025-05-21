// eslint.config.js

import js from '@eslint/js';
import parserTs from '@typescript-eslint/parser';
import pluginTs from '@typescript-eslint/eslint-plugin';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginNext from '@next/eslint-plugin-next';
import pluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    js.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: parserTs,
            parserOptions: {
                project: ['./tsconfig.json'],
                sourceType: 'module',
                ecmaVersion: 'latest',
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': pluginTs,
            react: pluginReact,
            'react-hooks': pluginReactHooks,
            '@next/next': pluginNext,
            prettier: pluginPrettier,
        },
        rules: {
            ...pluginTs.configs['recommended-type-checked'].rules,
            ...pluginReact.configs.recommended.rules,
            ...pluginNext.configs.recommended.rules,
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'prettier/prettier': 'warn',
        },
    },
];
