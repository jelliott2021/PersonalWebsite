module.exports = {
  root: true,
  plugins: ['prettier', 'react', 'import'],
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    project: ['./tsconfig.json', './e2e/tsconfig.json'],
    tsconfigRootDir: __dirname,
    warnOnUnsupportedTypeScriptVersion: false,
  },
  ignorePatterns: ['build/', 'coverage/', 'node_modules/', 'playwright-report/', '*.js', '*.cjs'],
  rules: {
    'prettier/prettier': 'warn',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'src/**/*.test.{ts,tsx}',
          'src/setupTests.ts',
          'src/test-utils/**',
          'e2e/**',
          'playwright.config.ts',
        ],
      },
    ],
    'import/prefer-default-export': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow' },
      // Components, hooks, and module-level constants.
      { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
      { selector: 'function', format: ['camelCase', 'PascalCase'] },
      { selector: 'typeLike', format: ['PascalCase'] },
      { selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE'] },
      // Third-party payloads (snake_case JSON) and CSS custom properties.
      { selector: ['property', 'objectLiteralProperty', 'typeProperty'], format: null },
      { selector: 'import', format: null },
    ],
  },
  overrides: [
    {
      files: ['e2e/**/*.ts', 'playwright.config.ts'],
      rules: {
        // Playwright tests are top-level await style and use test fixtures.
        'no-await-in-loop': 'off',
        'no-empty-pattern': 'off',
      },
    },
  ],
};
