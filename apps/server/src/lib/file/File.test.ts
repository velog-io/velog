import { container } from 'tsyringe'
import { FileService } from './FileService.js'

describe('FileService', () => {
  const service = container.resolve(FileService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
