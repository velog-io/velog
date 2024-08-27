import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'
import { PostScoreParams, PostScoreSchema } from '@routes/posts/v1/schema.mjs'
import { HttpStatus } from '@constants/HttpStatusConstants.mjs'
import { HttpStatusMessage } from '@constants/HttpStatusMessageConstants.mjs'
import { PostController } from '@routes/posts/v1/PostController.mjs'

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

  fastify.post('/test/spam-filter', async (_, reply) => {
    await postController.spamFilterTestRunner()
    reply.status(HttpStatus.OK).send(HttpStatusMessage.Ok)
  })

  done()
}

export default v1
