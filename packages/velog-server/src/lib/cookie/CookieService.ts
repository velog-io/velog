import { ENV } from '@env'
import type { CookieSerializeOptions } from '@fastify/cookie'
import { FastifyReply } from 'fastify'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class CookieService {
  private get domains() {
    const domains: (string | undefined)[] = []
    if (ENV.appEnv === 'development') {
      domains.push(undefined)
      domains.push('localhost')
    }
    if (ENV.appEnv === 'production') {
      domains.push('.velog.io')
    }
    return domains
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
