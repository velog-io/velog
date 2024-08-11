import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { injectable, singleton } from 'tsyringe'
import { toZonedTime } from 'date-fns-tz'

interface Service {
  resolveDir(dir: string): string
  now: Date
}

@injectable()
@singleton()
export class UtilsService implements Service {
  public resolveDir(dir: string): string {
    const __filename = fileURLToPath(import.meta.url)
    const splited = dirname(__filename).split('/src')
    const cwd = splited.slice(0, -1).join('/src')
    return join(cwd, dir)
  }
  public get now() {
    const utcTime = new Date()
    const timezone = 'Asia/Seoul'
    return toZonedTime(utcTime, timezone)
  }
}
