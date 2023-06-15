import { FastifyCookieOptions } from '@fastify/cookie'
import { FastifyReply } from 'fastify'
import { injectable } from 'tsyringe'

@injectable()
export class Cookie {
  private domains: (string | undefined)[] = ['.velog.io', undefined]
  public setCookie(
    reply: FastifyReply,
    name: string,
    payload: string,
    options: FastifyCookieOptions
  ): void {
    this.domains.forEach((domain) => {
      reply.setCookie(name, payload, {
        httpOnly: true,
        domain,
        ...options,
      })
    })
  }
  public clearCookie(reply: FastifyReply, name: string): void {
    this.domains.forEach((domain) => {
      reply.setCookie(name, '', {
        domain,
        maxAge: 0,
      })
    })
  }
}
