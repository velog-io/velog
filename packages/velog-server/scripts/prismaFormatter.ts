import fs from 'fs'
import path from 'path'

const toCamelCase = (str: string) =>
  str
    .split('')
    .map((v, i) => (i === 0 ? v.toLocaleLowerCase() : v))
    .join('')

const lines = (schema: string) => schema.split('\n')

const tryGetSchema = (): string => {
  const schemaPath = path.resolve(process.cwd(), './prisma/schema.prisma')
  try {
    const schema = fs.readFileSync(schemaPath, { encoding: 'utf-8' })
    return schema
  } catch (error) {
    throw error
  }
}

const tableAlias: Record<string, string> = {
  UserProfile: 'profile',
}

const getNewSchema = (schema: string, models: string[]) =>
  lines(schema)
    .map((line) => {
      if (line.length === 0) return line
      if (line.startsWith('model')) return line
      if (line === '}') return line

      const [column] = line.replace(/\s/gi, ',').split(',').filter(Boolean)

      if (!models.includes(column)) return line
      const newColumn = tableAlias[column] ?? toCamelCase(column)
      const newLine = line.replace(column, newColumn)
      return newLine
    })
    .map((line: string) => `${line}\n`)
    .join('')

const tryWriteSchema = (schema: string) => {
  const schemaPath = path.resolve(process.cwd(), './prisma/schema.prisma')
  try {
    fs.writeFileSync(schemaPath, schema, { encoding: 'utf-8' })
  } catch (error) {
    throw error
  }
}

const getModels = (schema: string): string[] =>
  lines(schema)
    .filter((v) => v.startsWith('model'))
    .map((line) => line.split(/\s/)[1])

function main() {
  try {
    const schema = tryGetSchema()
    const models = getModels(schema)
    const newSchema = getNewSchema(schema, models)
    tryWriteSchema(newSchema)
  } catch (error) {
    throw error
  }
}

main()
