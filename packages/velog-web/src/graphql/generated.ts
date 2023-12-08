import {
  useMutation,
  useQuery,
  useSuspenseQuery,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
  UseMutationOptions,
  UseQueryOptions,
  UseSuspenseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
  UseSuspenseInfiniteQueryOptions,
} from '@tanstack/react-query'
import { fetcher } from './fetcher'
export type Maybe<T> = T | null
export type InputMaybe<T> = T | undefined
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTimeISO: { input: any; output: any }
  JSON: { input: JSON; output: JSON }
  PositiveInt: { input: number; output: number }
  Void: { input: void; output: void }
}

export type Comment = {
  created_at: Maybe<Scalars['DateTimeISO']['output']>
  deleted: Maybe<Scalars['Boolean']['output']>
  has_replies: Maybe<Scalars['Boolean']['output']>
  id: Scalars['ID']['output']
  level: Maybe<Scalars['Int']['output']>
  likes: Maybe<Scalars['Int']['output']>
  replies: Array<Comment>
  replies_count: Maybe<Scalars['Int']['output']>
  text: Maybe<Scalars['String']['output']>
  user: Maybe<User>
}

export type FollowInput = {
  followingUserId: Scalars['ID']['input']
}

export type FollowResult = {
  id: Scalars['ID']['output']
  is_followed: Scalars['Boolean']['output']
  profile: UserProfile
  userId: Scalars['ID']['output']
  username: Scalars['String']['output']
}

export type GetFollowInput = {
  cursor?: InputMaybe<Scalars['String']['input']>
  limit?: InputMaybe<Scalars['PositiveInt']['input']>
  username: Scalars['String']['input']
}

export type GetPostsInput = {
  cursor?: InputMaybe<Scalars['ID']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
  tag?: InputMaybe<Scalars['String']['input']>
  temp_only?: InputMaybe<Scalars['Boolean']['input']>
  username?: InputMaybe<Scalars['String']['input']>
}

export type GetSearchPostsInput = {
  keyword: Scalars['String']['input']
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  username?: InputMaybe<Scalars['String']['input']>
}

export type GetSeriesInput = {
  id?: InputMaybe<Scalars['ID']['input']>
  url_slug?: InputMaybe<Scalars['String']['input']>
  username?: InputMaybe<Scalars['String']['input']>
}

export type GetSeriesListInput = {
  username: Scalars['String']['input']
}

export type GetUserInput = {
  id?: InputMaybe<Scalars['ID']['input']>
  username?: InputMaybe<Scalars['String']['input']>
}

export type GetVelogConfigInput = {
  username: Scalars['String']['input']
}

export type LikePostInput = {
  postId?: InputMaybe<Scalars['ID']['input']>
}

export type LinkedPosts = {
  next: Maybe<Post>
  previous: Maybe<Post>
}

export type Mutation = {
  follow: Maybe<Scalars['Boolean']['output']>
  likePost: Maybe<Post>
  logout: Maybe<Scalars['Void']['output']>
  sendMail: Maybe<SendMailResponse>
  unfollow: Maybe<Scalars['Boolean']['output']>
  unlikePost: Maybe<Post>
  updateAbout: Maybe<UserProfile>
}

export type MutationFollowArgs = {
  input: FollowInput
}

export type MutationLikePostArgs = {
  input: LikePostInput
}

export type MutationSendMailArgs = {
  input: SendMailInput
}

export type MutationUnfollowArgs = {
  input: UnfollowInput
}

export type MutationUnlikePostArgs = {
  input: UnlikePostInput
}

export type MutationUpdateAboutArgs = {
  input: UpdateAboutInput
}

export type Post = {
  body: Maybe<Scalars['String']['output']>
  comments: Array<Comment>
  comments_count: Maybe<Scalars['Int']['output']>
  created_at: Scalars['DateTimeISO']['output']
  fk_user_id: Scalars['String']['output']
  id: Scalars['ID']['output']
  is_followed: Maybe<Scalars['Boolean']['output']>
  is_liked: Maybe<Scalars['Boolean']['output']>
  is_markdown: Maybe<Scalars['Boolean']['output']>
  is_private: Scalars['Boolean']['output']
  is_temp: Maybe<Scalars['Boolean']['output']>
  last_read_at: Maybe<Scalars['DateTimeISO']['output']>
  likes: Maybe<Scalars['Int']['output']>
  linked_posts: Maybe<LinkedPosts>
  meta: Maybe<Scalars['JSON']['output']>
  original_post_id: Maybe<Scalars['ID']['output']>
  recommended_posts: Array<Post>
  released_at: Maybe<Scalars['DateTimeISO']['output']>
  series: Maybe<Series>
  short_description: Maybe<Scalars['String']['output']>
  tags: Array<Scalars['String']['output']>
  thumbnail: Maybe<Scalars['String']['output']>
  title: Maybe<Scalars['String']['output']>
  updated_at: Scalars['DateTimeISO']['output']
  url_slug: Maybe<Scalars['String']['output']>
  user: Maybe<User>
  views: Maybe<Scalars['Int']['output']>
}

export type PostHistory = {
  body: Maybe<Scalars['String']['output']>
  created_at: Maybe<Scalars['DateTimeISO']['output']>
  fk_post_id: Maybe<Scalars['ID']['output']>
  id: Maybe<Scalars['ID']['output']>
  is_markdown: Maybe<Scalars['Boolean']['output']>
  title: Maybe<Scalars['String']['output']>
}

export type Query = {
  currentUser: Maybe<User>
  followers: Array<FollowResult>
  followings: Array<FollowResult>
  post: Maybe<Post>
  posts: Array<Post>
  readingList: Array<Post>
  recentPosts: Array<Post>
  restoreToken: Maybe<UserToken>
  searchPosts: SearchResult
  series: Maybe<Series>
  seriesList: Array<Series>
  trendingPosts: Array<Post>
  trendingWriters: Array<TrendingWriter>
  user: Maybe<User>
  userTags: Maybe<UserTags>
  velogConfig: Maybe<VelogConfig>
}

export type QueryFollowersArgs = {
  input: GetFollowInput
}

export type QueryFollowingsArgs = {
  input: GetFollowInput
}

export type QueryPostArgs = {
  input: ReadPostInput
}

export type QueryPostsArgs = {
  input: GetPostsInput
}

export type QueryReadingListArgs = {
  input: ReadingListInput
}

export type QueryRecentPostsArgs = {
  input: RecentPostsInput
}

export type QuerySearchPostsArgs = {
  input: GetSearchPostsInput
}

export type QuerySeriesArgs = {
  input: GetSeriesInput
}

export type QuerySeriesListArgs = {
  input: GetSeriesListInput
}

export type QueryTrendingPostsArgs = {
  input: TrendingPostsInput
}

export type QueryTrendingWritersArgs = {
  input: TrendingWritersInput
}

export type QueryUserArgs = {
  input: GetUserInput
}

export type QueryUserTagsArgs = {
  input: UserTagsInput
}

export type QueryVelogConfigArgs = {
  input: GetVelogConfigInput
}

export type ReadCountByDay = {
  count: Maybe<Scalars['Int']['output']>
  day: Maybe<Scalars['DateTimeISO']['output']>
}

export type ReadPostInput = {
  id?: InputMaybe<Scalars['ID']['input']>
  url_slug?: InputMaybe<Scalars['String']['input']>
  username?: InputMaybe<Scalars['String']['input']>
}

export type ReadingListInput = {
  cursor?: InputMaybe<Scalars['ID']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
  type: ReadingListOption
}

export enum ReadingListOption {
  Liked = 'LIKED',
  Read = 'READ',
}

export type RecentPostsInput = {
  cursor?: InputMaybe<Scalars['ID']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
}

export type SearchResult = {
  count: Scalars['Int']['output']
  posts: Array<Post>
}

export type SendMailInput = {
  email: Scalars['String']['input']
}

export type SendMailResponse = {
  registered: Maybe<Scalars['Boolean']['output']>
}

export type Series = {
  created_at: Scalars['DateTimeISO']['output']
  description: Maybe<Scalars['String']['output']>
  fk_user_id: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  name: Maybe<Scalars['String']['output']>
  posts_count: Maybe<Scalars['Int']['output']>
  series_posts: Maybe<Array<SeriesPost>>
  thumbnail: Maybe<Scalars['String']['output']>
  updated_at: Scalars['DateTimeISO']['output']
  url_slug: Maybe<Scalars['String']['output']>
  user: Maybe<User>
}

export type SeriesPost = {
  id: Scalars['ID']['output']
  index: Maybe<Scalars['Int']['output']>
  post: Maybe<Post>
}

export type Stats = {
  count_by_day: Maybe<Array<Maybe<ReadCountByDay>>>
  total: Maybe<Scalars['Int']['output']>
}

export type Tag = {
  created_at: Maybe<Scalars['DateTimeISO']['output']>
  description: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  name: Maybe<Scalars['String']['output']>
  posts_count: Maybe<Scalars['Int']['output']>
  thumbnail: Maybe<Scalars['String']['output']>
}

export type TrendingPostsInput = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  timeframe?: InputMaybe<Scalars['String']['input']>
}

export type TrendingWriter = {
  id: Scalars['ID']['output']
  index: Scalars['Int']['output']
  posts: Array<TrendingWriterPosts>
  user: TrendingWriterUser
}

export type TrendingWriterPosts = {
  id: Scalars['ID']['output']
  thumbnail: Scalars['String']['output']
  title: Scalars['String']['output']
  url_slug: Scalars['String']['output']
}

export type TrendingWriterProfile = {
  display_name: Scalars['String']['output']
  short_bio: Scalars['String']['output']
  thumbnail: Maybe<Scalars['String']['output']>
}

export type TrendingWriterUser = {
  id: Scalars['ID']['output']
  profile: TrendingWriterProfile
  username: Scalars['String']['output']
}

export type TrendingWritersInput = {
  cursor: Scalars['Int']['input']
  limit: Scalars['PositiveInt']['input']
}

export type UnfollowInput = {
  followingUserId: Scalars['ID']['input']
}

export type UnlikePostInput = {
  postId?: InputMaybe<Scalars['ID']['input']>
}

export type UpdateAboutInput = {
  about: Scalars['String']['input']
}

export type User = {
  created_at: Scalars['DateTimeISO']['output']
  email: Maybe<Scalars['String']['output']>
  followers_count: Scalars['Int']['output']
  followings_count: Scalars['Int']['output']
  id: Scalars['ID']['output']
  is_certified: Scalars['Boolean']['output']
  is_followed: Scalars['Boolean']['output']
  profile: UserProfile
  series_list: Array<Series>
  updated_at: Scalars['DateTimeISO']['output']
  user_meta: Maybe<UserMeta>
  username: Scalars['String']['output']
  velog_config: Maybe<VelogConfig>
}

export type UserMeta = {
  email_notification: Maybe<Scalars['Boolean']['output']>
  email_promotion: Maybe<Scalars['Boolean']['output']>
  id: Scalars['ID']['output']
}

export type UserProfile = {
  about: Scalars['String']['output']
  created_at: Scalars['DateTimeISO']['output']
  display_name: Scalars['String']['output']
  id: Scalars['ID']['output']
  profile_links: Scalars['JSON']['output']
  short_bio: Scalars['String']['output']
  thumbnail: Maybe<Scalars['String']['output']>
  updated_at: Scalars['DateTimeISO']['output']
}

export type UserTags = {
  posts_count: Scalars['Int']['output']
  tags: Array<Tag>
}

export type UserTagsInput = {
  username: Scalars['String']['input']
}

export type UserToken = {
  accessToken: Scalars['String']['output']
  refreshToken: Scalars['String']['output']
}

export type VelogConfig = {
  id: Scalars['ID']['output']
  logo_image: Maybe<Scalars['String']['output']>
  title: Maybe<Scalars['String']['output']>
}

export type SendMailMutationVariables = Exact<{
  input: SendMailInput
}>

export type SendMailMutation = { sendMail: { registered: boolean | null } | null }

export type FollowMutationVariables = Exact<{
  input: FollowInput
}>

export type FollowMutation = { follow: boolean | null }

export type UnfollowMutationVariables = Exact<{
  input: UnfollowInput
}>

export type UnfollowMutation = { unfollow: boolean | null }

export type GetFollowersQueryVariables = Exact<{
  input: GetFollowInput
}>

export type GetFollowersQuery = {
  followers: Array<{
    id: string
    userId: string
    username: string
    is_followed: boolean
    profile: { short_bio: string; thumbnail: string | null }
  }>
}

export type GetFollowingsQueryVariables = Exact<{
  input: GetFollowInput
}>

export type GetFollowingsQuery = {
  followings: Array<{
    id: string
    userId: string
    username: string
    is_followed: boolean
    profile: { short_bio: string; thumbnail: string | null }
  }>
}

export type ReadPostQueryVariables = Exact<{
  input: ReadPostInput
}>

export type ReadPostQuery = {
  post: {
    id: string
    title: string | null
    released_at: any | null
    updated_at: any
    body: string | null
    short_description: string | null
    is_markdown: boolean | null
    is_private: boolean
    is_temp: boolean | null
    thumbnail: string | null
    comments_count: number | null
    url_slug: string | null
    likes: number | null
    is_liked: boolean | null
    is_followed: boolean | null
    user: {
      id: string
      username: string
      profile: {
        id: string
        display_name: string
        thumbnail: string | null
        short_bio: string
        profile_links: JSON
      }
      velog_config: { title: string | null } | null
    } | null
    comments: Array<{
      id: string
      text: string | null
      replies_count: number | null
      level: number | null
      created_at: any | null
      deleted: boolean | null
      user: {
        id: string
        username: string
        profile: { id: string; thumbnail: string | null }
      } | null
    }>
    series: {
      id: string
      name: string | null
      url_slug: string | null
      series_posts: Array<{
        id: string
        post: {
          id: string
          title: string | null
          url_slug: string | null
          user: { id: string; username: string } | null
        } | null
      }> | null
    } | null
    linked_posts: {
      previous: {
        id: string
        title: string | null
        url_slug: string | null
        user: { id: string; username: string } | null
      } | null
      next: {
        id: string
        title: string | null
        url_slug: string | null
        user: { id: string; username: string } | null
      } | null
    } | null
  } | null
}

export type RecentPostsQueryVariables = Exact<{
  input: RecentPostsInput
}>

export type RecentPostsQuery = {
  recentPosts: Array<{
    id: string
    title: string | null
    short_description: string | null
    thumbnail: string | null
    url_slug: string | null
    released_at: any | null
    updated_at: any
    is_private: boolean
    likes: number | null
    comments_count: number | null
    user: {
      id: string
      username: string
      profile: { id: string; thumbnail: string | null; display_name: string }
    } | null
  }>
}

export type TrendingPostsQueryVariables = Exact<{
  input: TrendingPostsInput
}>

export type TrendingPostsQuery = {
  trendingPosts: Array<{
    id: string
    title: string | null
    short_description: string | null
    thumbnail: string | null
    likes: number | null
    url_slug: string | null
    released_at: any | null
    updated_at: any
    is_private: boolean
    comments_count: number | null
    user: {
      id: string
      username: string
      profile: { id: string; thumbnail: string | null; display_name: string }
    } | null
  }>
}

export type VelogPostsQueryVariables = Exact<{
  input: GetPostsInput
}>

export type VelogPostsQuery = {
  posts: Array<{
    id: string
    title: string | null
    short_description: string | null
    thumbnail: string | null
    url_slug: string | null
    released_at: any | null
    updated_at: any
    comments_count: number | null
    tags: Array<string>
    is_private: boolean
    likes: number | null
    user: {
      id: string
      username: string
      profile: { id: string; thumbnail: string | null; display_name: string }
    } | null
  }>
}

export type SearchPostsQueryVariables = Exact<{
  input: GetSearchPostsInput
}>

export type SearchPostsQuery = {
  searchPosts: {
    count: number
    posts: Array<{
      id: string
      title: string | null
      short_description: string | null
      thumbnail: string | null
      url_slug: string | null
      released_at: any | null
      tags: Array<string>
      is_private: boolean
      comments_count: number | null
      user: {
        id: string
        username: string
        profile: { id: string; thumbnail: string | null; display_name: string }
      } | null
    }>
  }
}

export type UserTagsQueryVariables = Exact<{
  input: UserTagsInput
}>

export type UserTagsQuery = {
  userTags: {
    posts_count: number
    tags: Array<{
      id: string
      name: string | null
      description: string | null
      posts_count: number | null
      thumbnail: string | null
    }>
  } | null
}

export type GetUserQueryVariables = Exact<{
  input: GetUserInput
}>

export type GetUserQuery = {
  user: {
    id: string
    username: string
    profile: {
      id: string
      display_name: string
      short_bio: string
      thumbnail: string | null
      profile_links: JSON
    }
  } | null
}

export type GetUserFollowInfoQueryVariables = Exact<{
  input: GetUserInput
}>

export type GetUserFollowInfoQuery = {
  user: {
    id: string
    username: string
    followers_count: number
    followings_count: number
    is_followed: boolean
    profile: {
      id: string
      display_name: string
      short_bio: string
      thumbnail: string | null
      profile_links: JSON
    }
  } | null
}

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserQuery = {
  currentUser: {
    id: string
    username: string
    email: string | null
    profile: { id: string; thumbnail: string | null; display_name: string }
    user_meta: {
      id: string
      email_notification: boolean | null
      email_promotion: boolean | null
    } | null
  } | null
}

export type LogoutMutationVariables = Exact<{ [key: string]: never }>

export type LogoutMutation = { logout: void | null }

export type VelogConfigQueryVariables = Exact<{
  input: GetVelogConfigInput
}>

export type VelogConfigQuery = {
  velogConfig: { title: string | null; logo_image: string | null } | null
}

export type GetUserAboutQueryVariables = Exact<{
  input: GetUserInput
}>

export type GetUserAboutQuery = {
  user: { id: string; profile: { id: string; about: string; display_name: string } } | null
}

export type GetUserSeriesListQueryVariables = Exact<{
  input: GetUserInput
}>

export type GetUserSeriesListQuery = {
  user: {
    id: string
    series_list: Array<{
      id: string
      name: string | null
      description: string | null
      url_slug: string | null
      thumbnail: string | null
      updated_at: any
      posts_count: number | null
    }>
  } | null
}

export type UpdateAboutMutationVariables = Exact<{
  input: UpdateAboutInput
}>

export type UpdateAboutMutation = { updateAbout: { id: string; about: string } | null }

export type TrendingWritersQueryVariables = Exact<{
  input: TrendingWritersInput
}>

export type TrendingWritersQuery = {
  trendingWriters: Array<{
    index: number
    id: string
    user: {
      id: string
      username: string
      profile: { display_name: string; thumbnail: string | null }
    }
    posts: Array<{ title: string; url_slug: string }>
  }>
}

export const SendMailDocument = `
    mutation sendMail($input: SendMailInput!) {
  sendMail(input: $input) {
    registered
  }
}
    `

export const useSendMailMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<SendMailMutation, TError, SendMailMutationVariables, TContext>,
) => {
  return useMutation<SendMailMutation, TError, SendMailMutationVariables, TContext>({
    mutationKey: ['sendMail'],
    mutationFn: (variables?: SendMailMutationVariables) =>
      fetcher<SendMailMutation, SendMailMutationVariables>(SendMailDocument, variables)(),
    ...options,
  })
}

useSendMailMutation.getKey = () => ['sendMail']

export const FollowDocument = `
    mutation follow($input: FollowInput!) {
  follow(input: $input)
}
    `

export const useFollowMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<FollowMutation, TError, FollowMutationVariables, TContext>,
) => {
  return useMutation<FollowMutation, TError, FollowMutationVariables, TContext>({
    mutationKey: ['follow'],
    mutationFn: (variables?: FollowMutationVariables) =>
      fetcher<FollowMutation, FollowMutationVariables>(FollowDocument, variables)(),
    ...options,
  })
}

useFollowMutation.getKey = () => ['follow']

export const UnfollowDocument = `
    mutation unfollow($input: UnfollowInput!) {
  unfollow(input: $input)
}
    `

export const useUnfollowMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<UnfollowMutation, TError, UnfollowMutationVariables, TContext>,
) => {
  return useMutation<UnfollowMutation, TError, UnfollowMutationVariables, TContext>({
    mutationKey: ['unfollow'],
    mutationFn: (variables?: UnfollowMutationVariables) =>
      fetcher<UnfollowMutation, UnfollowMutationVariables>(UnfollowDocument, variables)(),
    ...options,
  })
}

useUnfollowMutation.getKey = () => ['unfollow']

export const GetFollowersDocument = `
    query getFollowers($input: GetFollowInput!) {
  followers(input: $input) {
    id
    userId
    username
    profile {
      short_bio
      thumbnail
    }
    is_followed
  }
}
    `

export const useGetFollowersQuery = <TData = GetFollowersQuery, TError = unknown>(
  variables: GetFollowersQueryVariables,
  options?: Omit<UseQueryOptions<GetFollowersQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetFollowersQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<GetFollowersQuery, TError, TData>({
    queryKey: ['getFollowers', variables],
    queryFn: fetcher<GetFollowersQuery, GetFollowersQueryVariables>(
      GetFollowersDocument,
      variables,
    ),
    ...options,
  })
}

useGetFollowersQuery.getKey = (variables: GetFollowersQueryVariables) => ['getFollowers', variables]

export const useSuspenseGetFollowersQuery = <TData = GetFollowersQuery, TError = unknown>(
  variables: GetFollowersQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<GetFollowersQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<GetFollowersQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<GetFollowersQuery, TError, TData>({
    queryKey: ['getFollowersSuspense', variables],
    queryFn: fetcher<GetFollowersQuery, GetFollowersQueryVariables>(
      GetFollowersDocument,
      variables,
    ),
    ...options,
  })
}

useSuspenseGetFollowersQuery.getKey = (variables: GetFollowersQueryVariables) => [
  'getFollowersSuspense',
  variables,
]

export const useInfiniteGetFollowersQuery = <
  TData = InfiniteData<GetFollowersQuery>,
  TError = unknown,
>(
  variables: GetFollowersQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetFollowersQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetFollowersQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<GetFollowersQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['getFollowers.infinite', variables],
        queryFn: (metaData) =>
          fetcher<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteGetFollowersQuery.getKey = (variables: GetFollowersQueryVariables) => [
  'getFollowers.infinite',
  variables,
]

export const useSuspenseInfiniteGetFollowersQuery = <
  TData = InfiniteData<GetFollowersQuery>,
  TError = unknown,
>(
  variables: GetFollowersQueryVariables,
  options: Omit<UseSuspenseInfiniteQueryOptions<GetFollowersQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseInfiniteQueryOptions<GetFollowersQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<GetFollowersQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['getFollowers.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteGetFollowersQuery.getKey = (variables: GetFollowersQueryVariables) => [
  'getFollowers.infiniteSuspense',
  variables,
]

export const GetFollowingsDocument = `
    query getFollowings($input: GetFollowInput!) {
  followings(input: $input) {
    id
    userId
    username
    profile {
      short_bio
      thumbnail
    }
    is_followed
  }
}
    `

export const useGetFollowingsQuery = <TData = GetFollowingsQuery, TError = unknown>(
  variables: GetFollowingsQueryVariables,
  options?: Omit<UseQueryOptions<GetFollowingsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetFollowingsQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<GetFollowingsQuery, TError, TData>({
    queryKey: ['getFollowings', variables],
    queryFn: fetcher<GetFollowingsQuery, GetFollowingsQueryVariables>(
      GetFollowingsDocument,
      variables,
    ),
    ...options,
  })
}

useGetFollowingsQuery.getKey = (variables: GetFollowingsQueryVariables) => [
  'getFollowings',
  variables,
]

export const useSuspenseGetFollowingsQuery = <TData = GetFollowingsQuery, TError = unknown>(
  variables: GetFollowingsQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<GetFollowingsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<GetFollowingsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<GetFollowingsQuery, TError, TData>({
    queryKey: ['getFollowingsSuspense', variables],
    queryFn: fetcher<GetFollowingsQuery, GetFollowingsQueryVariables>(
      GetFollowingsDocument,
      variables,
    ),
    ...options,
  })
}

useSuspenseGetFollowingsQuery.getKey = (variables: GetFollowingsQueryVariables) => [
  'getFollowingsSuspense',
  variables,
]

export const useInfiniteGetFollowingsQuery = <
  TData = InfiniteData<GetFollowingsQuery>,
  TError = unknown,
>(
  variables: GetFollowingsQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetFollowingsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetFollowingsQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<GetFollowingsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['getFollowings.infinite', variables],
        queryFn: (metaData) =>
          fetcher<GetFollowingsQuery, GetFollowingsQueryVariables>(GetFollowingsDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteGetFollowingsQuery.getKey = (variables: GetFollowingsQueryVariables) => [
  'getFollowings.infinite',
  variables,
]

export const useSuspenseInfiniteGetFollowingsQuery = <
  TData = InfiniteData<GetFollowingsQuery>,
  TError = unknown,
>(
  variables: GetFollowingsQueryVariables,
  options: Omit<UseSuspenseInfiniteQueryOptions<GetFollowingsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseInfiniteQueryOptions<GetFollowingsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<GetFollowingsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['getFollowings.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<GetFollowingsQuery, GetFollowingsQueryVariables>(GetFollowingsDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteGetFollowingsQuery.getKey = (variables: GetFollowingsQueryVariables) => [
  'getFollowings.infiniteSuspense',
  variables,
]

export const ReadPostDocument = `
    query readPost($input: ReadPostInput!) {
  post(input: $input) {
    id
    title
    released_at
    updated_at
    body
    short_description
    is_markdown
    is_private
    is_temp
    thumbnail
    comments_count
    url_slug
    likes
    is_liked
    is_followed
    user {
      id
      username
      profile {
        id
        display_name
        thumbnail
        short_bio
        profile_links
      }
      velog_config {
        title
      }
    }
    comments {
      id
      user {
        id
        username
        profile {
          id
          thumbnail
        }
      }
      text
      replies_count
      level
      created_at
      level
      deleted
    }
    series {
      id
      name
      url_slug
      series_posts {
        id
        post {
          id
          title
          url_slug
          user {
            id
            username
          }
        }
      }
    }
    linked_posts {
      previous {
        id
        title
        url_slug
        user {
          id
          username
        }
      }
      next {
        id
        title
        url_slug
        user {
          id
          username
        }
      }
    }
  }
}
    `

export const useReadPostQuery = <TData = ReadPostQuery, TError = unknown>(
  variables: ReadPostQueryVariables,
  options?: Omit<UseQueryOptions<ReadPostQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<ReadPostQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<ReadPostQuery, TError, TData>({
    queryKey: ['readPost', variables],
    queryFn: fetcher<ReadPostQuery, ReadPostQueryVariables>(ReadPostDocument, variables),
    ...options,
  })
}

useReadPostQuery.getKey = (variables: ReadPostQueryVariables) => ['readPost', variables]

export const useSuspenseReadPostQuery = <TData = ReadPostQuery, TError = unknown>(
  variables: ReadPostQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<ReadPostQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<ReadPostQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<ReadPostQuery, TError, TData>({
    queryKey: ['readPostSuspense', variables],
    queryFn: fetcher<ReadPostQuery, ReadPostQueryVariables>(ReadPostDocument, variables),
    ...options,
  })
}

useSuspenseReadPostQuery.getKey = (variables: ReadPostQueryVariables) => [
  'readPostSuspense',
  variables,
]

export const useInfiniteReadPostQuery = <TData = InfiniteData<ReadPostQuery>, TError = unknown>(
  variables: ReadPostQueryVariables,
  options: Omit<UseInfiniteQueryOptions<ReadPostQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<ReadPostQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<ReadPostQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['readPost.infinite', variables],
        queryFn: (metaData) =>
          fetcher<ReadPostQuery, ReadPostQueryVariables>(ReadPostDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteReadPostQuery.getKey = (variables: ReadPostQueryVariables) => [
  'readPost.infinite',
  variables,
]

export const useSuspenseInfiniteReadPostQuery = <
  TData = InfiniteData<ReadPostQuery>,
  TError = unknown,
>(
  variables: ReadPostQueryVariables,
  options: Omit<UseSuspenseInfiniteQueryOptions<ReadPostQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseInfiniteQueryOptions<ReadPostQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<ReadPostQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['readPost.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<ReadPostQuery, ReadPostQueryVariables>(ReadPostDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteReadPostQuery.getKey = (variables: ReadPostQueryVariables) => [
  'readPost.infiniteSuspense',
  variables,
]

export const RecentPostsDocument = `
    query recentPosts($input: RecentPostsInput!) {
  recentPosts(input: $input) {
    id
    title
    short_description
    thumbnail
    user {
      id
      username
      profile {
        id
        thumbnail
        display_name
      }
    }
    url_slug
    released_at
    updated_at
    is_private
    likes
    comments_count
  }
}
    `

export const useRecentPostsQuery = <TData = RecentPostsQuery, TError = unknown>(
  variables: RecentPostsQueryVariables,
  options?: Omit<UseQueryOptions<RecentPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<RecentPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<RecentPostsQuery, TError, TData>({
    queryKey: ['recentPosts', variables],
    queryFn: fetcher<RecentPostsQuery, RecentPostsQueryVariables>(RecentPostsDocument, variables),
    ...options,
  })
}

useRecentPostsQuery.getKey = (variables: RecentPostsQueryVariables) => ['recentPosts', variables]

export const useSuspenseRecentPostsQuery = <TData = RecentPostsQuery, TError = unknown>(
  variables: RecentPostsQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<RecentPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<RecentPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<RecentPostsQuery, TError, TData>({
    queryKey: ['recentPostsSuspense', variables],
    queryFn: fetcher<RecentPostsQuery, RecentPostsQueryVariables>(RecentPostsDocument, variables),
    ...options,
  })
}

useSuspenseRecentPostsQuery.getKey = (variables: RecentPostsQueryVariables) => [
  'recentPostsSuspense',
  variables,
]

export const useInfiniteRecentPostsQuery = <
  TData = InfiniteData<RecentPostsQuery>,
  TError = unknown,
>(
  variables: RecentPostsQueryVariables,
  options: Omit<UseInfiniteQueryOptions<RecentPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<RecentPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<RecentPostsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['recentPosts.infinite', variables],
        queryFn: (metaData) =>
          fetcher<RecentPostsQuery, RecentPostsQueryVariables>(RecentPostsDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteRecentPostsQuery.getKey = (variables: RecentPostsQueryVariables) => [
  'recentPosts.infinite',
  variables,
]

export const useSuspenseInfiniteRecentPostsQuery = <
  TData = InfiniteData<RecentPostsQuery>,
  TError = unknown,
>(
  variables: RecentPostsQueryVariables,
  options: Omit<UseSuspenseInfiniteQueryOptions<RecentPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseInfiniteQueryOptions<RecentPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<RecentPostsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['recentPosts.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<RecentPostsQuery, RecentPostsQueryVariables>(RecentPostsDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteRecentPostsQuery.getKey = (variables: RecentPostsQueryVariables) => [
  'recentPosts.infiniteSuspense',
  variables,
]

export const TrendingPostsDocument = `
    query trendingPosts($input: TrendingPostsInput!) {
  trendingPosts(input: $input) {
    id
    title
    short_description
    thumbnail
    likes
    user {
      id
      username
      profile {
        id
        thumbnail
        display_name
      }
    }
    url_slug
    released_at
    updated_at
    is_private
    comments_count
  }
}
    `

export const useTrendingPostsQuery = <TData = TrendingPostsQuery, TError = unknown>(
  variables: TrendingPostsQueryVariables,
  options?: Omit<UseQueryOptions<TrendingPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<TrendingPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<TrendingPostsQuery, TError, TData>({
    queryKey: ['trendingPosts', variables],
    queryFn: fetcher<TrendingPostsQuery, TrendingPostsQueryVariables>(
      TrendingPostsDocument,
      variables,
    ),
    ...options,
  })
}

useTrendingPostsQuery.getKey = (variables: TrendingPostsQueryVariables) => [
  'trendingPosts',
  variables,
]

export const useSuspenseTrendingPostsQuery = <TData = TrendingPostsQuery, TError = unknown>(
  variables: TrendingPostsQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<TrendingPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<TrendingPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<TrendingPostsQuery, TError, TData>({
    queryKey: ['trendingPostsSuspense', variables],
    queryFn: fetcher<TrendingPostsQuery, TrendingPostsQueryVariables>(
      TrendingPostsDocument,
      variables,
    ),
    ...options,
  })
}

useSuspenseTrendingPostsQuery.getKey = (variables: TrendingPostsQueryVariables) => [
  'trendingPostsSuspense',
  variables,
]

export const useInfiniteTrendingPostsQuery = <
  TData = InfiniteData<TrendingPostsQuery>,
  TError = unknown,
>(
  variables: TrendingPostsQueryVariables,
  options: Omit<UseInfiniteQueryOptions<TrendingPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<TrendingPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<TrendingPostsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['trendingPosts.infinite', variables],
        queryFn: (metaData) =>
          fetcher<TrendingPostsQuery, TrendingPostsQueryVariables>(TrendingPostsDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteTrendingPostsQuery.getKey = (variables: TrendingPostsQueryVariables) => [
  'trendingPosts.infinite',
  variables,
]

export const useSuspenseInfiniteTrendingPostsQuery = <
  TData = InfiniteData<TrendingPostsQuery>,
  TError = unknown,
>(
  variables: TrendingPostsQueryVariables,
  options: Omit<UseSuspenseInfiniteQueryOptions<TrendingPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseInfiniteQueryOptions<TrendingPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<TrendingPostsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['trendingPosts.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<TrendingPostsQuery, TrendingPostsQueryVariables>(TrendingPostsDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteTrendingPostsQuery.getKey = (variables: TrendingPostsQueryVariables) => [
  'trendingPosts.infiniteSuspense',
  variables,
]

export const VelogPostsDocument = `
    query velogPosts($input: GetPostsInput!) {
  posts(input: $input) {
    id
    title
    short_description
    thumbnail
    user {
      id
      username
      profile {
        id
        thumbnail
        display_name
      }
    }
    url_slug
    released_at
    updated_at
    comments_count
    tags
    is_private
    likes
  }
}
    `

export const useVelogPostsQuery = <TData = VelogPostsQuery, TError = unknown>(
  variables: VelogPostsQueryVariables,
  options?: Omit<UseQueryOptions<VelogPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<VelogPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<VelogPostsQuery, TError, TData>({
    queryKey: ['velogPosts', variables],
    queryFn: fetcher<VelogPostsQuery, VelogPostsQueryVariables>(VelogPostsDocument, variables),
    ...options,
  })
}

useVelogPostsQuery.getKey = (variables: VelogPostsQueryVariables) => ['velogPosts', variables]

export const useSuspenseVelogPostsQuery = <TData = VelogPostsQuery, TError = unknown>(
  variables: VelogPostsQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<VelogPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<VelogPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<VelogPostsQuery, TError, TData>({
    queryKey: ['velogPostsSuspense', variables],
    queryFn: fetcher<VelogPostsQuery, VelogPostsQueryVariables>(VelogPostsDocument, variables),
    ...options,
  })
}

useSuspenseVelogPostsQuery.getKey = (variables: VelogPostsQueryVariables) => [
  'velogPostsSuspense',
  variables,
]

export const useInfiniteVelogPostsQuery = <TData = InfiniteData<VelogPostsQuery>, TError = unknown>(
  variables: VelogPostsQueryVariables,
  options: Omit<UseInfiniteQueryOptions<VelogPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<VelogPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<VelogPostsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['velogPosts.infinite', variables],
        queryFn: (metaData) =>
          fetcher<VelogPostsQuery, VelogPostsQueryVariables>(VelogPostsDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteVelogPostsQuery.getKey = (variables: VelogPostsQueryVariables) => [
  'velogPosts.infinite',
  variables,
]

export const useSuspenseInfiniteVelogPostsQuery = <
  TData = InfiniteData<VelogPostsQuery>,
  TError = unknown,
>(
  variables: VelogPostsQueryVariables,
  options: Omit<UseSuspenseInfiniteQueryOptions<VelogPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseInfiniteQueryOptions<VelogPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<VelogPostsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['velogPosts.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<VelogPostsQuery, VelogPostsQueryVariables>(VelogPostsDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteVelogPostsQuery.getKey = (variables: VelogPostsQueryVariables) => [
  'velogPosts.infiniteSuspense',
  variables,
]

export const SearchPostsDocument = `
    query searchPosts($input: GetSearchPostsInput!) {
  searchPosts(input: $input) {
    count
    posts {
      id
      title
      short_description
      thumbnail
      user {
        id
        username
        profile {
          id
          thumbnail
          display_name
        }
      }
      url_slug
      released_at
      tags
      is_private
      comments_count
    }
  }
}
    `

export const useSearchPostsQuery = <TData = SearchPostsQuery, TError = unknown>(
  variables: SearchPostsQueryVariables,
  options?: Omit<UseQueryOptions<SearchPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<SearchPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<SearchPostsQuery, TError, TData>({
    queryKey: ['searchPosts', variables],
    queryFn: fetcher<SearchPostsQuery, SearchPostsQueryVariables>(SearchPostsDocument, variables),
    ...options,
  })
}

useSearchPostsQuery.getKey = (variables: SearchPostsQueryVariables) => ['searchPosts', variables]

export const useSuspenseSearchPostsQuery = <TData = SearchPostsQuery, TError = unknown>(
  variables: SearchPostsQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<SearchPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<SearchPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<SearchPostsQuery, TError, TData>({
    queryKey: ['searchPostsSuspense', variables],
    queryFn: fetcher<SearchPostsQuery, SearchPostsQueryVariables>(SearchPostsDocument, variables),
    ...options,
  })
}

useSuspenseSearchPostsQuery.getKey = (variables: SearchPostsQueryVariables) => [
  'searchPostsSuspense',
  variables,
]

export const useInfiniteSearchPostsQuery = <
  TData = InfiniteData<SearchPostsQuery>,
  TError = unknown,
>(
  variables: SearchPostsQueryVariables,
  options: Omit<UseInfiniteQueryOptions<SearchPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<SearchPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<SearchPostsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['searchPosts.infinite', variables],
        queryFn: (metaData) =>
          fetcher<SearchPostsQuery, SearchPostsQueryVariables>(SearchPostsDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteSearchPostsQuery.getKey = (variables: SearchPostsQueryVariables) => [
  'searchPosts.infinite',
  variables,
]

export const useSuspenseInfiniteSearchPostsQuery = <
  TData = InfiniteData<SearchPostsQuery>,
  TError = unknown,
>(
  variables: SearchPostsQueryVariables,
  options: Omit<UseSuspenseInfiniteQueryOptions<SearchPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseInfiniteQueryOptions<SearchPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<SearchPostsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['searchPosts.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<SearchPostsQuery, SearchPostsQueryVariables>(SearchPostsDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteSearchPostsQuery.getKey = (variables: SearchPostsQueryVariables) => [
  'searchPosts.infiniteSuspense',
  variables,
]

export const UserTagsDocument = `
    query userTags($input: UserTagsInput!) {
  userTags(input: $input) {
    tags {
      id
      name
      description
      posts_count
      thumbnail
    }
    posts_count
  }
}
    `

export const useUserTagsQuery = <TData = UserTagsQuery, TError = unknown>(
  variables: UserTagsQueryVariables,
  options?: Omit<UseQueryOptions<UserTagsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<UserTagsQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<UserTagsQuery, TError, TData>({
    queryKey: ['userTags', variables],
    queryFn: fetcher<UserTagsQuery, UserTagsQueryVariables>(UserTagsDocument, variables),
    ...options,
  })
}

useUserTagsQuery.getKey = (variables: UserTagsQueryVariables) => ['userTags', variables]

export const useSuspenseUserTagsQuery = <TData = UserTagsQuery, TError = unknown>(
  variables: UserTagsQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<UserTagsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<UserTagsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<UserTagsQuery, TError, TData>({
    queryKey: ['userTagsSuspense', variables],
    queryFn: fetcher<UserTagsQuery, UserTagsQueryVariables>(UserTagsDocument, variables),
    ...options,
  })
}

useSuspenseUserTagsQuery.getKey = (variables: UserTagsQueryVariables) => [
  'userTagsSuspense',
  variables,
]

export const useInfiniteUserTagsQuery = <TData = InfiniteData<UserTagsQuery>, TError = unknown>(
  variables: UserTagsQueryVariables,
  options: Omit<UseInfiniteQueryOptions<UserTagsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<UserTagsQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<UserTagsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['userTags.infinite', variables],
        queryFn: (metaData) =>
          fetcher<UserTagsQuery, UserTagsQueryVariables>(UserTagsDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteUserTagsQuery.getKey = (variables: UserTagsQueryVariables) => [
  'userTags.infinite',
  variables,
]

export const useSuspenseInfiniteUserTagsQuery = <
  TData = InfiniteData<UserTagsQuery>,
  TError = unknown,
>(
  variables: UserTagsQueryVariables,
  options: Omit<UseSuspenseInfiniteQueryOptions<UserTagsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseInfiniteQueryOptions<UserTagsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<UserTagsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['userTags.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<UserTagsQuery, UserTagsQueryVariables>(UserTagsDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteUserTagsQuery.getKey = (variables: UserTagsQueryVariables) => [
  'userTags.infiniteSuspense',
  variables,
]

export const GetUserDocument = `
    query getUser($input: GetUserInput!) {
  user(input: $input) {
    id
    username
    profile {
      id
      display_name
      short_bio
      thumbnail
      profile_links
    }
  }
}
    `

export const useGetUserQuery = <TData = GetUserQuery, TError = unknown>(
  variables: GetUserQueryVariables,
  options?: Omit<UseQueryOptions<GetUserQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetUserQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<GetUserQuery, TError, TData>({
    queryKey: ['getUser', variables],
    queryFn: fetcher<GetUserQuery, GetUserQueryVariables>(GetUserDocument, variables),
    ...options,
  })
}

useGetUserQuery.getKey = (variables: GetUserQueryVariables) => ['getUser', variables]

export const useSuspenseGetUserQuery = <TData = GetUserQuery, TError = unknown>(
  variables: GetUserQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<GetUserQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<GetUserQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<GetUserQuery, TError, TData>({
    queryKey: ['getUserSuspense', variables],
    queryFn: fetcher<GetUserQuery, GetUserQueryVariables>(GetUserDocument, variables),
    ...options,
  })
}

useSuspenseGetUserQuery.getKey = (variables: GetUserQueryVariables) => [
  'getUserSuspense',
  variables,
]

export const useInfiniteGetUserQuery = <TData = InfiniteData<GetUserQuery>, TError = unknown>(
  variables: GetUserQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetUserQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetUserQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<GetUserQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['getUser.infinite', variables],
        queryFn: (metaData) =>
          fetcher<GetUserQuery, GetUserQueryVariables>(GetUserDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteGetUserQuery.getKey = (variables: GetUserQueryVariables) => [
  'getUser.infinite',
  variables,
]

export const useSuspenseInfiniteGetUserQuery = <
  TData = InfiniteData<GetUserQuery>,
  TError = unknown,
>(
  variables: GetUserQueryVariables,
  options: Omit<UseSuspenseInfiniteQueryOptions<GetUserQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseInfiniteQueryOptions<GetUserQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<GetUserQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['getUser.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<GetUserQuery, GetUserQueryVariables>(GetUserDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteGetUserQuery.getKey = (variables: GetUserQueryVariables) => [
  'getUser.infiniteSuspense',
  variables,
]

export const GetUserFollowInfoDocument = `
    query getUserFollowInfo($input: GetUserInput!) {
  user(input: $input) {
    id
    username
    profile {
      id
      display_name
      short_bio
      thumbnail
      profile_links
    }
    followers_count
    followings_count
    is_followed
  }
}
    `

export const useGetUserFollowInfoQuery = <TData = GetUserFollowInfoQuery, TError = unknown>(
  variables: GetUserFollowInfoQueryVariables,
  options?: Omit<UseQueryOptions<GetUserFollowInfoQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetUserFollowInfoQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<GetUserFollowInfoQuery, TError, TData>({
    queryKey: ['getUserFollowInfo', variables],
    queryFn: fetcher<GetUserFollowInfoQuery, GetUserFollowInfoQueryVariables>(
      GetUserFollowInfoDocument,
      variables,
    ),
    ...options,
  })
}

useGetUserFollowInfoQuery.getKey = (variables: GetUserFollowInfoQueryVariables) => [
  'getUserFollowInfo',
  variables,
]

export const useSuspenseGetUserFollowInfoQuery = <TData = GetUserFollowInfoQuery, TError = unknown>(
  variables: GetUserFollowInfoQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<GetUserFollowInfoQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<GetUserFollowInfoQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<GetUserFollowInfoQuery, TError, TData>({
    queryKey: ['getUserFollowInfoSuspense', variables],
    queryFn: fetcher<GetUserFollowInfoQuery, GetUserFollowInfoQueryVariables>(
      GetUserFollowInfoDocument,
      variables,
    ),
    ...options,
  })
}

useSuspenseGetUserFollowInfoQuery.getKey = (variables: GetUserFollowInfoQueryVariables) => [
  'getUserFollowInfoSuspense',
  variables,
]

export const useInfiniteGetUserFollowInfoQuery = <
  TData = InfiniteData<GetUserFollowInfoQuery>,
  TError = unknown,
>(
  variables: GetUserFollowInfoQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetUserFollowInfoQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetUserFollowInfoQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<GetUserFollowInfoQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['getUserFollowInfo.infinite', variables],
        queryFn: (metaData) =>
          fetcher<GetUserFollowInfoQuery, GetUserFollowInfoQueryVariables>(
            GetUserFollowInfoDocument,
            { ...variables, ...(metaData.pageParam ?? {}) },
          )(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteGetUserFollowInfoQuery.getKey = (variables: GetUserFollowInfoQueryVariables) => [
  'getUserFollowInfo.infinite',
  variables,
]

export const useSuspenseInfiniteGetUserFollowInfoQuery = <
  TData = InfiniteData<GetUserFollowInfoQuery>,
  TError = unknown,
>(
  variables: GetUserFollowInfoQueryVariables,
  options: Omit<
    UseSuspenseInfiniteQueryOptions<GetUserFollowInfoQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseSuspenseInfiniteQueryOptions<GetUserFollowInfoQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<GetUserFollowInfoQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['getUserFollowInfo.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<GetUserFollowInfoQuery, GetUserFollowInfoQueryVariables>(
            GetUserFollowInfoDocument,
            { ...variables, ...(metaData.pageParam ?? {}) },
          )(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteGetUserFollowInfoQuery.getKey = (variables: GetUserFollowInfoQueryVariables) => [
  'getUserFollowInfo.infiniteSuspense',
  variables,
]

export const CurrentUserDocument = `
    query currentUser {
  currentUser {
    id
    username
    email
    profile {
      id
      thumbnail
      display_name
    }
    user_meta {
      id
      email_notification
      email_promotion
    }
  }
}
    `

export const useCurrentUserQuery = <TData = CurrentUserQuery, TError = unknown>(
  variables?: CurrentUserQueryVariables,
  options?: Omit<UseQueryOptions<CurrentUserQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<CurrentUserQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<CurrentUserQuery, TError, TData>({
    queryKey: variables === undefined ? ['currentUser'] : ['currentUser', variables],
    queryFn: fetcher<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, variables),
    ...options,
  })
}

useCurrentUserQuery.getKey = (variables?: CurrentUserQueryVariables) =>
  variables === undefined ? ['currentUser'] : ['currentUser', variables]

export const useSuspenseCurrentUserQuery = <TData = CurrentUserQuery, TError = unknown>(
  variables?: CurrentUserQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<CurrentUserQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<CurrentUserQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<CurrentUserQuery, TError, TData>({
    queryKey:
      variables === undefined ? ['currentUserSuspense'] : ['currentUserSuspense', variables],
    queryFn: fetcher<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, variables),
    ...options,
  })
}

useSuspenseCurrentUserQuery.getKey = (variables?: CurrentUserQueryVariables) =>
  variables === undefined ? ['currentUserSuspense'] : ['currentUserSuspense', variables]

export const useInfiniteCurrentUserQuery = <
  TData = InfiniteData<CurrentUserQuery>,
  TError = unknown,
>(
  variables: CurrentUserQueryVariables,
  options: Omit<UseInfiniteQueryOptions<CurrentUserQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<CurrentUserQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<CurrentUserQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey:
          optionsQueryKey ?? variables === undefined
            ? ['currentUser.infinite']
            : ['currentUser.infinite', variables],
        queryFn: (metaData) =>
          fetcher<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteCurrentUserQuery.getKey = (variables?: CurrentUserQueryVariables) =>
  variables === undefined ? ['currentUser.infinite'] : ['currentUser.infinite', variables]

export const useSuspenseInfiniteCurrentUserQuery = <
  TData = InfiniteData<CurrentUserQuery>,
  TError = unknown,
>(
  variables: CurrentUserQueryVariables,
  options: Omit<UseSuspenseInfiniteQueryOptions<CurrentUserQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseInfiniteQueryOptions<CurrentUserQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<CurrentUserQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey:
          optionsQueryKey ?? variables === undefined
            ? ['currentUser.infiniteSuspense']
            : ['currentUser.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteCurrentUserQuery.getKey = (variables?: CurrentUserQueryVariables) =>
  variables === undefined
    ? ['currentUser.infiniteSuspense']
    : ['currentUser.infiniteSuspense', variables]

export const LogoutDocument = `
    mutation logout {
  logout
}
    `

export const useLogoutMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<LogoutMutation, TError, LogoutMutationVariables, TContext>,
) => {
  return useMutation<LogoutMutation, TError, LogoutMutationVariables, TContext>({
    mutationKey: ['logout'],
    mutationFn: (variables?: LogoutMutationVariables) =>
      fetcher<LogoutMutation, LogoutMutationVariables>(LogoutDocument, variables)(),
    ...options,
  })
}

useLogoutMutation.getKey = () => ['logout']

export const VelogConfigDocument = `
    query velogConfig($input: GetVelogConfigInput!) {
  velogConfig(input: $input) {
    title
    logo_image
  }
}
    `

export const useVelogConfigQuery = <TData = VelogConfigQuery, TError = unknown>(
  variables: VelogConfigQueryVariables,
  options?: Omit<UseQueryOptions<VelogConfigQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<VelogConfigQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<VelogConfigQuery, TError, TData>({
    queryKey: ['velogConfig', variables],
    queryFn: fetcher<VelogConfigQuery, VelogConfigQueryVariables>(VelogConfigDocument, variables),
    ...options,
  })
}

useVelogConfigQuery.getKey = (variables: VelogConfigQueryVariables) => ['velogConfig', variables]

export const useSuspenseVelogConfigQuery = <TData = VelogConfigQuery, TError = unknown>(
  variables: VelogConfigQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<VelogConfigQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<VelogConfigQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<VelogConfigQuery, TError, TData>({
    queryKey: ['velogConfigSuspense', variables],
    queryFn: fetcher<VelogConfigQuery, VelogConfigQueryVariables>(VelogConfigDocument, variables),
    ...options,
  })
}

useSuspenseVelogConfigQuery.getKey = (variables: VelogConfigQueryVariables) => [
  'velogConfigSuspense',
  variables,
]

export const useInfiniteVelogConfigQuery = <
  TData = InfiniteData<VelogConfigQuery>,
  TError = unknown,
>(
  variables: VelogConfigQueryVariables,
  options: Omit<UseInfiniteQueryOptions<VelogConfigQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<VelogConfigQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<VelogConfigQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['velogConfig.infinite', variables],
        queryFn: (metaData) =>
          fetcher<VelogConfigQuery, VelogConfigQueryVariables>(VelogConfigDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteVelogConfigQuery.getKey = (variables: VelogConfigQueryVariables) => [
  'velogConfig.infinite',
  variables,
]

export const useSuspenseInfiniteVelogConfigQuery = <
  TData = InfiniteData<VelogConfigQuery>,
  TError = unknown,
>(
  variables: VelogConfigQueryVariables,
  options: Omit<UseSuspenseInfiniteQueryOptions<VelogConfigQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseInfiniteQueryOptions<VelogConfigQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<VelogConfigQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['velogConfig.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<VelogConfigQuery, VelogConfigQueryVariables>(VelogConfigDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteVelogConfigQuery.getKey = (variables: VelogConfigQueryVariables) => [
  'velogConfig.infiniteSuspense',
  variables,
]

export const GetUserAboutDocument = `
    query getUserAbout($input: GetUserInput!) {
  user(input: $input) {
    id
    profile {
      id
      about
      display_name
    }
  }
}
    `

export const useGetUserAboutQuery = <TData = GetUserAboutQuery, TError = unknown>(
  variables: GetUserAboutQueryVariables,
  options?: Omit<UseQueryOptions<GetUserAboutQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetUserAboutQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<GetUserAboutQuery, TError, TData>({
    queryKey: ['getUserAbout', variables],
    queryFn: fetcher<GetUserAboutQuery, GetUserAboutQueryVariables>(
      GetUserAboutDocument,
      variables,
    ),
    ...options,
  })
}

useGetUserAboutQuery.getKey = (variables: GetUserAboutQueryVariables) => ['getUserAbout', variables]

export const useSuspenseGetUserAboutQuery = <TData = GetUserAboutQuery, TError = unknown>(
  variables: GetUserAboutQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<GetUserAboutQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<GetUserAboutQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<GetUserAboutQuery, TError, TData>({
    queryKey: ['getUserAboutSuspense', variables],
    queryFn: fetcher<GetUserAboutQuery, GetUserAboutQueryVariables>(
      GetUserAboutDocument,
      variables,
    ),
    ...options,
  })
}

useSuspenseGetUserAboutQuery.getKey = (variables: GetUserAboutQueryVariables) => [
  'getUserAboutSuspense',
  variables,
]

export const useInfiniteGetUserAboutQuery = <
  TData = InfiniteData<GetUserAboutQuery>,
  TError = unknown,
>(
  variables: GetUserAboutQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetUserAboutQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetUserAboutQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<GetUserAboutQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['getUserAbout.infinite', variables],
        queryFn: (metaData) =>
          fetcher<GetUserAboutQuery, GetUserAboutQueryVariables>(GetUserAboutDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteGetUserAboutQuery.getKey = (variables: GetUserAboutQueryVariables) => [
  'getUserAbout.infinite',
  variables,
]

export const useSuspenseInfiniteGetUserAboutQuery = <
  TData = InfiniteData<GetUserAboutQuery>,
  TError = unknown,
>(
  variables: GetUserAboutQueryVariables,
  options: Omit<UseSuspenseInfiniteQueryOptions<GetUserAboutQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseInfiniteQueryOptions<GetUserAboutQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<GetUserAboutQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['getUserAbout.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<GetUserAboutQuery, GetUserAboutQueryVariables>(GetUserAboutDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteGetUserAboutQuery.getKey = (variables: GetUserAboutQueryVariables) => [
  'getUserAbout.infiniteSuspense',
  variables,
]

export const GetUserSeriesListDocument = `
    query getUserSeriesList($input: GetUserInput!) {
  user(input: $input) {
    id
    series_list {
      id
      name
      description
      url_slug
      thumbnail
      updated_at
      posts_count
    }
  }
}
    `

export const useGetUserSeriesListQuery = <TData = GetUserSeriesListQuery, TError = unknown>(
  variables: GetUserSeriesListQueryVariables,
  options?: Omit<UseQueryOptions<GetUserSeriesListQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetUserSeriesListQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<GetUserSeriesListQuery, TError, TData>({
    queryKey: ['getUserSeriesList', variables],
    queryFn: fetcher<GetUserSeriesListQuery, GetUserSeriesListQueryVariables>(
      GetUserSeriesListDocument,
      variables,
    ),
    ...options,
  })
}

useGetUserSeriesListQuery.getKey = (variables: GetUserSeriesListQueryVariables) => [
  'getUserSeriesList',
  variables,
]

export const useSuspenseGetUserSeriesListQuery = <TData = GetUserSeriesListQuery, TError = unknown>(
  variables: GetUserSeriesListQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<GetUserSeriesListQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<GetUserSeriesListQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<GetUserSeriesListQuery, TError, TData>({
    queryKey: ['getUserSeriesListSuspense', variables],
    queryFn: fetcher<GetUserSeriesListQuery, GetUserSeriesListQueryVariables>(
      GetUserSeriesListDocument,
      variables,
    ),
    ...options,
  })
}

useSuspenseGetUserSeriesListQuery.getKey = (variables: GetUserSeriesListQueryVariables) => [
  'getUserSeriesListSuspense',
  variables,
]

export const useInfiniteGetUserSeriesListQuery = <
  TData = InfiniteData<GetUserSeriesListQuery>,
  TError = unknown,
>(
  variables: GetUserSeriesListQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetUserSeriesListQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetUserSeriesListQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<GetUserSeriesListQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['getUserSeriesList.infinite', variables],
        queryFn: (metaData) =>
          fetcher<GetUserSeriesListQuery, GetUserSeriesListQueryVariables>(
            GetUserSeriesListDocument,
            { ...variables, ...(metaData.pageParam ?? {}) },
          )(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteGetUserSeriesListQuery.getKey = (variables: GetUserSeriesListQueryVariables) => [
  'getUserSeriesList.infinite',
  variables,
]

export const useSuspenseInfiniteGetUserSeriesListQuery = <
  TData = InfiniteData<GetUserSeriesListQuery>,
  TError = unknown,
>(
  variables: GetUserSeriesListQueryVariables,
  options: Omit<
    UseSuspenseInfiniteQueryOptions<GetUserSeriesListQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseSuspenseInfiniteQueryOptions<GetUserSeriesListQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<GetUserSeriesListQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['getUserSeriesList.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<GetUserSeriesListQuery, GetUserSeriesListQueryVariables>(
            GetUserSeriesListDocument,
            { ...variables, ...(metaData.pageParam ?? {}) },
          )(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteGetUserSeriesListQuery.getKey = (variables: GetUserSeriesListQueryVariables) => [
  'getUserSeriesList.infiniteSuspense',
  variables,
]

export const UpdateAboutDocument = `
    mutation updateAbout($input: UpdateAboutInput!) {
  updateAbout(input: $input) {
    id
    about
  }
}
    `

export const useUpdateAboutMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<UpdateAboutMutation, TError, UpdateAboutMutationVariables, TContext>,
) => {
  return useMutation<UpdateAboutMutation, TError, UpdateAboutMutationVariables, TContext>({
    mutationKey: ['updateAbout'],
    mutationFn: (variables?: UpdateAboutMutationVariables) =>
      fetcher<UpdateAboutMutation, UpdateAboutMutationVariables>(UpdateAboutDocument, variables)(),
    ...options,
  })
}

useUpdateAboutMutation.getKey = () => ['updateAbout']

export const TrendingWritersDocument = `
    query trendingWriters($input: TrendingWritersInput!) {
  trendingWriters(input: $input) {
    index
    id
    user {
      id
      username
      profile {
        display_name
        thumbnail
      }
    }
    posts {
      title
      url_slug
    }
  }
}
    `

export const useTrendingWritersQuery = <TData = TrendingWritersQuery, TError = unknown>(
  variables: TrendingWritersQueryVariables,
  options?: Omit<UseQueryOptions<TrendingWritersQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<TrendingWritersQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<TrendingWritersQuery, TError, TData>({
    queryKey: ['trendingWriters', variables],
    queryFn: fetcher<TrendingWritersQuery, TrendingWritersQueryVariables>(
      TrendingWritersDocument,
      variables,
    ),
    ...options,
  })
}

useTrendingWritersQuery.getKey = (variables: TrendingWritersQueryVariables) => [
  'trendingWriters',
  variables,
]

export const useSuspenseTrendingWritersQuery = <TData = TrendingWritersQuery, TError = unknown>(
  variables: TrendingWritersQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<TrendingWritersQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<TrendingWritersQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<TrendingWritersQuery, TError, TData>({
    queryKey: ['trendingWritersSuspense', variables],
    queryFn: fetcher<TrendingWritersQuery, TrendingWritersQueryVariables>(
      TrendingWritersDocument,
      variables,
    ),
    ...options,
  })
}

useSuspenseTrendingWritersQuery.getKey = (variables: TrendingWritersQueryVariables) => [
  'trendingWritersSuspense',
  variables,
]

export const useInfiniteTrendingWritersQuery = <
  TData = InfiniteData<TrendingWritersQuery>,
  TError = unknown,
>(
  variables: TrendingWritersQueryVariables,
  options: Omit<UseInfiniteQueryOptions<TrendingWritersQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<TrendingWritersQuery, TError, TData>['queryKey']
  },
) => {
  return useInfiniteQuery<TrendingWritersQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['trendingWriters.infinite', variables],
        queryFn: (metaData) =>
          fetcher<TrendingWritersQuery, TrendingWritersQueryVariables>(TrendingWritersDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useInfiniteTrendingWritersQuery.getKey = (variables: TrendingWritersQueryVariables) => [
  'trendingWriters.infinite',
  variables,
]

export const useSuspenseInfiniteTrendingWritersQuery = <
  TData = InfiniteData<TrendingWritersQuery>,
  TError = unknown,
>(
  variables: TrendingWritersQueryVariables,
  options: Omit<
    UseSuspenseInfiniteQueryOptions<TrendingWritersQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseSuspenseInfiniteQueryOptions<TrendingWritersQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseInfiniteQuery<TrendingWritersQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options
      return {
        queryKey: optionsQueryKey ?? ['trendingWriters.infiniteSuspense', variables],
        queryFn: (metaData) =>
          fetcher<TrendingWritersQuery, TrendingWritersQueryVariables>(TrendingWritersDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      }
    })(),
  )
}

useSuspenseInfiniteTrendingWritersQuery.getKey = (variables: TrendingWritersQueryVariables) => [
  'trendingWriters.infiniteSuspense',
  variables,
]
