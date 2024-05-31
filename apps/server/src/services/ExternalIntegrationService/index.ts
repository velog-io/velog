import { DbService } from '@lib/db/DbService.js'
import { injectable, singleton } from 'tsyringe'
import { nanoid } from 'nanoid'
import { JwtService } from '@lib/jwt/JwtService.js'
import { Time } from '@constants/TimeConstants.js'
import { ENV } from '@env'

import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { SerializePost } from '@services/PostService/index.js'
import { axios } from 'src/commonjs/axios.js'

interface Service {
  createIntegrationCode(userId: string): Promise<string>
  exchangeToken(code: string): Promise<string>
  checkIntegrated(userId: string): Promise<boolean>
  decodeIntegrationToken(token: string): Promise<IntegrationTokenData | null>
  notifyWebhook(params: NotifyParams): void
}

@injectable()
@singleton()
export class ExternalIntegrationService implements Service {
  constructor(private readonly db: DbService, private readonly jwt: JwtService) {}
  public async createIntegrationCode(signedUserId?: string): Promise<string> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    const code = nanoid()
    await this.db.externalIntegration.create({
      data: {
        app_identifier: 'codenary',
        code: code,
        fk_user_id: signedUserId,
        is_consumed: false,
      },
    })

    const isIntegrated = await this.checkIntegrated(signedUserId)
    if (!isIntegrated) {
      await this.createIntegrationHistory(signedUserId)
    }
    return code
  }
  public async exchangeToken(code: string): Promise<string> {
    const item = await this.db.externalIntegration.findUnique({
      where: {
        code,
      },
    })
    if (!item) {
      throw new Error('Invalid code')
    }
    if (item.is_consumed) {
      throw new Error('Code already consumed')
    }
    if (item.created_at < new Date(Date.now() - Time.ONE_MINUTE_IN_MS * 15)) {
      throw new Error('Code is expired')
    }

    await this.db.externalIntegration.update({
      where: {
        id: item.id,
      },
      data: {
        is_consumed: true,
      },
    })
    const integrationToken = await this.jwt.generateToken({
      // using different field name to avoid collision with service's legacy access token
      integrated_user_id: item.fk_user_id,
      type: 'integration',
      app_identifier: 'codenary',
    })

    return integrationToken
  }
  public async checkIntegrated(userId: string): Promise<boolean> {
    const exists = await this.db.externalIntegrationHistory.findUnique({
      where: {
        app_identifier_fk_user_id: {
          app_identifier: 'codenary',
          fk_user_id: userId,
        },
      },
    })
    return exists ? true : false
  }
  private async createIntegrationHistory(userId: string): Promise<void> {
    await this.db.externalIntegrationHistory.create({
      data: {
        app_identifier: 'codenary',
        fk_user_id: userId,
      },
    })
  }
  public async decodeIntegrationToken(token: string): Promise<IntegrationTokenData | null> {
    const decoded = await this.jwt.decodeToken<IntegrationTokenData>(token)
    if (decoded.type !== 'integration') return null
    return decoded
  }
  public notifyWebhook(params: NotifyParams): void {
    // if (process.env.NODE_ENV !== 'production') return
    const webhook = ENV.codenaryWebhook
    if (!webhook) return
    axios
      .post(webhook, params, {
        headers: {
          Authorization: `Token ${ENV.codenaryApiKey}`,
        },
      })
      .catch(console.error)
  }
}

export type IntegrationTokenData = {
  integrated_user_id: string
  type: 'integration'
  app_identifier: 'codenary'
}

export type NotifyParams =
  | {
      type: 'created' | 'updated'
      post: SerializePost
    }
  | {
      type: 'deleted'
      post_id: string
    }
