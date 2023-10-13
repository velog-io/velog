import { container } from 'tsyringe'
import { UserProfileService } from './index.js'

describe('UserProfileService', () => {
  const service = container.resolve(UserProfileService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
