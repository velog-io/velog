import { ENV } from 'src/env.mjs'
import type { CookieSerializeOptions } from '@fastify/cookie'
import { FastifyReply } from 'fastify'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class CookieService {
  private get domains() {
    const isProduction = ENV.appEnv !== 'development'
    if (isProduction) return ['.velog.io']
    return ['location', undefined]
  }
  public getCookie(reply: FastifyReply, name: string) {
    return reply.cookies[name]
  }
  public setCookie(
    reply: FastifyReply,
    name: string,
    value: string,
    options?: CookieSerializeOptions,
  ): void {
    this.domains.forEach((domain) => {
      reply.cookie(name, value, {
        httpOnly: true,
        domain,
        path: '/',
        ...options,
      })
    })
  }
  public clearCookie(reply: FastifyReply, name: string): void {
    this.domains.forEach((domain) => {
      reply.clearCookie(name, {
        domain,
        maxAge: 0,
        httpOnly: true,
      })
    })
  }
}
