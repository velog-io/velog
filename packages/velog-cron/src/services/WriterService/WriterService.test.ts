import { container } from 'tsyringe'
import { WriterService } from './index.js'

describe('WriterService', () => {
  const service = container.resolve(WriterService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
