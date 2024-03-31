import { JwtService } from '@lib/jwt/JwtService.js'
import { AccessTokenData } from '@lib/jwt/JwtInterface.js'
import { FastifyPluginAsync } from 'fastify'
import { container } from 'tsyringe'
import { UserService } from '@services/UserService/index.js'
import { CookieService } from '@lib/cookie/CookieService.js'
import { Time } from '@constants/TimeConstants.js'
import { DbService } from '@lib/db/DbService'

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null)
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.includes('/auth/logout')) return

    const userService = container.resolve(UserService)
    const jwt = container.resolve(JwtService)
    const cookie = container.resolve(CookieService)

    let accessToken: string | undefined = request.cookies['access_token']
    const refreshToken: string | undefined = request.cookies['refresh_token']
    const authorization = request.headers['authorization']

    try {
      if (!accessToken && !!authorization && typeof authorization === 'string') {
        accessToken = authorization.split('Bearer ')[1]
      }

      if (!accessToken && !refreshToken) return

      if (accessToken) {
        const accessTokenData = await jwt.decodeToken<AccessTokenData>(accessToken)

        const diff = accessTokenData.exp * 1000 - new Date().getTime()
        // refresh token when life < 30mins
        if (diff < Time.ONE_MINUTE_IN_MS * 30 && refreshToken) {
          await userService.restoreToken({ request, reply })
        }

        const user = await userService.findById(accessTokenData.user_id)

        if (!user) {
          cookie.clearCookie(reply, 'access_token')
          cookie.clearCookie(reply, 'refresh_token')
          throw new Error('User not found')
        }

        request.user = { id: accessTokenData.user_id }
        return
      }

      if (!accessToken && refreshToken) {
        const tokens = await userService.restoreToken({ request, reply })
        accessToken = tokens.accessToken

        const accessTokenData = await jwt.decodeToken<AccessTokenData>(accessToken)
        request.user = { id: accessTokenData.user_id }
        return
      }

      request.user = null
    } catch (e) {
      console.log('accessToken', accessToken)
      console.log('authPlugin error', e)

      try {
        if (refreshToken) {
          const tokens = await userService.restoreToken({ request, reply })
          accessToken = tokens.accessToken

          const accessTokenData = await jwt.decodeToken<AccessTokenData>(accessToken)
          request.user = { id: accessTokenData.user_id }
        }
      } catch (error) {
        console.log('refresh token error', error)
        cookie.clearCookie(reply, 'access_token')
        cookie.clearCookie(reply, 'refresh_token')
      }
    }
  })
}

export default authPlugin
