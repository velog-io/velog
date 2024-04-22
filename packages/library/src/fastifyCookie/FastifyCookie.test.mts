import { container } from 'tsyringe'
import { FastifyCookieService } from './FastifyCookieService.mjs'

describe('FastifyCookieService', () => {
  const service = container.resolve(FastifyCookieService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
