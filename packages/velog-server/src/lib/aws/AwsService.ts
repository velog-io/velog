import { injectable, singleton } from 'tsyringe'
import { SESClient } from '@aws-sdk/client-ses'

@injectable()
@singleton()
export class AwsService {
  get ses() {
    return new SESClient({ region: 'us-east-1' })
  }
}
