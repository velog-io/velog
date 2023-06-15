import { resolve } from 'path'
import { injectable } from 'tsyringe'

@injectable()
export class UtilService {
  resolveDir = (dir: string): string => {
    return resolve(process.cwd(), dir)
  }
}
