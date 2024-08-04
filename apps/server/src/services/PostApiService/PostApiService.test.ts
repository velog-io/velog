import { container } from 'tsyringe'
import { PostApiService } from './index.mjs'

describe('PostApiService', () => {
  const service = container.resolve(PostApiService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
