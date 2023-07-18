import { container } from 'tsyringe'
import { JwtService } from './JwtService.js'

describe('JwtService', () => {
  const service = container.resolve(JwtService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
