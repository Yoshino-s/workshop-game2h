module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'eslint:recommended'
  ],
  plugins: [
    '@typescript-eslint'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'always'],
    indent: ["error", 2, {SwitchCase: 1}],
    quotes: ["error", "double"],
    "no-dupe-class-members": "off",
    "curly": "error",
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "always"],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "semi-spacing": ["error", {"before": false, "after": true}],
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": "error",
    "prefer-template": "error",
    "prefer-const": "error",
    "space-infix-ops": "error",
    "comma-dangle": ["error", "always"],
    "sort-vars": "error",
    "constructor-super": "off",
    "import/no-unresolved": "off",
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/interface-name-prefix": "off"
  },
};
