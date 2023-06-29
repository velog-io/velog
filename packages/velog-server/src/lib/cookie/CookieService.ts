import type { CookieSerializeOptions } from '@fastify/cookie'
import { FastifyReply } from 'fastify'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class CookieService {
  private domains: (string | undefined)[] = ['.velog.io', undefined]
  public setCookie(
    reply: FastifyReply,
    name: string,
    value: string,
    options?: CookieSerializeOptions
  ): void {
    this.domains.forEach((domain) => {
      reply.cookie(name, value, {
        httpOnly: true,
        domain,
        ...options,
      })
    })
  }
  public clearCookie(reply: FastifyReply, name: string): void {
    this.domains.forEach((domain) => {
      reply.clearCookie(name, {
        domain,
        maxAge: 0,
      })
    })
  }
}
