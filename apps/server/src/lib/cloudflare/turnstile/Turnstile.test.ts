import { container } from 'tsyringe'
import { TurnstileService } from './TurnstileService.js'

describe('TurnstileService', () => {
  const service = container.resolve(TurnstileService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
