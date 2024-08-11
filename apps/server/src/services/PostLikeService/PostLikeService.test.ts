import { container } from 'tsyringe'
import { PostLikeService } from './index.js'

describe('PostLikeService', () => {
  const service = container.resolve(PostLikeService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
