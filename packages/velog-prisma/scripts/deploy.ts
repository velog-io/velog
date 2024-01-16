import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import { exec } from 'child_process'

// "prisma-migrate:deploy": "pnpm env:copy && pnpm prisma migrate deploy --schema=./prisma/schema.prisma"

const db = new PrismaClient()

const main = async () => {
  const filenames = getMigrationFilenames()
  const appliedMigrationNames = await getAppliedMigrationNames()
  const diff = filenames.filter((filename) => !appliedMigrationNames.includes(filename))

  const message = getMessage(diff)
  console.log(`Target Database Info: ${process.env.DATABASE_URL}\n`)

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

  exec('pnpm prisma migrate deploy --schema=./prisma/schema.prisma', (error, stdout, _stderr) => {
    if (error) {
      console.log(_stderr)
    }
    console.log(stdout)
  })
}

main()

function getMigrationFilenames() {
  const dirPath = path.resolve(process.cwd(), './prisma/migrations/')
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
    ...migrationDiff.map((filename) => `  - ${filename}\n\n${getMigrationSummary(filename)}`),
    '',
    question,
  ].join('\n')
}

function getMigrationSummary(filename: string) {
  const filepath = path.resolve(
    process.cwd(),
    `./prisma/migrations`,
    `${filename}`,
    './migration.sql',
  )

  const sql = fs.readFileSync(filepath, { encoding: 'utf-8' })
  const target = ['ALTER', 'CREATE', 'DROP']
  return sql
    .split('\n')
    .filter((line) => target.some((str) => line.includes(str)))
    .map((v) => `    - ${v.replace(/[{}\[\]()<>;]+/g, '').toLowerCase()}`)
    .join('\n')
}
