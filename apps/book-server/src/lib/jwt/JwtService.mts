import { injectable, singleton } from 'tsyringe'
import { JwtService as JWT } from '@packages/library/jwt'
import { ENV } from '@env'

interface Service {}

@injectable()
@singleton()
export class JwtService extends JWT implements Service {
  constructor() {
    super({ secretKey: ENV.jwtSecretKey })
  }
}
