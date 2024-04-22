import { ENV } from '@env'
import { FastifyCookieService } from '@packages/library/fastifyCookie'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class CookieService extends FastifyCookieService {
  constructor() {
    super({ appEnv: ENV.appEnv })
  }
}
