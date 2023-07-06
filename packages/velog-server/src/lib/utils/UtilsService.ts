import { resolve } from 'path'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class UtilsService {
  public resolveDir(dir: string): string {
    return resolve(process.cwd(), dir)
  }
  public escapeForUrl(text: string): string {
    return text
      .replace(
        /[^0-9a-zA-Zㄱ-힣.\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf -]/g,
        ''
      )
      .trim()
      .replace(/ /g, '-')
      .replace(/--+/g, '-')
      .replace(/\.+$/, '')
  }
  public checkEmpty(text: string) {
    if (!text) return true
    const replaced = text
      .trim()
      .replace(/([\u3164\u115F\u1160\uFFA0\u200B\u0001-\u0008\u000B-\u000C\u000E-\u001F]+)/g, '')
      .replace(/&nbsp;/, '')
    if (replaced === '') return true
    return false
  }
  public normalize<T extends Partial<T> & { id: string | number }>(
    array: T[],
    selector: (item: T) => string | number = (item: T) => item.id
  ) {
    const object: {
      [key: string]: T
    } = {}
    array.forEach((item) => {
      object[selector(item)] = item
    })
    return object
  }
  public shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length
    let temporaryValue: T
    let randomIndex: number

    // 배열이 모두 섞일 때까지 반복
    while (0 !== currentIndex) {
      // 남은 요소 중에서 무작위 요소를 선택
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // 현재 요소와 선택한 요소를 교환
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  }
}
