import { exec } from 'node:child_process'

export const execCommand = (command: string) => {
  exec(command, (error, stdout, _stderr) => {
    if (error) {
      console.log(_stderr)
      return
    }
    console.log('stdout', stdout)
  })
}
