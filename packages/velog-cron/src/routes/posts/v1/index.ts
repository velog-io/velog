import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'
import { PutPostScoreOptions, PutPostScoreSchema } from '@routes/posts/v1/schema.js'
import { HttpStatus } from '@constants/HttpStatusConstants.js'
import { HttpStatusMessage } from '@constants/HttpStatusMessageConstants.js'
import { PostController } from '@routes/posts/v1/PostController.js'

const v1: FastifyPluginCallback = (fastify, opts, done) => {
  const controller = container.resolve(PostController)

  fastify.patch<PutPostScoreOptions>(
    '/score/:postId',
    {
      schema: PutPostScoreSchema,
    },
    async (request, reply) => {
      const { postId } = request.params
      await controller.updateScoreByPostId(postId)
      reply.status(HttpStatus.OK).send(HttpStatusMessage.Ok)
    },
  )

  fastify.patch('/score', async (_, reply) => {
    const postCount = await controller.bulkUpdateScore()
    reply.status(HttpStatus.OK).send({ processedPostCount: postCount })
  })

  done()
}

export default v1
