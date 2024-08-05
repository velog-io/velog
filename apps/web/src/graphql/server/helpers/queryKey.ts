import {
  FeedPostsQueryVariables,
  GetFollowersQueryVariables,
  GetFollowingsQueryVariables,
  RecentPostsQueryVariables,
  SearchPostsQueryVariables,
  TrendingPostsQueryVariables,
  TrendingWritersQueryVariables,
  VelogPostsQueryVariables,
} from '../generated/server'

export const infiniteTrendingPostsQueryKey = (variables: TrendingPostsQueryVariables) => [
  'trendingPosts.infinite',
  variables,
]

export const infiniteRecentPostsQueryKey = (variables: RecentPostsQueryVariables) => [
  'recentPosts.infinite',
  variables,
]

export const infiniteTrendingWritersQueryKey = (variables: TrendingWritersQueryVariables) => [
  'trendingWriters.infinite',
  variables,
]

export const infiniteGetFollowersQueryKey = (variables: GetFollowersQueryVariables) => [
  'getFollowers.infinite',
  variables,
]

export const infiniteGetFollowingsQueryKey = (variables: GetFollowingsQueryVariables) => [
  'getFollowings.infinite',
  variables,
]

export const infiniteVelogPostsQueryKey = (variables: VelogPostsQueryVariables) => [
  'velogPosts.infinite',
  variables,
]

export const infiniteSearchPostsQueryKey = (variables: SearchPostsQueryVariables) => [
  'searchPosts.infinite',
  variables,
]

export const infiniteFeedPostsQueryKey = (variables: FeedPostsQueryVariables) => [
  'feedPosts.infinite',
  variables,
]
