import { container } from 'tsyringe'
import { BookBuildService } from './index.mjs'

describe('BookBuildService', () => {
  const service = container.resolve(BookBuildService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
