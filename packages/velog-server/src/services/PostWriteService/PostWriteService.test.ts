import { container } from 'tsyringe'
import { PostAPIService } from './index.js'

describe('PostAPIService', () => {
  const service = container.resolve(PostAPIService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
