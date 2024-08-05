import { container } from 'tsyringe'
import { UtilsService } from './UtilsService.js'

describe('UtilsService', () => {
  const service = container.resolve(UtilsService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
