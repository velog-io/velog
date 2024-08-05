import { container } from 'tsyringe'
import { UtilsService } from './UtilsService.mjs'

describe('UtilsService', () => {
  const service = container.resolve(UtilsService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
