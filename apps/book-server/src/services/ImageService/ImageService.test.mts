import { container } from 'tsyringe'
import { ImageService } from './index.mjs'

describe('ImageService', () => {
  const service = container.resolve(ImageService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
