import { container } from 'tsyringe'
import { PostWriteService } from './index.js'

describe('PostWriteService', () => {
  const service = container.resolve(PostWriteService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
