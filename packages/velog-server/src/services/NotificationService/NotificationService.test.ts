import { container } from 'tsyringe'
import { NotificationService } from './index.js'

describe('NotificationService', () => {
  const service = container.resolve(NotificationService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
