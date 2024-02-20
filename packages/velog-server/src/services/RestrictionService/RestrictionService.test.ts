import { container } from 'tsyringe'
import { RestrictionService } from './index.js'

describe('RestrictionService', () => {
  const service = container.resolve(RestrictionService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
