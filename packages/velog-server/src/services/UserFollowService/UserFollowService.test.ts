import { container } from 'tsyringe'
import { UserFollowService } from './index.js'

describe('FollowService', () => {
  const userFollowService = container.resolve(UserFollowService)
  it('should be defined', () => {
    expect(userFollowService).toBeDefined()
  })
})
