import { container } from 'tsyringe'
import { DynamicConfigService } from './index.js'

describe('DynamicConfigService', () => {
  const service = container.resolve(DynamicConfigService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
