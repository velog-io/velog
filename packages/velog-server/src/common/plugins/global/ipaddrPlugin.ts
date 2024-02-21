import type { FastifyPluginAsync } from 'fastify'

const ipaddrPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('ipaddr', null)
  fastify.addHook('preHandler', (request, reply, done) => {
    const fromCdnIp = request.headers['gcdn-client-ip']
    const graphCdnAddress = Array.isArray(fromCdnIp) ? fromCdnIp[0] : fromCdnIp
    const ipaddr = graphCdnAddress || request.ips?.slice(-1)[0] || request.ip
    request.ipaddr = ipaddr
    done()
  })
}

export default ipaddrPlugin
