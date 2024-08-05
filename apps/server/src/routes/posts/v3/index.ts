import { HttpStatus } from '@constants/HttpStatusConstants.js'
import { HttpStatusMessage } from '@constants/HttpStatusMesageConstants.js'
import { postScoreParamsSchema } from '@routes/posts/v3/schame.js'
import { PostService } from '@services/PostService/index.js'
import { FastifyPluginCallback } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { container } from 'tsyringe'

const v3: FastifyPluginCallback = (fastify, opts, done) => {
  const postService = container.resolve(PostService)

  fastify.patch<{ Params: FromSchema<typeof postScoreParamsSchema> }>(
    '/score/:postId',
    {
      schema: {
        params: postScoreParamsSchema,
      },
    },
    async (request, reply) => {
      const { postId } = request.params
      await postService.updatePostScore(postId)
      reply.status(HttpStatus.OK).send(HttpStatusMessage.OK)
    },
  )
  done()
}

export default v3
