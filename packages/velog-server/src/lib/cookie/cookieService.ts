import type { CookieSerializeOptions } from '@fastify/cookie'
import { FastifyReply } from 'fastify'
import { injectable } from 'tsyringe'

@injectable()
export class CookieService {
  private domains: (string | undefined)[] = ['.velog.io', undefined]
  public setCookie(
    reply: FastifyReply,
    name: string,
    value: string,
    options?: CookieSerializeOptions
  ): void {
    this.domains.forEach((domain) => {
      reply.setCookie(name, value, {
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
