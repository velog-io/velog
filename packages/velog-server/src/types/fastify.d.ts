import { CurrentUser } from '@common/interfaces/user'
import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user: CurrentUser | null
    ipaddr: string | null
  }
}
