import { ENV } from '@env'
import type { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import fp from 'fastify-plugin'
import { isHttpError } from '@errors/HttpError.js'
import {
  DiscordService,
  type MessagePayload,
  type MessageType,
} from '@lib/discord/DiscordService.js'
import { DynamicConfigService } from '@services/DynamicConfigService/index.js'

const errorHandlerPlugin: FastifyPluginCallback = fp(async (fastify) => {
  const discord = container.resolve(DiscordService)
  const dynamicConfig = container.resolve(DynamicConfigService)

  fastify.addHook('preHandler', (request, _, done) => {
    if (request.body) {
      request.log.info({ body: request.body }, 'parsed body')
    }
    done()
  })

  const sendErrorToDiscord = async (
    type: MessageType,
    payload: MessagePayload,
    request: FastifyRequest,
  ) => {
    const isBlocked = await dynamicConfig.isBlockedUser(request.user?.username)
    if (isBlocked) {
      fastify.log.info('Blocked user, skipping error message')
      return
    }

    try {
      await discord.sendMessage(type, {
        ...payload,
        body: payload.body ?? request.body ?? 'none',
        query: payload.query ?? request.query ?? 'none',
        user: request.user,
        ip: request.ip,
      })
    } catch (discordError) {
      fastify.log.error(discordError, 'Failed to send error message to Discord')
    }
  }

  fastify.addHook('onError', async (request, _, error) => {
    request.log.error(error, 'fastify onError')
    await sendErrorToDiscord('error', { type: 'fastify OnError', error }, request)
  })

  fastify.setErrorHandler(async (error, request, reply) => {
    const errorResponse = {
      message: error.message || 'Internal Server Error',
      name: error.name || 'Error',
      stack: ENV.appEnv === 'development' ? error.stack : undefined,
    }

    if (isHttpError(error)) {
      reply.status(error.statusCode).send(errorResponse)
    } else {
      reply.status(500).send(errorResponse)
    }

    if (ENV.appEnv === 'development') {
      request.log.error(error, 'fastify handleError')
    } else {
      await sendErrorToDiscord('error', { type: 'fastify handleError', error }, request)
    }
  })
})

export default errorHandlerPlugin
