import { container } from 'tsyringe'
import { SearchService } from './index.js'

describe('SearchService', () => {
  const service = container.resolve(SearchService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
