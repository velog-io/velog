import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'
import { PutPostScoreOptions, PutPostScoreSchema } from '@routes/posts/v1/schema.js'
import PostService from '@services/PostService.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { HttpStatus } from '@constants/HttpStatusConstants.js'
import { HttpStatusMessage } from '@constants/HttpStatusMessageConstants.js'

const v1: FastifyPluginCallback = (fastify, opts, done) => {
  const postService = container.resolve(PostService)

  fastify.put<PutPostScoreOptions>(
    '/score/:postId',
    {
      schema: PutPostScoreSchema,
    },
    async (request, reply) => {
      const { postId } = request.params

      const post = await postService.findById(postId)

      if (!post) {
        throw new NotFoundError('Not found Post')
      }

      await postService.scoreCarculator(post.id)

      reply.status(HttpStatus.OK).send(HttpStatusMessage.Ok)
    }
  )

  done()
}

export default v1
