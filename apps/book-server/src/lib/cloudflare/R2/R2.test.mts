import { container } from 'tsyringe'
import { R2Service } from './R2Service.mjs'

describe('R2Service', () => {
  const service = container.resolve(R2Service)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
