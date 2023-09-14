import { container } from 'tsyringe'
import { UserFollowService } from './index.js'

describe('UserFollowService', () => {
  const service = container.resolve(UserFollowService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
