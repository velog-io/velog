import { container } from 'tsyringe'
import { EnvService } from './EnvService.mjs'

describe('EnvService', () => {
  const service = container.resolve(EnvService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
