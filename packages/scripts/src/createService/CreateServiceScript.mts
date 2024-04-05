import path, { dirname } from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import { fileURLToPath } from 'url'

const filesData = new Map<string, string>()

export class CreateServiceScript {
  private __dirname: string
  constructor({ __dirname }: { __dirname: string }) {
    this.__dirname = __dirname
  }
  public async excute() {
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Do you want to save in lib directory or services directory?',
        choices: ['services', 'lib'],
        default: 'services',
      },
    ])

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    const templateDir = path.resolve(__dirname, `./templates/${type}`)
    const files = fs.readdirSync(templateDir)

    files.forEach((file) => {
      const filePath = path.resolve(templateDir, file)
      const fileData = fs.readFileSync(filePath, 'utf8')
      filesData.set(file, fileData)
    })

    const answer = await inquirer.prompt([
      {
        name: 'feature',
        message: 'Enter service name',
      },
    ])

    const dirPath =
      type === 'lib'
        ? path.resolve(this.__dirname, '../src/lib')
        : path.resolve(this.__dirname, `../src/services`)

    const filename = answer.feature.trim()

    this.createService({
      type,
      dirPath,
      filename,
      files,
    })
  }

  private createService({ type, dirPath, filename, files }: CreateServiceParams) {
    const newFilename = type === 'services' ? `${this.toPascalCase(filename)}Service` : filename

    const serviceDir = path.resolve(dirPath, newFilename)

    // create directory if not exist
    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir, { recursive: true })
    }

    files.forEach((file) => {
      const fileData = filesData.get(file)
      if (fileData === undefined) return
      const code = this.replace(fileData, filename)

      const newFilePath = path.resolve(serviceDir, this.replace(file, newFilename))
      fs.writeFileSync(newFilePath, code)
    })

    console.log(`Service files are created at ${serviceDir}`)
  }
  private toPascalCase(str: string) {
    return str
      .split('')
      .map((s, i) => (i === 0 ? s.toUpperCase() : s))
      .join('')
  }
  private replace(text: string, name: string) {
    return text.replace(/My/g, `${this.toPascalCase(name)}`)
  }
}

type CreateServiceParams = {
  type: string
  dirPath: string
  filename: string
  files: string[]
}
