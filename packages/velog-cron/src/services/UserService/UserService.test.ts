import { container } from 'tsyringe'
import { UserService } from './index.js'

describe('UserService', () => {
  const service = container.resolve(UserService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
