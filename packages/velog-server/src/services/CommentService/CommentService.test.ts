import { container } from 'tsyringe'
import { CommentService } from './index.js'

describe('CommentService', () => {
  const service = container.resolve(CommentService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
