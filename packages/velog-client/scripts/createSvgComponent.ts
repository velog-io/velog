import { exec } from 'child_process'

const commands = [
  'npx @svgr/cli --out-dir src/icons/images --ignore-existing --typescript -- public/images',
  'npx @svgr/cli --out-dir src/icons/svg --ignore-existing --typescript -- public/svg',
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
