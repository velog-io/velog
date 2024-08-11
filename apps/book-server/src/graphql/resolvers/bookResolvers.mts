import { Resolvers } from '@graphql/generated.js'
import { MqService } from '@lib/mq/MqService.mjs'
import { BookBuildService } from 'src/services/BookBuildService/index.mjs'
import { BookDeployService } from 'src/services/BookDeployService/index.mjs'
import { BookService } from 'src/services/BookService/index.mjs'
import { container } from 'tsyringe'

const bookResolvers: Resolvers = {
  Query: {
    book: async (_, { input }) => {
      const bookService = container.resolve(BookService)
      return await bookService.getBook(input.book_id)
    },
    isDeploy: async (_, { input }, ctx) => {
      const bookService = container.resolve(BookService)
      return await bookService.isDeploy(input, ctx.writer?.id)
    },
  },
  Mutation: {
    build: async (_, { input }, ctx) => {
      const bookBuildService = container.resolve(BookBuildService)
      return await bookBuildService.build(input.book_url_slug, ctx.writer?.id)
    },
    deploy: async (_, { input }, ctx) => {
      const bookDeployService = container.resolve(BookDeployService)
      return await bookDeployService.deploy(input.book_url_slug, ctx.writer?.id)
    },
  },
  Subscription: {
    buildInstalled: {
      subscribe: async (_, { input }, { pubsub }) => {
        const mqService = container.resolve(MqService)
        const generator = mqService.topicGenerator('buildInstalled')
        const topic = generator(input.book_url_slug)
        return pubsub.subscribe(topic)
      },
    },
    buildCompleted: {
      subscribe: async (_, { input }, { pubsub }) => {
        const mqService = container.resolve(MqService)
        const generator = mqService.topicGenerator('buildCompleted')
        const topic = generator(input.book_url_slug)
        return pubsub.subscribe(topic)
      },
    },
    deployCompleted: {
      subscribe: async (_, { input }, { pubsub }) => {
        const mqService = container.resolve(MqService)
        const generator = mqService.topicGenerator('deployCompleted')
        const topic = generator(input.book_url_slug)
        return pubsub.subscribe(topic)
      },
    },
  },
}

export default bookResolvers
