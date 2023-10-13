import { container } from 'tsyringe'
import { UserMetaService } from './index.js'

describe('UserMetaService', () => {
  const service = container.resolve(UserMetaService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
