import { container } from 'tsyringe'
import { SocialService } from './index.js'

describe('SocialService', () => {
  const service = container.resolve(SocialService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
