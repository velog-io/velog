import { axios } from '@packages/commonjs'

interface Service {
  verifyToken(token: string): Promise<boolean>
}

export class TurnstileService implements Service {
  private turnstileSecretKey: string
  private verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
  constructor({ turnstileSecretKey }: ServiceArgs) {
    this.turnstileSecretKey = turnstileSecretKey
  }
  public async verifyToken(token: string): Promise<boolean> {
    try {
      const res = await axios.post<{ success: boolean }>(this.verifyUrl, {
        secret: this.turnstileSecretKey,
        response: token,
      })

      return res.data.success
    } catch (error) {
      console.log('verifyTurnstileToken error', error)
      return false
    }
  }
}

type ServiceArgs = {
  turnstileSecretKey: string
}
