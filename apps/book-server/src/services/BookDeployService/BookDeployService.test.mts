import { container } from 'tsyringe'
import { BookDeployService } from './index.mjs'

describe('BookDeployService', () => {
  const service = container.resolve(BookDeployService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
