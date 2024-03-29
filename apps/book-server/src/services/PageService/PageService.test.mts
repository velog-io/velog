import { container } from 'tsyringe'
import { PageService } from './index.mjs'

describe('PageService', () => {
  const service = container.resolve(PageService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
