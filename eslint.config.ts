import { FlatCompat } from "@eslint/eslintrc";
import stylistic from "@stylistic/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vitest from "@vitest/eslint-plugin";
import importAccess from "eslint-plugin-import-access/flat-config";
import solid from "eslint-plugin-solid";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: "/work",
});

export default [
  {
    ignores: [
      "build",
      "**/*.module.css.*",
    ],
  },
  {
    name: "ts environment",
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...vitest.environments.env.globals,
      },
    },
  },
  ...tseslint.config({
    ...tseslint.configs.base,
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "warn",
    },
  }),
  {
    name: "ts file",
    files: ["**/*.{ts,tsx}"],
    plugins: {
      tseslint: tseslint.plugin,
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/eol-last": ["warn", "always"],
      "@stylistic/indent": ["warn", 2, {
        ignoredNodes: [
          "TSTypeParameterInstantiation",
          "TSUnionType",
          "TSIntersectionType",
        ],
        SwitchCase: 1,
      }],
      "@stylistic/no-multiple-empty-lines": ["warn", {
        max: 1,
        maxEOF: 0,
        maxBOF: 0,
      }],
      "@stylistic/arrow-parens": ["warn", "always"],
      "@stylistic/arrow-spacing": "warn",
      "@stylistic/comma-dangle": ["warn", "always-multiline"],
      "@stylistic/keyword-spacing": "warn",
      "@stylistic/key-spacing": "warn",
      "@stylistic/member-delimiter-style": ["warn"],
      "@stylistic/newline-per-chained-call": "warn",
      "@stylistic/no-multi-spaces": "warn",
      "@stylistic/no-trailing-spaces": "warn",
      "@stylistic/object-curly-spacing": ["warn", "always"],
      "@stylistic/object-property-newline": ["warn", {
        allowAllPropertiesOnSameLine: true,
      }],
      "@stylistic/operator-linebreak": ["warn", "before"],
      "@stylistic/quotes": ["warn", "double"],
      "@stylistic/quote-props": ["warn", "as-needed"],
      "@stylistic/semi": "warn",
      "@stylistic/space-before-blocks": "warn",
      "@stylistic/space-before-function-paren": ["warn", {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      }],
      "@stylistic/space-infix-ops": "warn",
      "@stylistic/space-in-parens": "warn",
      "@stylistic/space-unary-ops": "warn",
      "@stylistic/type-annotation-spacing": "warn",
    },
  },
  ...compat.plugins("import"),
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "import-access": importAccess,
    },
    rules: {
      "import-access/jsdoc": ["error", {
        defaultImportability: "package",
      }],
    },
  },
  {
    name: "import order",
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "import/first": "warn",
      "import/newline-after-import": "warn",
      "import/order": ["warn", {
        groups: [["builtin", "external", "type"], ["internal", "parent", "sibling"], "index", "object"],
        pathGroups: [{
          pattern: "~/**",
          group: "internal",
          position: "before",
        }, {
          pattern: "./**.module.css",
          group: "index",
          position: "before",
        }],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        distinctGroup: false,
      }],
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_+$",
          varsIgnorePattern: "^_+$",
          caughtErrorsIgnorePattern: "^_+$",
          destructuredArrayIgnorePattern: "^_+$",
        },
      ],
    },
  },
  solid.configs["flat/typescript"],
  {
    name: "jsx",
    files: ["**/*.tsx"],
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/jsx-closing-bracket-location": "warn",
      "@stylistic/jsx-closing-tag-location": "off",
      "@stylistic/jsx-curly-brace-presence": ["warn", {
        children: "ignore",
        propElementValues: "always",
      }],
      "@stylistic/jsx-curly-spacing": "warn",
      "@stylistic/jsx-max-props-per-line": "warn",
      "@stylistic/jsx-one-expression-per-line": ["warn", { allow: "non-jsx" }],
      "@stylistic/jsx-self-closing-comp": "warn",
      "@stylistic/jsx-tag-spacing": ["warn", {
        closingSlash: "never",
        beforeSelfClosing: "always",
        afterOpening: "never",
        beforeClosing: "never",
      }],
      "@stylistic/jsx-wrap-multilines": ["warn", {
        declaration: "parens-new-line",
        assignment: "parens-new-line",
        return: "parens-new-line",
        arrow: "parens-new-line",
        condition: "parens-new-line",
        logical: "parens-new-line",
        prop: "parens-new-line",
        propertyValue: "parens-new-line",
      }],
    },
  },
  {
    name: "for tests",
    files: ["**/*.{test,spec}.{ts,tsx}"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.all.rules,
      "vitest/consistent-test-filename": "off",
      "vitest/expect-expect": ["warn", {
        assertFunctionNames: ["expect", "expectTypeOf"],
      }],
      "vitest/prefer-expect-assertions": "off",
    },
  },
];
