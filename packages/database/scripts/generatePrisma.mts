import fs from 'fs'
import { exec } from 'child_process'

function main() {
  if (!fs.existsSync('./prisma')) {
    fs.mkdirSync('./prisma')
  }

  setTimeout(() => {
    exec(
      `prisma generate --schema='./prisma/velog-rds/schema.prisma'`,
      (error, stdout, _stderr) => {
        if (error) {
          console.log('error', _stderr)
        }
      },
    )
  }, 0)

  setTimeout(() => {
    exec(
      `prisma generate --schema='./prisma/velog-book-mongo/schema.prisma'`,
      (error, stdout, _stderr) => {
        if (error) {
          console.log('error', _stderr)
        }
      },
    )
  }, 0)
}

main()
