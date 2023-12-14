import { injectable, singleton } from 'tsyringe'
import { AwsService } from '@lib/aws/AwsService'

interface Controller {}

@singleton()
@injectable()
export class FilesController implements Controller {
  constructor(private readonly aws: AwsService) {}
}
