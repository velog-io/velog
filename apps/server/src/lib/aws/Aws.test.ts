import { container } from 'tsyringe'
import { AwsService } from './AwsService.js'

describe('AwsService', () => {
  const service = container.resolve(AwsService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
