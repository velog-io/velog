import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

let isClosing = false
export const startClosing = () => {
  isClosing = true
}

// TODO: apply fastify-plugin
const keepAlivePlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', (_, reply, done) => {
    if (isClosing) {
      // http.send but nothing contents
      reply.send()
    }
    done()
  })
}

export default fp(keepAlivePlugin)
