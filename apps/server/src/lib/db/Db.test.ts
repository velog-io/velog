import { container } from 'tsyringe'
import { DbService } from './DbService'

describe('DbService', () => {
  const service = container.resolve(DbService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
