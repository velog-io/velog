import { container } from 'tsyringe'
import { AwsS3Service } from './AwsS3Service.mjs'

describe('AwsS3Service', () => {
  const service = container.resolve(AwsS3Service)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
