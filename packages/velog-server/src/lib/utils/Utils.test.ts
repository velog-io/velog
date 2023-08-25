import { UtilsService } from '@lib/utils/UtilsService'
import { container } from 'tsyringe'

describe('Utils', () => {
  container.reset()
  const utils = container.resolve(UtilsService)
  it('[resolveDir]', () => {
    const path = '/env/.env.development'
    expect(utils.resolveDir(path)).toContain(path)
  })
  it('[escapeForUrl]', () => {
    const contents = [
      '안녕하세요 velog 개발자 Carrick이라고 합니다.',
      '아무것도 모르고 보내고 있었던 HTTP 메시지',
      '欢迎阅读我的博客.今天,我将向您介绍Python编程的基础知识.',
      '私のブログへようこそ/今日は,Pythonプログラミングの基本を紹介します.',
    ]
    contents.forEach((context) => {
      const result = utils.escapeForUrl(context)
      expect(!/\s/.test(result)).toBeTruthy()
      // only allow ko,en, jp, cn
      expect(
        /^[a-zA-Z0-9ㄱ-힣\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\.-]*$/gu.test(result)
      ).toBeTruthy()
    })
  })
})
