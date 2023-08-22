import { container } from 'tsyringe'
import { AuthService } from './AuthService'

describe('AuthService', () => {
  const service = container.resolve(AuthService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
