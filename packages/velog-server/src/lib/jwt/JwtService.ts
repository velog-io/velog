import jwt, { SignOptions } from 'jsonwebtoken'
import { injectable, singleton } from 'tsyringe'
import { ONE_DAY_IN_MS } from '@constants/timeConstants.js'
import { ENV } from '@env'

@injectable()
@singleton()
export class JwtService {
  public generateToken(payload: string | Buffer | object, options?: SignOptions): Promise<string> {
    const jwtOptions: SignOptions = {
      issuer: 'velog.io',
      expiresIn: '7d',
      ...options,
    }

    if (!jwtOptions.expiresIn) {
      // removes expiresIn when expiresIn is given as undefined
      delete jwtOptions.expiresIn
    }
    return new Promise((resolve, reject) => {
      if (!ENV.jwtSecretKey) return
      jwt.sign(payload, ENV.jwtSecretKey, jwtOptions, (err, token) => {
        if (err) reject(err)
        resolve(token as string)
      })
    })
  }
  public decodeToken<T = unknown>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, ENV.jwtSecretKey, (err, decoded) => {
        if (err) reject(err)
        resolve(decoded as T)
      })
    })
  }
  public async refreshUserToken(
    userId: string,
    tokenId: string,
    refreshTokenExp: number,
    originalRefreshToken: string
  ) {
    const now = new Date().getTime()
    const diff = refreshTokenExp * 1000 - now
    let refreshToken = originalRefreshToken
    if (diff < ONE_DAY_IN_MS * 23) {
      refreshToken = await this.generateToken(
        {
          user_id: userId,
          token_Id: tokenId,
        },
        {
          subject: 'refresh_token',
          expiresIn: '30d',
        }
      )
    }

    const accessToken = await this.generateToken(
      {
        user_id: userId,
      },
      {
        subject: 'access_token',
        expiresIn: '1h',
      }
    )

    return { accessToken, refreshToken }
  }
}
