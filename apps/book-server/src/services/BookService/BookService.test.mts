import { container } from 'tsyringe'
import { BookService } from './index.mjs'

describe('BookService', () => {
  const service = container.resolve(BookService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
