import { container } from 'tsyringe'
import { DiscordService } from './DiscordService.mjs'

describe('DiscordService', () => {
  const service = container.resolve(DiscordService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
