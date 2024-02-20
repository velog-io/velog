import { container } from 'tsyringe'
import { PostApiService } from './index.js'

describe('PostApiService', () => {
  const service = container.resolve(PostApiService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
