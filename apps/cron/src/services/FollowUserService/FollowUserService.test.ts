import { container } from 'tsyringe'
import { FollowUserService } from './index.js'

describe('FollowUserService', () => {
  const service = container.resolve(FollowUserService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
