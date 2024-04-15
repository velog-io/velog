import { injectable, singleton } from 'tsyringe'
import { AwsS3Service as S3 } from '@packages/library/awsS3'

interface Service extends AwsS3Service {}

@injectable()
@singleton()
export class AwsS3Service extends S3 implements Service {
  constructor() {
    super({ region: 'ap-northeast-2' })
  }
}
