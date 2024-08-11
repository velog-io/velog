import { container } from 'tsyringe'
import { FeedService } from './index.js'

describe('FeedService', () => {
  const service = container.resolve(FeedService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
