import { UtilsService } from '@lib/utils/utilsService'
import { container } from 'tsyringe'

describe('Utils', () => {
  const utilServie = container.resolve(UtilsService)
  it('[resolveDir]', () => {
    const path = '/env/.env.developent'
    expect(utilServie.resolveDir(path)).toContain(path)
  })
})
