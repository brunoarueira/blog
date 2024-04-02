module.exports = {
  "parser": "@babel/eslint-parser",
  "env": {
    "browser": true,
    "es6": true,
  },
  "plugins": [
    "react",
  ],
  "globals": {
    "graphql": false,
  },
  "overrides": [
    {
      "files": ["*.md", "*.mdx"],
      "extends": ["plugin:mdx/recommended"],
    },
  ],
  // optional, if you want to lint code blocks at the same time
  "settings": {
    "mdx/code-blocks": true,
    // optional, if you want to disable language mapper, set it to `false`
    // if you want to override the default language mapper inside, you can provide your own
    "mdx/language-mapper": {}
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true,
    },
  }
}
