import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import unicornPlugin from "eslint-plugin-unicorn";
import tanstackQuery from '@tanstack/eslint-plugin-query'

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/build/**",
      "**/dist/**",
      "**/public/**",
      "**/*.mjs",
      "**/*.json",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    extends: [
      tanstackQuery.configs.recommended
    ],
    plugins: {
      import: importPlugin,
      jsxA11y: jsxA11yPlugin,
      perfectionist: perfectionistPlugin,
      prettier: prettierPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      sonarjs: sonarjsPlugin,
      ts: tsPlugin,
      unicorn: unicornPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      "arrow-body-style": ["error", "as-needed"],

      eqeqeq: ["error", "always"],
      "import/order": [
        "error",
        {
          alphabetize: { caseInsensitive: true, order: "asc" },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
        },
      ],

      // General
      "no-console": "warn",
      "no-debugger": "error",

      "no-param-reassign": "error",
      "no-shadow": "error",

      "perfectionist/sort-array-includes": "error",
      // Perfectionist
      "perfectionist/sort-objects": "error",
      "prefer-const": "error",
      "prettier/prettier": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      // React
      "react/jsx-boolean-value": ["error", "always"],

      "react/jsx-curly-brace-presence": ["error", "never"],
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-sort-props": [
        "error",
        { callbacksLast: true, shorthandFirst: true },
      ],
      "react/react-in-jsx-scope": "off",
      // SonarJS
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-identical-functions": "warn",
      "ts/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "unicorn/no-for-loop": "error",

      "unicorn/no-useless-undefined": "error",

      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/query/stable-query-client': 'error',
      '@tanstack/query/no-rest-destructuring': 'warn'

    },
    settings: {
      react: { version: "detect" },
    },
  },
];
