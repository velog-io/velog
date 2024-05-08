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
  },
  Mutation: {
    deploy: async (_, { input }, ctx) => {
      const bookDeployService = container.resolve(BookDeployService)
      return await bookDeployService.deploy(input.book_id, ctx.writer?.id)
    },
    build: async (_, { input }, ctx) => {
      const bookBuildService = container.resolve(BookBuildService)
      return await bookBuildService.build(input.book_id, ctx.writer?.id)
    },
  },
  Subscription: {
    bookBuildInstalled: {
      subscribe: async (_, { input }, { pubsub }) => {
        const mqService = container.resolve(MqService)
        const generator = mqService.topicGenerator('bookBuildInstalled')
        const topic = generator(input.book_id)
        return pubsub.subscribe(topic)
      },
    },
    bookBuildCompleted: {
      subscribe: async (_, { input }, { pubsub }) => {
        const mqService = container.resolve(MqService)
        const generator = mqService.topicGenerator('bookBuildCompleted')
        const topic = generator(input.book_id)
        return pubsub.subscribe(topic)
      },
    },
    bookDeployCompleted: {
      subscribe: async (_, { input }, { pubsub }) => {
        const mqService = container.resolve(MqService)
        const generator = mqService.topicGenerator('bookDeployCompleted')
        const topic = generator(input.book_id)
        return pubsub.subscribe(topic)
      },
    },
  },
}

export default bookResolvers
