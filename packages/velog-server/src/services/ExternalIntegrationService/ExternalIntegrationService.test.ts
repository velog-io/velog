import { container } from 'tsyringe'
import { ExternalIntegrationService } from './index.js'

describe('ExternalIntegrationService', () => {
  const service = container.resolve(ExternalIntegrationService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
