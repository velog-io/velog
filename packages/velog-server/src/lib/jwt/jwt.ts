import jwt, { SignOptions } from 'jsonwebtoken'
import { ENV } from 'src/env'
import { injectable } from 'tsyringe'

@injectable()
export class Jwt {
  public generateToken(
    payload: string | Buffer | object,
    options?: SignOptions
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
      if (!ENV.jwtSecretKey) return
      jwt.sign(payload, ENV.jwtSecretKey, jwtOptions, (err, token) => {
        if (err) reject(err)
        resolve(token as string)
      })
    })
  }
  public decodeToken<T = unknown>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!ENV.jwtSecretKey) return
      jwt.verify(token, ENV.jwtSecretKey, (err, decoded) => {
        if (err) reject(err)
        resolve(decoded as T)
      })
    })
  }
}
