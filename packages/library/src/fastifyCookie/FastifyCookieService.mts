import type { CookieSerializeOptions } from '@fastify/cookie'
import type { FastifyReply, FastifyRequest } from 'fastify'

interface Service {
  setCookie(
    reply: FastifyReply,
    name: string,
    value: string,
    options?: CookieSerializeOptions,
  ): void
  getCookie(request: FastifyRequest, name: string): string | undefined
  clearCookie(reply: FastifyReply, name: string): void
}

type Params = {
  appEnv: 'development' | 'stage' | 'production'
}

export class FastifyCookieService implements Service {
  private appEnv!: 'development' | 'stage' | 'production'
  constructor({ appEnv }: Params) {
    this.appEnv = appEnv
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
  public getCookie(request: FastifyRequest, name: string) {
    if (!request.cookies) {
      throw new Error('Not Setup @fastify/cookie Plugin')
    }
    return request.cookies[name]
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
  private get domains() {
    const isProduction = this.appEnv !== 'development'
    if (isProduction) return ['.velog.io']
    return ['location', undefined]
  }
}
