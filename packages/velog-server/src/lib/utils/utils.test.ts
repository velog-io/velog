import { Utils } from '@lib/utils/utils'
import { container } from 'tsyringe'

describe('Utils', () => {
  const utils = container.resolve(Utils)
  it('[resolveDir]', () => {
    const path = '/env/.env.developent'
    expect(utils.resolveDir(path)).toContain(path)
  })
})
