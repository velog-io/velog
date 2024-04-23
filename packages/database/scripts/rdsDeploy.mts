import { PrismaClient } from '@prisma/velog-rds/client'
import path from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import { exec } from 'child_process'
import { ENV } from 'scripts/env.mjs'

// "prisma-migrate:deploy": "pnpm env:copy && pnpm prisma migrate deploy --schema=./prisma/velog-rds/schema.prisma"

const db = new PrismaClient({ datasourceUrl: ENV.velogRdsUrl })
const migraionsPath = './prisma/velog-rds/migrations'

const main = async () => {
  const filenames = getMigrationFilenames()
  const appliedMigrationNames = await getAppliedMigrationNames()
  const diff = filenames.filter((filename) => !appliedMigrationNames.includes(filename))

  const message = getMessage(diff)

  console.log(`Target Database Info: ${ENV.velogRdsUrl}`)

  const { answer } = await inquirer.prompt([
    {
      type: 'list',
      name: 'answer',
      message: message,
      choices: ['Yes', 'No'],
      default: 'No',
    },
  ])

  if (answer === 'No') {
    console.info('🚫 Migration process stopped by user.')
    process.exit(0)
  }

  exec(
    'pnpm prisma migrate deploy --schema=./prisma/velog-rds/schema.prisma',
    (error, stdout, _stderr) => {
      if (error) {
        console.log(_stderr)
      }
      console.log(stdout)
    },
  )
}

main()

function getMigrationFilenames() {
  const dirPath = path.resolve(process.cwd(), migraionsPath)
  return fs.readdirSync(dirPath).filter((file) => path.extname(file) !== '.toml')
}

async function getAppliedMigrationNames(): Promise<string[]> {
  return db.$queryRaw`select migration_name from _prisma_migrations where finished_at is not NULL`.then(
    (data: any) => data.map((row: Record<'migration_name', string>) => row['migration_name']),
  )
}

function getMessage(migrationDiff: string[]): string {
  const title = `Will apply the following migrations:`
  const question = `🤔 Are you sure?`
  return [
    title,
    ...migrationDiff.map((filename) => `  - ${filename}\n${getMigrationSummary(filename)}`),
    question,
  ].join('\n')
}

function getMigrationSummary(filename: string) {
  const filepath = path.resolve(process.cwd(), migraionsPath, `${filename}`, './migration.sql')

  const sql = fs.readFileSync(filepath, { encoding: 'utf-8' })
  const lines = sql.split('\n')

  const target = ['ALTER', 'CREATE', 'DROP']
  return lines
    .filter((line) => target.some((str) => line.includes(str)))
    .map((v) => `    - ${v.replace(/[{}\[\]()<>;]+/g, '').toLowerCase()}`)
    .map((v, i, arr) => (i === arr.length - 1 ? `${v}\n` : v))
    .join('\n')
}
