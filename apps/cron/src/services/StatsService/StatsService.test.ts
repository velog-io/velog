import { container } from 'tsyringe'
import { StatsService } from './index.js'

describe('StatsService', () => {
  const service = container.resolve(StatsService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
