import inquirer from 'inquirer'
import { exec } from 'child_process'
import { ENV } from 'scripts/env.mjs'

const main = async () => {
  const { answer } = await inquirer.prompt([
    {
      type: 'list',
      name: 'answer',
      message: `Target Database Info: ${ENV.velogBookMongoUrl}\n🤔 Are you sure?`,
      choices: ['No', 'Yes'],
      default: 'No',
    },
  ])

  if (answer === 'No') {
    console.info('🚫 db push process stopped by user.')
    process.exit(0)
  }

  run_exec()
}

main()

const run_exec = () => {
  exec(
    `dotenv -e .env -- npx prisma db push --schema=./prisma/velog-book-mongo/schema.prisma`,
    (error, stdout, _stderr) => {
      if (error) {
        console.log(_stderr)
      }
      console.log(stdout)
    },
  )
}
