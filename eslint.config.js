import baseConfig from './packages/eslint-config/src/index.js';

export default [
  ...baseConfig,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/postgres_data/**',
      '**/redis_data/**',
    ],
  },
];
