import { injectable, singleton } from 'tsyringe'
import { FastifyCookieService } from '@packages/library/fastifyCookie'
import { ENV } from '@env'

interface Service {}

@injectable()
@singleton()
export class CookieService extends FastifyCookieService implements Service {
  constructor() {
    super({ appEnv: ENV.appEnv })
  }
}
