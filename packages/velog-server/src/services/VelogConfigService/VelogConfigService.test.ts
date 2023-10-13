import { container } from 'tsyringe'
import { VelogConfigService } from './index.js'

describe('VelogConfigService', () => {
  const service = container.resolve(VelogConfigService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
