const {
  words,
  regularExpressions,
  wordRegularExpressions,
} = require('./eslint-spellcheck-dictionary');

module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:testing-library/react',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'eslint-spellcheck-dictionary.js',
    '.fttemplates',
    'node-modules',
    'storybook-static',
    'dist-css',
    'coverage',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: { react: { version: 'detect' } },
  plugins: [
    'react-refresh',
    'spellcheck',
    'promise',
    'sonarjs',
    'security',
    'prettier',
    'testing-library',
    'import',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:typescript-sort-keys/recommended',
      ],
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint', 'typescript-sort-keys'],
      rules: {
        // found as too strict for typescript familiarization curve
        // also couldn't get them to work with type inferences over typeof operator
        '@typescript-eslint/no-redundant-type-constituents': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',

        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/await-thenable': 'off',

        'react/prop-types': 'off', // Since we're using TypeScript
      },
    },
  ],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'spellcheck/spell-checker': [
      2,
      {
        comments: true,
        strings: true,
        identifiers: true,
        templates: true,
        lang: 'en_US',
        skipWords: words,
        skipIfMatch: regularExpressions,
        skipWordIfMatch: wordRegularExpressions,
        minLength: 3,
      },
    ],
    complexity: ['error', { max: 15 }],
    // triggering when using within for queries or when no direct screen.someQuery call which is required for the ComponentPageObject pattern
    'testing-library/prefer-screen-queries': 'off',
    'prettier/prettier': 'error',
    'testing-library/render-result-naming-convention': 'off',
    'no-duplicate-imports': 'error',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-alert': 'warn',
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node "builtin" modules like fs, path etc.
          'external', // "external" modules like lodash, react etc.
          'internal', // "internal" modules
          ['parent', 'sibling', 'index'], // Parent, sibling, and index files
        ],
        pathGroups: [
          {
            pattern: '@/**', // Adjust this pattern to match your project's absolute paths
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin', 'external'],
        'newlines-between': 'always', // Ensure new lines between groups
      },
    ],
  },
};
