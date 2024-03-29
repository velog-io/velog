import { container } from 'tsyringe'
import { ElasticSearchService } from './ElasticSearchService'

describe('ElasticSearchService', () => {
  const service = container.resolve(ElasticSearchService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
