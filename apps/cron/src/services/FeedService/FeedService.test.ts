import { container } from 'tsyringe'
import { FeedService } from './index.mjs'

describe('FeedService', () => {
  const service = container.resolve(FeedService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
