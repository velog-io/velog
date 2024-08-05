import { container } from 'tsyringe'
import { SlackService } from './SlackService.js'

describe('SlackService', () => {
  const service = container.resolve(SlackService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
