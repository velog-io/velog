import { container } from 'tsyringe'
import { FollowUserService } from './index.js'

describe('followUserService', () => {
  const followUserService = container.resolve(FollowUserService)
  it('should be defined', () => {
    expect(followUserService).toBeDefined()
  })
})
