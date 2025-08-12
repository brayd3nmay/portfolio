import nextPlugin from '@next/eslint-plugin-next';

export default [
  nextPlugin.flatConfig.coreWebVitals,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
];

