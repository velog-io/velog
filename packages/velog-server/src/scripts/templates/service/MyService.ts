import { injectable, singleton } from 'tsyringe'

interface Service {}

@injectable()
@singleton()
export class MyService implements Service {}
