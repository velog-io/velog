import { injectable, singleton } from 'tsyringe'

interface Service {}

@injectable()
@singleton()
export class AwsService implements Service {}
