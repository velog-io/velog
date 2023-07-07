import { exec } from 'child_process'

const commands = [
  'npx @svgr/cli --out-dir src/assets/icons/components --ignore-existing --typescript --no-dimensions -- src/assets/icons/svg',
  'npx @svgr/cli --out-dir src/assets/vectors/components --typescript --no-dimensions -- src/assets/vectors/svg',
]

commands.forEach((commend) => {
  exec(commend, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  })
})
