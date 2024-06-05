import 'fastify'
import { File } from 'fastify-multer/lib/interfaces.js'

declare module 'fastify' {
  interface FastifyRequest {
    ipaddr: string | null
    writer: null | { id: string }
    file?: File
  }
}
