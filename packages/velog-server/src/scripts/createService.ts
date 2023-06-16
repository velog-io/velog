import path, { dirname } from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const templateDir = path.resolve(__dirname, './templates/service')
const files = fs.readdirSync(templateDir)
const filesData = new Map<string, string>()

files.forEach((file) => {
  const filePath = path.resolve(templateDir, file)
  const fileData = fs.readFileSync(filePath, 'utf8')
  filesData.set(file, fileData)
})

function toPascalCase(str: string) {
  return str
    .split('')
    .map((s, i) => (i === 0 ? s.toUpperCase() : s))
    .join('')
}

function replaceCode(text: string, name: string) {
  return text
    .replace('./MyService', `./${name}Service`)
    .replace(/MyService/g, `${toPascalCase(name)}Service`)
}

function replaceFilename(text: string, name: string) {
  return text.replace(/My/g, name)
}

function createService(type: string, directory: string, filename: string) {
  const serviceDir = path.resolve(
    directory,
    type === 'services' ? `${filename}Service` : filename
  )

  console.log('serviceDir', serviceDir)
  // create directory if not exist
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true })
  }
  files.forEach((file) => {
    const fileData = filesData.get(file)
    if (fileData === undefined) return
    const code = replaceCode(fileData, filename)

    const newFilePath = path.resolve(
      serviceDir,
      replaceFilename(file, filename)
    )
    fs.writeFileSync(newFilePath, code)
  })

  console.log(`Service files are created at ${serviceDir}`)
}

async function main() {
  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Do you want to save in lib directory or services directory?',
      choices: ['services', 'lib'],
      default: 'services',
    },
  ])

  const { feature } = await inquirer.prompt([
    {
      name: 'feature',
      message: 'Enter service name',
    },
  ])

  const dir =
    type === 'lib'
      ? path.resolve(__dirname, '../lib')
      : path.resolve(__dirname, `../services`)

  createService(type, dir, feature.trim())
}

main()
