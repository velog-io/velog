import { container } from 'tsyringe'
import { TurnstileService } from './TurnstileService'

describe('TurnstileService', () => {
  const service = container.resolve(TurnstileService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
