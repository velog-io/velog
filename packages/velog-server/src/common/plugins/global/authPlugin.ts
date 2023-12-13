import { JwtService } from '@lib/jwt/JwtService.js'
import { AccessTokenData } from '@lib/jwt/Jwt.interface.js'
import { FastifyPluginAsync } from 'fastify'
import { container } from 'tsyringe'
import { UserService } from '@services/UserService/index.js'
import { CookieService } from '@lib/cookie/CookieService.js'
import { Time } from '@constants/TimeConstants.js'

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null)
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      if (request.url.includes('/auth/logout')) return
      let accessToken: string | undefined = request.cookies['access_token']
      const refreshToken: string | undefined = request.cookies['refresh_token']
      const authorization = request.headers['authorization']

      console.log('req', request.headers)
      if (!accessToken && authorization) {
        accessToken = authorization.split('Bearer ')[1]
      }

      const jwt = container.resolve(JwtService)

      if (!accessToken) return
      const accessTokenData = await jwt.decodeToken<AccessTokenData>(accessToken)

      request.user = { id: accessTokenData.user_id }

      const diff = accessTokenData.exp * 1000 - new Date().getTime()
      // refresh token when life < 30mins
      if (diff < Time.ONE_MINUTE_IN_MS * 30 && refreshToken) {
        const userService = container.resolve(UserService)
        await userService.restoreToken({ request, reply })
      }
    } catch (e) {
      const cookie = container.resolve(CookieService)
      cookie.clearCookie(reply, 'access_token')
      cookie.clearCookie(reply, 'refresh_token')
    }
  })
}

export default authPlugin
