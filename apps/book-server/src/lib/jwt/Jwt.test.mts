import { container } from 'tsyringe'
import { JwtService } from './JwtService.mjs'

describe('JwtService', () => {
  const service = container.resolve(JwtService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
