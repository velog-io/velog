import fs from 'fs'
import { exec } from 'child_process'

function main() {
  if (!fs.existsSync('./prisma')) {
    fs.mkdirSync('./prisma')
  }

  setTimeout(() => {
    exec('cp -r ../../packages/database/prisma/* ./prisma/', (error, stdout, _stderr) => {
      if (error) {
        console.log(_stderr)
      }
    })
  }, 0)
}

main()
