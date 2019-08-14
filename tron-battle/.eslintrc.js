module.exports = {
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "env": {
    "es6": true,
    "node": true,
    "browser": true
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "never"],
    "comma-dangle": ["error", "always-multiline"],
    "no-cond-assign": ["error", "always"],
    "no-constant-condition": "off",
    "no-console": "off",
}
}