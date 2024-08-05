import { container } from 'tsyringe'
import { MqService } from './MqService.mjs'

describe('MqService', () => {
  const service = container.resolve(MqService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
