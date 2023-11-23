import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
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
  PositiveInt: { input: any; output: any }
  Void: { input: any; output: any }
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
  take?: InputMaybe<Scalars['PositiveInt']['input']>
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
  trendingWriters: TrendingWritersResult
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
  thumbnail: Scalars['String']['output']
}

export type TrendingWriterUser = {
  id: Scalars['ID']['output']
  profile: TrendingWriterProfile
  username: Scalars['String']['output']
}

export type TrendingWritersInput = {
  page: Scalars['PositiveInt']['input']
  take: Scalars['PositiveInt']['input']
}

export type TrendingWritersResult = {
  totalPage: Scalars['Int']['output']
  writers: Array<TrendingWriter>
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
    user: { id: string; username: string; profile: { id: string; thumbnail: string | null } } | null
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
    user: { id: string; username: string; profile: { id: string; thumbnail: string | null } } | null
  }>
}

export type PostsQueryVariables = Exact<{
  input: GetPostsInput
}>

export type PostsQuery = {
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
    user: { id: string; username: string; profile: { id: string; thumbnail: string | null } } | null
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
        profile: { id: string; thumbnail: string | null }
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
  } | null
}

export type LogoutMutationVariables = Exact<{ [key: string]: never }>

export type LogoutMutation = { logout: any | null }

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

export type GetTrendingWritersQueryVariables = Exact<{
  input: TrendingWritersInput
}>

export type GetTrendingWritersQuery = {
  trendingWriters: {
    totalPage: number
    writers: Array<{
      id: string
      user: { id: string; username: string }
      posts: Array<{ title: string }>
    }>
  }
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
) =>
  useMutation<SendMailMutation, TError, SendMailMutationVariables, TContext>(
    ['sendMail'],
    (variables?: SendMailMutationVariables) =>
      fetcher<SendMailMutation, SendMailMutationVariables>(SendMailDocument, variables)(),
    options,
  )
export const FollowDocument = `
    mutation follow($input: FollowInput!) {
  follow(input: $input)
}
    `
export const useFollowMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<FollowMutation, TError, FollowMutationVariables, TContext>,
) =>
  useMutation<FollowMutation, TError, FollowMutationVariables, TContext>(
    ['follow'],
    (variables?: FollowMutationVariables) =>
      fetcher<FollowMutation, FollowMutationVariables>(FollowDocument, variables)(),
    options,
  )
export const UnfollowDocument = `
    mutation unfollow($input: UnfollowInput!) {
  unfollow(input: $input)
}
    `
export const useUnfollowMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<UnfollowMutation, TError, UnfollowMutationVariables, TContext>,
) =>
  useMutation<UnfollowMutation, TError, UnfollowMutationVariables, TContext>(
    ['unfollow'],
    (variables?: UnfollowMutationVariables) =>
      fetcher<UnfollowMutation, UnfollowMutationVariables>(UnfollowDocument, variables)(),
    options,
  )
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
  options?: UseQueryOptions<GetFollowersQuery, TError, TData>,
) =>
  useQuery<GetFollowersQuery, TError, TData>(
    ['getFollowers', variables],
    fetcher<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, variables),
    options,
  )
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
  options?: UseQueryOptions<GetFollowingsQuery, TError, TData>,
) =>
  useQuery<GetFollowingsQuery, TError, TData>(
    ['getFollowings', variables],
    fetcher<GetFollowingsQuery, GetFollowingsQueryVariables>(GetFollowingsDocument, variables),
    options,
  )
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
  options?: UseQueryOptions<ReadPostQuery, TError, TData>,
) =>
  useQuery<ReadPostQuery, TError, TData>(
    ['readPost', variables],
    fetcher<ReadPostQuery, ReadPostQueryVariables>(ReadPostDocument, variables),
    options,
  )
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
  options?: UseQueryOptions<RecentPostsQuery, TError, TData>,
) =>
  useQuery<RecentPostsQuery, TError, TData>(
    ['recentPosts', variables],
    fetcher<RecentPostsQuery, RecentPostsQueryVariables>(RecentPostsDocument, variables),
    options,
  )
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
  options?: UseQueryOptions<TrendingPostsQuery, TError, TData>,
) =>
  useQuery<TrendingPostsQuery, TError, TData>(
    ['trendingPosts', variables],
    fetcher<TrendingPostsQuery, TrendingPostsQueryVariables>(TrendingPostsDocument, variables),
    options,
  )
export const PostsDocument = `
    query Posts($input: GetPostsInput!) {
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
export const usePostsQuery = <TData = PostsQuery, TError = unknown>(
  variables: PostsQueryVariables,
  options?: UseQueryOptions<PostsQuery, TError, TData>,
) =>
  useQuery<PostsQuery, TError, TData>(
    ['Posts', variables],
    fetcher<PostsQuery, PostsQueryVariables>(PostsDocument, variables),
    options,
  )
export const SearchPostsDocument = `
    query SearchPosts($input: GetSearchPostsInput!) {
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
  options?: UseQueryOptions<SearchPostsQuery, TError, TData>,
) =>
  useQuery<SearchPostsQuery, TError, TData>(
    ['SearchPosts', variables],
    fetcher<SearchPostsQuery, SearchPostsQueryVariables>(SearchPostsDocument, variables),
    options,
  )
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
  options?: UseQueryOptions<UserTagsQuery, TError, TData>,
) =>
  useQuery<UserTagsQuery, TError, TData>(
    ['userTags', variables],
    fetcher<UserTagsQuery, UserTagsQueryVariables>(UserTagsDocument, variables),
    options,
  )
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
  options?: UseQueryOptions<GetUserQuery, TError, TData>,
) =>
  useQuery<GetUserQuery, TError, TData>(
    ['getUser', variables],
    fetcher<GetUserQuery, GetUserQueryVariables>(GetUserDocument, variables),
    options,
  )
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
  options?: UseQueryOptions<GetUserFollowInfoQuery, TError, TData>,
) =>
  useQuery<GetUserFollowInfoQuery, TError, TData>(
    ['getUserFollowInfo', variables],
    fetcher<GetUserFollowInfoQuery, GetUserFollowInfoQueryVariables>(
      GetUserFollowInfoDocument,
      variables,
    ),
    options,
  )
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
  }
}
    `
export const useCurrentUserQuery = <TData = CurrentUserQuery, TError = unknown>(
  variables?: CurrentUserQueryVariables,
  options?: UseQueryOptions<CurrentUserQuery, TError, TData>,
) =>
  useQuery<CurrentUserQuery, TError, TData>(
    variables === undefined ? ['currentUser'] : ['currentUser', variables],
    fetcher<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, variables),
    options,
  )
export const LogoutDocument = `
    mutation logout {
  logout
}
    `
export const useLogoutMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<LogoutMutation, TError, LogoutMutationVariables, TContext>,
) =>
  useMutation<LogoutMutation, TError, LogoutMutationVariables, TContext>(
    ['logout'],
    (variables?: LogoutMutationVariables) =>
      fetcher<LogoutMutation, LogoutMutationVariables>(LogoutDocument, variables)(),
    options,
  )
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
  options?: UseQueryOptions<VelogConfigQuery, TError, TData>,
) =>
  useQuery<VelogConfigQuery, TError, TData>(
    ['velogConfig', variables],
    fetcher<VelogConfigQuery, VelogConfigQueryVariables>(VelogConfigDocument, variables),
    options,
  )
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
  options?: UseQueryOptions<GetUserAboutQuery, TError, TData>,
) =>
  useQuery<GetUserAboutQuery, TError, TData>(
    ['getUserAbout', variables],
    fetcher<GetUserAboutQuery, GetUserAboutQueryVariables>(GetUserAboutDocument, variables),
    options,
  )
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
  options?: UseQueryOptions<GetUserSeriesListQuery, TError, TData>,
) =>
  useQuery<GetUserSeriesListQuery, TError, TData>(
    ['getUserSeriesList', variables],
    fetcher<GetUserSeriesListQuery, GetUserSeriesListQueryVariables>(
      GetUserSeriesListDocument,
      variables,
    ),
    options,
  )
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
) =>
  useMutation<UpdateAboutMutation, TError, UpdateAboutMutationVariables, TContext>(
    ['updateAbout'],
    (variables?: UpdateAboutMutationVariables) =>
      fetcher<UpdateAboutMutation, UpdateAboutMutationVariables>(UpdateAboutDocument, variables)(),
    options,
  )
export const GetTrendingWritersDocument = `
    query getTrendingWriters($input: TrendingWritersInput!) {
  trendingWriters(input: $input) {
    totalPage
    writers {
      id
      user {
        id
        username
      }
      posts {
        title
      }
    }
  }
}
    `
export const useGetTrendingWritersQuery = <TData = GetTrendingWritersQuery, TError = unknown>(
  variables: GetTrendingWritersQueryVariables,
  options?: UseQueryOptions<GetTrendingWritersQuery, TError, TData>,
) =>
  useQuery<GetTrendingWritersQuery, TError, TData>(
    ['getTrendingWriters', variables],
    fetcher<GetTrendingWritersQuery, GetTrendingWritersQueryVariables>(
      GetTrendingWritersDocument,
      variables,
    ),
    options,
  )
