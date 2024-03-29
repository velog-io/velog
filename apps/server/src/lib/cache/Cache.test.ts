import { container } from 'tsyringe'
import { CacheService } from './CacheService'

describe('CacheService', () => {
  const service = container.resolve(CacheService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
