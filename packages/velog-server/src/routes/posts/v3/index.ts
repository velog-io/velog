import { HttpStatus } from '@constants/HttpStatusConstants.js'
import { HttpStatusMessage } from '@constants/HttpStatusMesageConstants.js'
import { PostScoreSchema } from '@routes/posts/v3/schame.js'
import { PostService } from '@services/PostService/index.js'
import { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

const v3: FastifyPluginCallback = (fastify, opts, done) => {
  const postService = container.resolve(PostService)

  fastify.patch(
    '/score/:postId',
    {
      schema: PostScoreSchema,
    },
    async (request: FastifyRequest<{ Params: { postId: string } }>, reply) => {
      const { postId } = request.params
      await postService.updatePostScore(postId)
      reply.status(HttpStatus.OK).send(HttpStatusMessage.OK)
    },
  )
  done()
}

export default v3
