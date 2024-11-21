import eslintJs from '@eslint/js'
import pluginJest from 'eslint-plugin-jest'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    {
        ignores: ['.swc/**', 'dist/**'],
    },
    {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    eslintJs.configs.recommended,
    reactPlugin.configs.flat.recommended,
    tseslint.configs.eslintRecommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    eslintPluginPrettierRecommended,
    {
        plugins: {
            /** "eslint-plugin-react-hooks" doesn't work with TypeScript */
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            'react-hooks': hooksPlugin,
            'simple-import-sort': simpleImportSort,
        },
        /** "eslint-plugin-react-hooks" doesn't work with TypeScript */
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        rules: {
            /** "eslint-plugin-react-hooks" doesn't work with TypeScript */
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ...hooksPlugin.configs.recommended.rules,
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
            '@typescript-eslint/prefer-nullish-coalescing': 'off',
            'react/react-in-jsx-scope': 'off',
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
    {
        files: ['tests/**/*.(spec|test).*'],
        plugins: {
            jest: pluginJest,
        },
        languageOptions: {
            globals: pluginJest.environments.globals.globals,
        },
        rules: {
            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/no-identical-title': 'error',
            'jest/prefer-to-have-length': 'warn',
            'jest/valid-expect': 'error',
        },
    },
)
