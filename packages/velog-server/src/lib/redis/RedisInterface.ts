export type GenerateCacheKey = {
  recommendedPostKey: (postId: string) => string
  postCacheKey: (username: string, postUrlSlug: string) => string
  userCacheKey: (username: string) => string
  postSeriesKey: (username: string, seriesUrlSlug: string) => string
  changeEmailKey: (code: string) => string
}
