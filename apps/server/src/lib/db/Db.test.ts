import { container } from 'tsyringe'
import { DbService } from './DbService.js'

describe('DbService', () => {
  const service = container.resolve(DbService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
