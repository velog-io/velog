import { container } from 'tsyringe'
import { SendMailService } from './SendMailService.js'

describe('SendMailService', () => {
  const service = container.resolve(SendMailService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
