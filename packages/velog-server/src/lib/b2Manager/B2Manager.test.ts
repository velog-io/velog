import { container } from 'tsyringe'
import { B2ManagerService } from './B2ManagerService'

describe('B2ManagerService', () => {
  const service = container.resolve(B2ManagerService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
