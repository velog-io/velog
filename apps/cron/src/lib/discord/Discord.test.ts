import { container } from 'tsyringe'
import { DiscordService } from './DiscordService.js'

describe('DiscordService', () => {
  const service = container.resolve(DiscordService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
