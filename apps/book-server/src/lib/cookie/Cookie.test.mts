import { container } from 'tsyringe'
import { CookieService } from './CookieService.mjs'

describe('CookieService', () => {
  const service = container.resolve(CookieService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
