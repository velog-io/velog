import { container } from 'tsyringe'
import { MailService } from './MailService.js'

describe('MailService', () => {
  const service = container.resolve(MailService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
