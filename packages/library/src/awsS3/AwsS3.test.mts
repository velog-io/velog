import { AwsS3Service } from './AwsS3Service.mjs'

describe('AwsS3Service', () => {
  const service = new AwsS3Service({ region: 'ap-northeast-2' })
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
