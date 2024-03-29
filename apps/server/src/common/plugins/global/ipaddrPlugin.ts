import type { FastifyPluginAsync } from 'fastify'

const ipaddrPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('ipaddr', null)
  fastify.addHook('preHandler', (request, reply, done) => {
    const fromCdnIp = request.headers['gcdn-client-ip']
    const xForwardedIp = request.headers['X-Forwarded-For']

    const graphCdnAddress = Array.isArray(fromCdnIp) ? fromCdnIp[0] : fromCdnIp
    const xForwardedForAddress = Array.isArray(xForwardedIp) ? xForwardedIp[0] : xForwardedIp

    const ipaddr =
      xForwardedForAddress ?? graphCdnAddress ?? request.ips?.slice(-1)[0] ?? request.ip
    request.ipaddr = ipaddr
    done()
  })
}

export default ipaddrPlugin
