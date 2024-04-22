import jwt, { SignOptions } from 'jsonwebtoken'

interface Service {
  generateToken(payload: string | Buffer | Record<any, any>, options?: SignOptions): Promise<string>
  decodeToken<T = unknown>(token: string): Promise<T>
}

type Params = {
  secretKey: string
}

export class JwtService implements Service {
  private secretKey!: string
  constructor({ secretKey }: Params) {
    this.secretKey = secretKey
  }
  public generateToken(
    payload: string | Buffer | Record<any, any>,
    options?: SignOptions,
  ): Promise<string> {
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
      jwt.sign(payload, this.secretKey, jwtOptions, (err, token) => {
        if (err) reject(err)
        resolve(token as string)
      })
    })
  }
  public decodeToken<T = unknown>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) reject(err)
        resolve(decoded as T)
      })
    })
  }
}

type TokenData = {
  iat: number
  exp: number
  sub: string
  iss: string
}

export type AccessTokenData = {
  user_id: string
} & TokenData

export type RefreshTokenData = {
  user_id: string
  token_id: string
} & TokenData
