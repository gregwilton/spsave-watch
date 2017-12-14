module.exports = {
  root: true,
  extends: 'airbnb',
  rules: {
    // ------------------------------------------------------------------------
    // ESLint rules
    // http://eslint.org/docs/rules/
    // ------------------------------------------------------------------------
    //
    // Best Practices
    'class-methods-use-this': 'off',

    // Stylistic Issues
    'comma-dangle': ['error', 'never'],
    'linebreak-style': 'off',

    // ECMAScript 6
    'arrow-body-style': 'off',
    'max-len': 'off',

    // ------------------------------------------------------------------------
    // React plugin
    // https://github.com/yannickcr/eslint-plugin-react
    // ------------------------------------------------------------------------
    //
    // JSX-specific rules
    'react/jsx-boolean-value': ['error', 'always']
  },
  env: {
    node: true,
    es6: true
  }
};
