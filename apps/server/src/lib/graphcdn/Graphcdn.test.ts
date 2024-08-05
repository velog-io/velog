import { container } from 'tsyringe'
import { GraphcdnService } from './GraphcdnService.js'

describe('GraphcdnService', () => {
  const service = container.resolve(GraphcdnService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
