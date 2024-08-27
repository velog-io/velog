import { container } from 'tsyringe'
import { PostService } from './index.mjs'

describe('PostService', () => {
  const service = container.resolve(PostService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
