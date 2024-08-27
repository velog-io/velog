import { container } from 'tsyringe'
import { RedisService } from './RedisService.mjs'

describe('RedisService', () => {
  const service = container.resolve(RedisService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
