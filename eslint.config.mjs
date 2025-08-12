import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**'],
  },
  nextPlugin.flatConfig.coreWebVitals,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
];

