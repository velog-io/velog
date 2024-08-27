import { container } from 'tsyringe'
import { UserService } from './index.mjs'

describe('UserService', () => {
  const service = container.resolve(UserService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
