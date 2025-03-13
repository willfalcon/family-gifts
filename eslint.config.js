import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    plugins: ['@tanstack/eslint-plugin-query'],
    rules: {
      noUnusedVars: 'warn',
    },
  },
]);
