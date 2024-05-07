import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary'

interface Service {
  escapeForUrl(text: string): string
  randomString(): string
}

export class UtilsService implements Service {
  public escapeForUrl(text: string): string {
    return text
      .replace(
        /[^0-9a-zA-Zㄱ-힣.\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf -]/g,
        '',
      )
      .trim()
      .replace(/ /g, '-')
      .replace(/--+/g, '-')
      .replace(/\.+$/, '')
  }
  public randomString(size = 10) {
    const generateCode = customAlphabet(alphanumeric, size)
    return generateCode()
  }
}
