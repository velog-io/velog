import path from 'path'

function defaultIndexTemplate(filePaths: any[]) {
  const exportEntries = filePaths
    .filter(({ path: filePath }) => path.extname(filePath) === 'svg')
    .map(({ path: filePath }) => {
      const basename = path.basename(filePath, path.extname(filePath))
      const exportName = /^\d/.test(basename) ? `Svg${basename}` : basename
      return `export { default as ${exportName} } from './${basename}'`
    })
  return exportEntries.join('\n')
}

module.exports = defaultIndexTemplate
