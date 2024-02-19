import { JwtService } from '@lib/jwt/JwtService.js'
import { AccessTokenData } from '@lib/jwt/JwtInterface.js'
import { FastifyPluginAsync } from 'fastify'
import { container } from 'tsyringe'
import { UserService } from '@services/UserService/index.js'
import { CookieService } from '@lib/cookie/CookieService.js'
import { Time } from '@constants/TimeConstants.js'

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null)
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.includes('/auth/logout')) return

    const userService = container.resolve(UserService)
    let accessToken: string | undefined = request.cookies['access_token']
    const refreshToken: string | undefined = request.cookies['refresh_token']
    const authorization = request.headers['authorization']

    try {
      if (!accessToken && authorization) {
        accessToken = authorization.split('Bearer ')[1]
      }

      const jwt = container.resolve(JwtService)

      if (!accessToken && !refreshToken) return

      if (accessToken && refreshToken) {
        const accessTokenData = await jwt.decodeToken<AccessTokenData>(accessToken)
        const diff = accessTokenData.exp * 1000 - new Date().getTime()
        // refresh token when life < 30mins
        if (diff < Time.ONE_MINUTE_IN_MS * 30 && refreshToken) {
          await userService.restoreToken({ request, reply })
        }
      }

      if (!accessToken && refreshToken) {
        const tokens = await userService.restoreToken({ request, reply })
        accessToken = tokens.accessToken
      }

      if (!accessToken) return

      const accessTokenData = await jwt.decodeToken<AccessTokenData>(accessToken)
      request.user = { id: accessTokenData.user_id }
    } catch (e) {
      console.log('accessToken', accessToken)
      console.log('authPlugin error', e)
      const cookie = container.resolve(CookieService)
      cookie.clearCookie(reply, 'access_token')
      cookie.clearCookie(reply, 'refresh_token')
    }
  })
}

export default authPlugin
