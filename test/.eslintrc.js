module.exports = {
  rules: {
    // ------------------------------------------------------------------------
    // ESLint rules
    // http://eslint.org/docs/rules/
    // ------------------------------------------------------------------------
    //
    // Possible Errors
    'no-console': 'off',

    // ------------------------------------------------------------------------
    // Imports plugin
    // https://github.com/benmosher/eslint-plugin-import
    // ------------------------------------------------------------------------
    //
    // Helpful warnings
    'import/no-extraneous-dependencies': ['Error', {
      'devDependencies': true,
      'optionalDependencies': true,
      'peerDependencies': true
    }]
  },
  env: {
    mocha: true
  }
};
