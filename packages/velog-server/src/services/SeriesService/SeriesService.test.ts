import { container } from 'tsyringe'
import { SeriesService } from './index.js'

describe('SeriesService', () => {
  const service = container.resolve(SeriesService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
