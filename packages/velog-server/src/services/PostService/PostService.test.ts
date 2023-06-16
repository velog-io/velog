import { container } from 'tsyringe'
import { PostService } from './index.js'

describe('PostService', () => {
  const postService = container.resolve(PostService)
  it('should be defined', () => {
    expect(postService).toBeDefined()
  })
})
