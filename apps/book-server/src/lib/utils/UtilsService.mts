import { dirname, join } from 'path'
import { injectable, singleton } from 'tsyringe'
import { fileURLToPath } from 'url'
import { UtilsService as Utils } from '@packages/library/utils'

interface Service {
  escapeForUrl(text: string): string
  resolveDir(dir: string): string
}

@injectable()
@singleton()
export class UtilsService extends Utils implements Service {
  public resolveDir(dir: string): string {
    const __filename = fileURLToPath(import.meta.url)
    const splited = dirname(__filename).split('/src')
    const cwd = splited.slice(0, -1).join('/src')
    return join(cwd, dir)
  }
  public removeCodeFromUrlSlug(urlSlug: string): string {
    if (urlSlug === '') return urlSlug
    return urlSlug.split('-').slice(0, -1).join('-').trim()
  }
}
