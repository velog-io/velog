import { container } from 'tsyringe'
import { PostService } from './index'
// import { StubDbService, stubDbService } from 'test/stub/prisma/DbService'

describe('PostService', () => {
  let postService: PostService
  // let db: StubDbService
  // container.reset()
  beforeEach(() => {
    // db = stubDbService
    // container.register('DbService', { useValue: stubDbService })
    postService = container.resolve(PostService)
  })

  it('should be defined', () => {
    expect(postService).toBeDefined()
  })
})
