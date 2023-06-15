import { UtilService } from '@lib/utils/utilService'
import { container } from 'tsyringe'

describe('Utils', () => {
  const utilServie = container.resolve(UtilService)
  it('[resolveDir]', () => {
    const path = '/env/.env.developent'
    expect(utilServie.resolveDir(path)).toContain(path)
  })
})
