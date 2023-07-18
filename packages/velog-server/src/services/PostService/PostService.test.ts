import { container } from 'tsyringe'
import { PostService } from './index'

describe('PostService', () => {
  const postService = container.resolve(PostService)
  it('should be defined', () => {
    expect(postService).toBeDefined()
  })
})
