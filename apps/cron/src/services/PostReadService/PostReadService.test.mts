import { container } from 'tsyringe'
import { PostReadService } from './index.mjs'

describe('PostReadService', () => {
  const service = container.resolve(PostReadService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
