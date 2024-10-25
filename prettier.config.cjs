module.exports = {
  arrowParens: 'avoid',
  importOrder: ['<BUILTIN_MODULES>', '', '<THIRD_PARTY_MODULES>', '', '^@/(.*)$', '', '^[.]'],
  importOrderTypeScriptVersion: '5.6.3',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  printWidth: 120,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none'
};
