import { ENV } from '@env'
import { dirname, join } from 'path'
import { injectable, singleton } from 'tsyringe'
import { fileURLToPath } from 'url'

interface Service {
  resolveDir(dir: string): string
  escapeForUrl(text: string): string
  checkEmpty(text: string): boolean
  normalize<T extends Partial<T> & { id: string }>(
    array: T[],
    selector: (item: T) => string | number,
  ): {
    [key: string]: T
  }
  shuffle<T>(array: T[]): T[]
  groupById<T>(order: string[], data: T[], idResolver: (row: T) => string): T[][]
  checkUnscore(text: string): boolean
  now: Date
  optimizeImage(url: string, width: number): string
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
  public checkEmpty(text: string): boolean {
    if (!text) return true
    const replaced = text
      .trim()
      .replace(/([\u3164\u115F\u1160\uFFA0\u200B\u0001-\u0008\u000B-\u000C\u000E-\u001F]+)/g, '')
      .replace(/&nbsp;/, '')
    if (replaced === '') return true
    return false
  }
  public normalize<T extends Partial<T> & { id: string }>(
    array: T[],
    selector: (item: T) => string | number = (item: T) => item.id,
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
  public groupById<T>(order: string[], data: T[], idResolver: (row: T) => string): T[][] {
    const map: {
      [key: string]: T[]
    } = {}
    // creates array for every key
    order.forEach((id) => {
      map[id] = []
    })
    data.forEach((row) => {
      map[idResolver(row)].push(row)
    })
    const ordered = order.map((id) => map[id])
    return ordered
  }
  public checkUnscore(text: string): boolean {
    const unscoredCategory = ENV.unscoredCategory.split(',')
    const unscoredWords = ENV.unscoredWords.split(',')

    const lowerText = text.toLowerCase().replace(/ /g, '')
    const isUnscoredCategory = unscoredCategory.some((category) => lowerText.includes(category))
    const hasUnscoredWords = unscoredWords.some((word) => lowerText.includes(word))
    return isUnscoredCategory && hasUnscoredWords
  }
  public get now() {
    return new Date()
  }
  public optimizeImage(url: string, width: number): string {
    if (!url.includes('https://images.velog.io')) return url
    return url.replace('://images', '://img').concat(`?w=${width}`)
  }
  public shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
  public pickRandomItems<T>(array: T[], count: number) {
    const shuffled = this.shuffleArray(array)
    return shuffled.slice(0, count)
  }
}
