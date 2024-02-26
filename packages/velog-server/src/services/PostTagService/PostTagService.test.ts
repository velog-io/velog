import { container } from 'tsyringe'
import { PostTagService } from './index.js'

describe('PostTagService', () => {
  const service = container.resolve(PostTagService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
