import { ENV } from '@env'
import { axios } from 'src/commonjs/axios.js'
import { injectable, singleton } from 'tsyringe'

interface Service {
  verifyToken(token: string): Promise<boolean>
}

@injectable()
@singleton()
export class TurnstileService implements Service {
  private verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
  public async verifyToken(token: string): Promise<boolean> {
    try {
      const res = await axios.post<{ success: boolean }>(this.verifyUrl, {
        secret: ENV.turnstileSecretKey,
        response: token,
      })

      return res.data.success
    } catch (error) {
      console.log('verifyTurnstileToken error', error)
      return false
    }
  }
}
