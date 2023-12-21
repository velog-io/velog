import { Post } from '@/graphql/generated'
import { AdsQueryResult } from '@/prefetch/getAds'

export type TrendingPost = Post | AdsQueryResult
