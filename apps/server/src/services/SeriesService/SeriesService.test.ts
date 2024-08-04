import { container } from 'tsyringe'
import { SeriesService } from './index.mjs'

describe('SeriesService', () => {
  const service = container.resolve(SeriesService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
