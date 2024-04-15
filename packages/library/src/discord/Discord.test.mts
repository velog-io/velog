import { DiscordService } from './DiscordService.mjs'

describe('DiscordService', () => {
  const service = new DiscordService()
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
