import { JwtService } from '@lib/jwt/JwtService.js'
import { AccessTokenData, RefreshTokenData } from '@lib/jwt/Jwt.interface'
import { UserService } from '@services/UserService/index.js'
import { FastifyPluginAsync, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { CookieService } from '@lib/cookie/CookieService.js'
import {
  ONE_DAY_IN_MS,
  ONE_HOUR_IN_MS,
  ONE_MINUTE_IN_MS,
} from '@constants/timeConstants.js'

const refresh = async (
  reply: FastifyReply,
  refreshToken: string
): Promise<string> => {
  try {
    const jwtService = container.resolve(JwtService)
    const decoded = await jwtService.decodeToken<RefreshTokenData>(refreshToken)
    const userService = container.resolve(UserService)
    const user = await userService.findById(decoded.user_id)

    if (!user) {
      throw new Error('InvalidUserError')
    }

    const tokens = await jwtService.refreshUserToken(
      user.id,
      decoded.token_id,
      decoded.exp,
      refreshToken
    )

    const cookieService = container.resolve(CookieService)
    cookieService.setCookie(reply, 'access_token', tokens.accessToken, {
      maxAge: ONE_HOUR_IN_MS,
    })
    cookieService.setCookie(reply, 'refresh_token', tokens.refreshToken, {
      maxAge: ONE_DAY_IN_MS * 30,
    })
    return user.id
  } catch (e) {
    throw e
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null)
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.includes('/auth/logout')) return

    let accessToken: string | undefined = request.cookies['access_token']
    const refreshToken: string | undefined = request.cookies['refresh_token']

    const authorization = request.headers['authorization']

    if (!accessToken && authorization) {
      accessToken = authorization.split(' ')[1]
    }

    const jwt = container.resolve(JwtService)
    try {
      if (!accessToken) {
        throw new Error('NoAccessToken')
      }

      const accessTokenData = await jwt.decodeToken<AccessTokenData>(
        accessToken
      )

      request.user = { id: accessTokenData.user_id }
      // refresh token when life < 30mins
      const diff = accessTokenData.exp * 1000 - new Date().getTime()
      if (diff < ONE_MINUTE_IN_MS * 30 && refreshToken) {
        await refresh(reply, refreshToken)
      }
    } catch (e) {
      // invalid token! try token refresh...
      if (!refreshToken) return
      try {
        const userId = await refresh(reply, refreshToken)
        // set user_id if succeeds
        request.user = { id: userId }
      } catch (e) {}
    }
  })
}

export default authPlugin
