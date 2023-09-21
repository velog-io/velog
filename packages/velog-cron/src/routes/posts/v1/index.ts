import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'
import { PostScoreParams, PostScoreSchema } from '@routes/posts/v1/schema.js'
import { HttpStatus } from '@constants/HttpStatusConstants.js'
import { HttpStatusMessage } from '@constants/HttpStatusMessageConstants.js'
import { PostController } from '@routes/posts/v1/PostController.js'

const v1: FastifyPluginCallback = (fastify, opts, done) => {
  const postController = container.resolve(PostController)
  fastify.patch<PostScoreParams>(
    '/score/:postId',
    {
      schema: PostScoreSchema,
    },
    async (request, reply) => {
      const { postId } = request.params
      await postController.updatePostScore(postId)
      reply.status(HttpStatus.OK).send(HttpStatusMessage.Ok)
    },
  )

  fastify.patch('/score', async (_, reply) => {
    const processedPostsCount = await postController.calculateRecentPostScore()
    reply.status(HttpStatus.OK).send({ processedPostsCount })
  })

  done()
}

export default v1
