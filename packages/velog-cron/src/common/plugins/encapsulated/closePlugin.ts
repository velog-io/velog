import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

let isClosing = false

export function disableKeepAlive() {
  isClosing = true
}

const pluginFn: FastifyPluginCallback = async (fastify, opts, done) => {
  fastify.addHook('onResponse', async (request, reply) => {
    if (isClosing) {
      reply.header('Connection', 'close')
    }
  })

  done()
}

const closePlugin = fp(pluginFn, {
  name: 'closePlugin',
})

export default closePlugin
