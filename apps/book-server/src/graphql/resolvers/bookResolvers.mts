import { Resolvers } from '@graphql/generated.js'
import { MqService } from '@lib/mq/MqService.mjs'
import { BookBuildService } from 'src/services/BookBuildService/index.mjs'
import { BookDeployService } from 'src/services/BookDeployService/index.mjs'
import { BookService } from 'src/services/BookService/index.mjs'
import { PageService } from 'src/services/PageService/index.mjs'
import { container } from 'tsyringe'

const bookResolvers: Resolvers = {
  Book: {
    pages: async (parent) => {
      if (!parent) return []
      const pageService = container.resolve(PageService)
      return await pageService.organizePages(parent.id)
    },
  },
  Query: {
    book: async (_, { input }) => {
      const bookService = container.resolve(BookService)
      return await bookService.getBook(input.book_id)
    },
  },
  Mutation: {
    deploy: async (_, { input }, { pubsub }) => {
      const bookDeployService = container.resolve(BookDeployService)
      return await bookDeployService.deploy(input.book_id)
    },
    build: async (_, { input }, { pubsub }) => {
      const bookBuildService = container.resolve(BookBuildService)
      return await bookBuildService.build(input.book_id, pubsub)
    },
  },
  Subscription: {
    bookBuildInstalled: {
      subscribe: async (_, { input }, { pubsub }) => {
        const mqService = container.resolve(MqService)
        const buildTopic = mqService.generateTopic('build')
        return pubsub.subscribe(buildTopic.installed(input.book_id))
      },
    },
    bookBuildCompleted: {
      subscribe: async (_, { input }, { pubsub }) => {
        const mqService = container.resolve(MqService)
        const buildTopic = mqService.generateTopic('build')
        return pubsub.subscribe(buildTopic.completed(input.book_id))
      },
    },
    bookDeployCompleted: {
      subscribe: async (_, { input }, { pubsub }) => {
        const mqService = container.resolve(MqService)
        const generateTopic = mqService.generateTopic('deploy')
        return pubsub.subscribe(generateTopic.completed(input.book_id))
      },
    },
  },
}

export default bookResolvers
