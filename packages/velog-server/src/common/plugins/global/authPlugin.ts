import { JwtService } from '@lib/jwt/JwtService.js'
import { AccessTokenData } from '@lib/jwt/Jwt.interface'
import { FastifyPluginAsync } from 'fastify'
import { container } from 'tsyringe'

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null)
  fastify.addHook('preHandler', async (request) => {
    if (request.url.includes('/auth/logout')) return

    let accessToken: string | undefined = request.cookies['access_token']
    const authorization = request.headers['authorization']

    if (!accessToken && authorization) {
      accessToken = authorization.split('Bearer ')[1]
    }

    const jwt = container.resolve(JwtService)

    if (!accessToken) return
    const accessTokenData = await jwt.decodeToken<AccessTokenData>(accessToken)
    request.user = { id: accessTokenData.user_id }
  })
}

export default authPlugin
