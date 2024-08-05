import { Post } from '@/graphql/server/generated/server'
import { AdsQueryResult } from '@/prefetch/getAds'

export type TrendingPost = Post | AdsQueryResult
