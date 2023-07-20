const prettierConfig = require('@muravjev/configs-prettier')

module.exports = {
  ...prettierConfig,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 100
}
