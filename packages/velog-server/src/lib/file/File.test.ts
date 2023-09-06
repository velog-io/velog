import { container } from 'tsyringe'
import { FileService } from './FileService'

describe('FileService', () => {
  const service = container.resolve(FileService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
