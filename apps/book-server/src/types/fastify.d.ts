import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    ipaddr: string | null
    user: null | { id: string }
  }
}
