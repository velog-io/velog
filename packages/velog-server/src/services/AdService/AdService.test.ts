import { container } from 'tsyringe'
import { AdService } from './index.js'

describe('AdService', () => {
  const service = container.resolve(AdService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
