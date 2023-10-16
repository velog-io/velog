import { dirname, join } from 'path'
import { injectable, singleton } from 'tsyringe'
import { fileURLToPath } from 'url'
import { utcToZonedTime } from 'date-fns-tz'

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
    return utcToZonedTime(utcTime, timezone)
  }
}
