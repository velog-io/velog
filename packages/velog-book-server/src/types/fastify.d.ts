import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    ipaddr: string | null
  }
}
