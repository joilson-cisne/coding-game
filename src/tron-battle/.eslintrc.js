module.exports = {
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "env": {
    "es6": true,
    "node": true,
    "browser": true
  },
  "rules": {
    // enable additional rules
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "never"],

    // override default options for rules from base configurations
    "comma-dangle": ["error", "always-multiline"],
    "no-cond-assign": ["error", "always"],
    "no-constant-condition": "off",
    // "max-len": ["error", {"code": 100, "tabWidth": 2, "ignoreUrls": true}]

    // disable rules from base configurations
    "no-console": "off",
}
}