import { container } from 'tsyringe'
import { MyService } from './index.js'

describe('MyService', () => {
  const service = container.resolve(MyService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
