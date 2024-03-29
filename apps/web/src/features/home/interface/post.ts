import { Post } from '@/graphql/helpers/generated'
import { AdsQueryResult } from '@/prefetch/getAds'

export type TrendingPost = Post | AdsQueryResult
