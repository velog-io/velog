import { GraphQLClient } from 'graphql-request'
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types'
import gql from 'graphql-tag'
export type Maybe<T> = T
export type InputMaybe<T> = T
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }

export const graphQLClient = new GraphQLClient(
  'http://localhost:5003/graphql',
  {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
)

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  Date: { input: any; output: any }
  JSON: { input: any; output: any }
}

export type Comment = {
  created_at?: Maybe<Scalars['Date']['output']>
  deleted?: Maybe<Scalars['Boolean']['output']>
  has_replies?: Maybe<Scalars['Boolean']['output']>
  id: Scalars['ID']['output']
  level?: Maybe<Scalars['Int']['output']>
  likes?: Maybe<Scalars['Int']['output']>
  replies?: Maybe<Array<Maybe<Comment>>>
  replies_count?: Maybe<Scalars['Int']['output']>
  text?: Maybe<Scalars['String']['output']>
  user?: Maybe<User>
}

export type LinkedPosts = {
  next?: Maybe<Post>
  previous?: Maybe<Post>
}

export type Mutation = {
  logout: Scalars['Boolean']['output']
}

export type Post = {
  body?: Maybe<Scalars['String']['output']>
  comments?: Maybe<Array<Maybe<Comment>>>
  comments_count?: Maybe<Scalars['Int']['output']>
  created_at: Scalars['Date']['output']
  fk_user_id: Scalars['String']['output']
  id: Scalars['ID']['output']
  is_markdown?: Maybe<Scalars['Boolean']['output']>
  is_private: Scalars['Boolean']['output']
  is_temp?: Maybe<Scalars['Boolean']['output']>
  last_read_at?: Maybe<Scalars['Date']['output']>
  liked?: Maybe<Scalars['Boolean']['output']>
  likes?: Maybe<Scalars['Int']['output']>
  linked_posts?: Maybe<LinkedPosts>
  meta?: Maybe<Scalars['JSON']['output']>
  original_post_id?: Maybe<Scalars['ID']['output']>
  recommended_posts?: Maybe<Array<Maybe<Post>>>
  released_at?: Maybe<Scalars['Date']['output']>
  series?: Maybe<Series>
  short_description?: Maybe<Scalars['String']['output']>
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  thumbnail?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
  updated_at: Scalars['Date']['output']
  url_slug?: Maybe<Scalars['String']['output']>
  user?: Maybe<User>
  views?: Maybe<Scalars['Int']['output']>
}

export type PostHistory = {
  body?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['Date']['output']>
  fk_post_id?: Maybe<Scalars['ID']['output']>
  id?: Maybe<Scalars['ID']['output']>
  is_markdown?: Maybe<Scalars['Boolean']['output']>
  title?: Maybe<Scalars['String']['output']>
}

export type Query = {
  currentUser?: Maybe<User>
  post?: Maybe<Post>
  readingList?: Maybe<Array<Maybe<Post>>>
  recentPosts?: Maybe<Array<Maybe<Post>>>
  restoreToken?: Maybe<UserToken>
  trendingPosts?: Maybe<Array<Maybe<Post>>>
}

export type QueryPostArgs = {
  input: ReadPostInput
}

export type QueryReadingListArgs = {
  input: ReadingListInput
}

export type QueryRecentPostsArgs = {
  input: RecentPostsInput
}

export type QueryTrendingPostsArgs = {
  input: TrendingPostsInput
}

export type ReadCountByDay = {
  count?: Maybe<Scalars['Int']['output']>
  day?: Maybe<Scalars['Date']['output']>
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
  count?: Maybe<Scalars['Int']['output']>
  posts: Array<Post>
}

export type Series = {
  created_at?: Maybe<Scalars['Date']['output']>
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  name?: Maybe<Scalars['String']['output']>
  posts_count?: Maybe<Scalars['Int']['output']>
  series_posts?: Maybe<Array<Maybe<SeriesPost>>>
  thumbnail?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['Date']['output']>
  url_slug?: Maybe<Scalars['String']['output']>
  user?: Maybe<User>
}

export type SeriesPost = {
  id: Scalars['ID']['output']
  index?: Maybe<Scalars['Int']['output']>
  post?: Maybe<Post>
}

export type Stats = {
  count_by_day?: Maybe<Array<Maybe<ReadCountByDay>>>
  total?: Maybe<Scalars['Int']['output']>
}

export type TrendingPostsInput = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  timeframe?: InputMaybe<Scalars['String']['input']>
}

export type User = {
  created_at: Scalars['Date']['output']
  email: Scalars['String']['output']
  id: Scalars['ID']['output']
  is_certified: Scalars['Boolean']['output']
  profile: UserProfile
  series_list?: Maybe<Array<Maybe<Series>>>
  updated_at: Scalars['Date']['output']
  user_meta?: Maybe<UserMeta>
  username: Scalars['String']['output']
  velog_config?: Maybe<VelogConfig>
}

export type UserMeta = {
  email_notification?: Maybe<Scalars['Boolean']['output']>
  email_promotion?: Maybe<Scalars['Boolean']['output']>
  id: Scalars['ID']['output']
}

export type UserProfile = {
  about: Scalars['String']['output']
  created_at: Scalars['Date']['output']
  display_name: Scalars['String']['output']
  id: Scalars['ID']['output']
  profile_links: Scalars['JSON']['output']
  short_bio: Scalars['String']['output']
  thumbnail?: Maybe<Scalars['String']['output']>
  updated_at: Scalars['Date']['output']
}

export type UserToken = {
  accessToken: Scalars['String']['output']
  refreshToken: Scalars['String']['output']
}

export type VelogConfig = {
  id: Scalars['ID']['output']
  logo_image?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
}

export type ReadPostQueryVariables = Exact<{
  input: ReadPostInput
}>

export type ReadPostQuery = {
  post?: {
    id: string
    title?: string
    released_at?: any
    updated_at: any
    body?: string
    short_description?: string
    is_markdown?: boolean
    is_private: boolean
    is_temp?: boolean
    thumbnail?: string
    comments_count?: number
    url_slug?: string
    likes?: number
    liked?: boolean
    user?: {
      id: string
      username: string
      profile: {
        id: string
        display_name: string
        thumbnail?: string
        short_bio: string
        profile_links: any
      }
      velog_config?: { title?: string }
    }
    comments?: Array<{
      id: string
      text?: string
      replies_count?: number
      level?: number
      created_at?: any
      deleted?: boolean
      user?: {
        id: string
        username: string
        profile: { id: string; thumbnail?: string }
      }
    }>
    series?: {
      id: string
      name?: string
      url_slug?: string
      series_posts?: Array<{
        id: string
        post?: {
          id: string
          title?: string
          url_slug?: string
          user?: { id: string; username: string }
        }
      }>
    }
    linked_posts?: {
      previous?: {
        id: string
        title?: string
        url_slug?: string
        user?: { id: string; username: string }
      }
      next?: {
        id: string
        title?: string
        url_slug?: string
        user?: { id: string; username: string }
      }
    }
  }
}

export type RecentPostsQueryVariables = Exact<{
  input: RecentPostsInput
}>

export type RecentPostsQuery = {
  recentPosts?: Array<{
    id: string
    title?: string
    short_description?: string
    thumbnail?: string
    url_slug?: string
    released_at?: any
    updated_at: any
    is_private: boolean
    likes?: number
    comments_count?: number
    user?: {
      id: string
      username: string
      profile: { id: string; thumbnail?: string }
    }
  }>
}

export type TrendingPostsQueryVariables = Exact<{
  input: TrendingPostsInput
}>

export type TrendingPostsQuery = {
  trendingPosts?: Array<{
    id: string
    title?: string
    short_description?: string
    thumbnail?: string
    likes?: number
    url_slug?: string
    released_at?: any
    updated_at: any
    is_private: boolean
    comments_count?: number
    user?: {
      id: string
      username: string
      profile: { id: string; thumbnail?: string }
    }
  }>
}

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserQuery = {
  currentUser?: {
    id: string
    username: string
    email: string
    profile: { id: string; thumbnail?: string; display_name: string }
  }
}

export type RestoreTokenQueryVariables = Exact<{ [key: string]: never }>

export type RestoreTokenQuery = {
  restoreToken?: { accessToken: string; refreshToken: string }
}

export type LogoutMutationVariables = Exact<{ [key: string]: never }>

export type LogoutMutation = { logout: boolean }

export const ReadPostDocument = gql`
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
      liked
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
export const RecentPostsDocument = gql`
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
export const TrendingPostsDocument = gql`
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
export const CurrentUserDocument = gql`
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
export const RestoreTokenDocument = gql`
  query restoreToken {
    restoreToken {
      accessToken
      refreshToken
    }
  }
`
export const LogoutDocument = gql`
  mutation logout {
    logout
  }
`

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType
) => action()

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    readPost(
      variables: ReadPostQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<ReadPostQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ReadPostQuery>(ReadPostDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'readPost',
        'query'
      )
    },
    recentPosts(
      variables: RecentPostsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<RecentPostsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RecentPostsQuery>(RecentPostsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'recentPosts',
        'query'
      )
    },
    trendingPosts(
      variables: TrendingPostsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<TrendingPostsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<TrendingPostsQuery>(TrendingPostsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'trendingPosts',
        'query'
      )
    },
    currentUser(
      variables?: CurrentUserQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<CurrentUserQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CurrentUserQuery>(CurrentUserDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'currentUser',
        'query'
      )
    },
    restoreToken(
      variables?: RestoreTokenQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<RestoreTokenQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RestoreTokenQuery>(RestoreTokenDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'restoreToken',
        'query'
      )
    },
    logout(
      variables?: LogoutMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<LogoutMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LogoutMutation>(LogoutDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'logout',
        'mutation'
      )
    },
  }
}
export type Sdk = ReturnType<typeof getSdk>
