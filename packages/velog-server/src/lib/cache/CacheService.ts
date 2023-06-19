import { injectable, singleton } from 'tsyringe'
import { LRUCache } from 'lru-cache'
import { ONE_HOUR_IN_MS } from '@constants/timeConstants.js'

interface Service {}

@injectable()
@singleton()
export class CacheService implements Service {
  get lruCache() {
    const lruCache = new LRUCache<string, string[]>({
      max: 150,
      ttl: ONE_HOUR_IN_MS,
    })
    return lruCache
  }
  get generateKey() {
    return {
      trending: (timeframe: string, offset: number, limit: number) =>
        `trending-${timeframe[0]}-${offset}-${limit}`,
    }
  }
}
