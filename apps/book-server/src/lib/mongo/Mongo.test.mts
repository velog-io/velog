import { container } from 'tsyringe'
import { MongoService } from './MongoService.mjs'

describe('MongoService', () => {
  const service = container.resolve(MongoService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
