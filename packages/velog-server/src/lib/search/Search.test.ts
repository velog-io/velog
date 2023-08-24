import { container } from 'tsyringe'
import { SearchService } from './SearchService'

describe('SearchService', () => {
  const service = container.resolve(SearchService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
