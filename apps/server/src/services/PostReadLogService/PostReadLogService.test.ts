import { container } from 'tsyringe'
import { PostReadLogService } from './index.js'

describe('PostReadLogService', () => {
  const service = container.resolve(PostReadLogService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
