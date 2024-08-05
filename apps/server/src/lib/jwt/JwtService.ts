import type { SignOptions } from 'jsonwebtoken'
import { injectable, singleton } from 'tsyringe'
import { Time } from '@constants/TimeConstants.js'
import { ENV } from '@env'
import { DbService } from '@lib/db/DbService.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { JwtService as JWTService } from '@packages/library/jwt'

interface Service {
  generateUserToken(userId: string): Promise<{ refreshToken: string; accessToken: string }>
  refreshUserToken(
    userId: string,
    tokenId: string,
    refreshTokenExp: number,
    originalRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }>
  generateToken(payload: string | Buffer | Record<any, any>, options?: SignOptions): Promise<string>
  decodeToken<T = unknown>(token: string): Promise<T>
}

@injectable()
@singleton()
export class JwtService extends JWTService implements Service {
  constructor(private readonly db: DbService) {
    super({ secretKey: ENV.jwtSecretKey })
  }
  public async generateUserToken(userId: string) {
    const authToken = await this.db.authToken.create({
      data: {
        fk_user_id: userId,
      },
    })

    const refreshToken = await this.generateToken(
      {
        user_id: userId,
        token_id: authToken.id,
      },
      {
        subject: 'refresh_token',
        expiresIn: '30d',
      },
    )

    const accessToken = await this.generateToken(
      {
        user_id: userId,
      },
      {
        subject: 'access_token',
        expiresIn: '1d',
      },
    )

    return {
      refreshToken,
      accessToken,
    }
  }
  public async refreshUserToken(
    userId: string,
    tokenId: string,
    refreshTokenExp: number,
    originalRefreshToken: string,
  ) {
    const now = new Date().getTime()
    const diff = refreshTokenExp * 1000 - now
    let refreshToken = originalRefreshToken
    if (diff < Time.ONE_DAY_IN_MS * 23) {
      refreshToken = await this.generateToken(
        {
          user_id: userId,
          token_Id: tokenId,
        },
        {
          subject: 'refresh_token',
          expiresIn: '30d',
        },
      )
    }

    const accessToken = await this.generateToken(
      {
        user_id: userId,
      },
      {
        subject: 'access_token',
        expiresIn: '24h',
      },
    )

    return { accessToken, refreshToken }
  }
  public unregisterUserToken(signedUserId?: string) {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    return this.generateToken(
      { user_id: signedUserId },
      { subject: 'unregister_token', expiresIn: '5m' },
    )
  }
}
