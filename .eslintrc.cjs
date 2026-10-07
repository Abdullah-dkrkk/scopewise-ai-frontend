module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb', 'airbnb/hooks'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': { node: { extensions: ['.js', '.jsx'] } },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
    'react/jsx-no-bind': ['error', { allowFunctions: true, allowArrowFunctions: true }],
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/forbid-prop-types': 'off',
    'react/prop-types': 'error',
    'import/prefer-default-export': 'off',
    'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never' }],
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'htmlFor' }],
    'no-console': 'error',
    'no-alert': 'error',
  },
};
