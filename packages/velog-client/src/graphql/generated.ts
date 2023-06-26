import { useQuery, UseQueryOptions } from '@tanstack/react-query'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
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

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch('http://localhost:5001/graphql', {
      method: 'POST',
      ...{
        headers: {
          'content-type': 'application/json',
        },
      },
      body: JSON.stringify({ query, variables }),
    })

    const json = await res.json()

    if (json.errors.message) {
      const { message } = json.errors[0]
      throw new Error(message)
    }

    return json.data
  }
}
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
  __typename?: 'Comment'
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

export type CurrentUser = {
  __typename?: 'CurrentUser'
  created_at?: Maybe<Scalars['Date']['output']>
  email?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  is_certified?: Maybe<Scalars['Boolean']['output']>
  profile?: Maybe<UserProfile>
  updated_at?: Maybe<Scalars['Date']['output']>
  username?: Maybe<Scalars['String']['output']>
}

export type LinkedPosts = {
  __typename?: 'LinkedPosts'
  next?: Maybe<Post>
  previous?: Maybe<Post>
}

export type Post = {
  __typename?: 'Post'
  body?: Maybe<Scalars['String']['output']>
  comments?: Maybe<Array<Maybe<Comment>>>
  comments_count?: Maybe<Scalars['Int']['output']>
  created_at?: Maybe<Scalars['Date']['output']>
  id: Scalars['ID']['output']
  is_markdown?: Maybe<Scalars['Boolean']['output']>
  is_private?: Maybe<Scalars['Boolean']['output']>
  is_temp?: Maybe<Scalars['Boolean']['output']>
  last_read_at?: Maybe<Scalars['Date']['output']>
  liked?: Maybe<Scalars['Boolean']['output']>
  likes?: Maybe<Scalars['Int']['output']>
  linked_posts?: Maybe<LinkedPosts>
  meta?: Maybe<Scalars['JSON']['output']>
  recommended_posts?: Maybe<Array<Maybe<Post>>>
  released_at?: Maybe<Scalars['Date']['output']>
  series?: Maybe<Series>
  short_description?: Maybe<Scalars['String']['output']>
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  thumbnail?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['Date']['output']>
  url_slug?: Maybe<Scalars['String']['output']>
  user?: Maybe<User>
  views?: Maybe<Scalars['Int']['output']>
}

export type PostHistory = {
  __typename?: 'PostHistory'
  body?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['Date']['output']>
  fk_post_id?: Maybe<Scalars['ID']['output']>
  id?: Maybe<Scalars['ID']['output']>
  is_markdown?: Maybe<Scalars['Boolean']['output']>
  title?: Maybe<Scalars['String']['output']>
}

export type Query = {
  __typename?: 'Query'
  currentUser?: Maybe<CurrentUser>
  readingList?: Maybe<Array<Maybe<Post>>>
  recentPosts?: Maybe<Array<Maybe<Post>>>
  trendingPosts?: Maybe<Array<Maybe<Post>>>
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
  __typename?: 'ReadCountByDay'
  count?: Maybe<Scalars['Int']['output']>
  day?: Maybe<Scalars['Date']['output']>
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
  __typename?: 'SearchResult'
  count?: Maybe<Scalars['Int']['output']>
  posts: Array<Post>
}

export type Series = {
  __typename?: 'Series'
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
  __typename?: 'SeriesPost'
  id: Scalars['ID']['output']
  index?: Maybe<Scalars['Int']['output']>
  post?: Maybe<Post>
}

export type Stats = {
  __typename?: 'Stats'
  count_by_day?: Maybe<Array<Maybe<ReadCountByDay>>>
  total?: Maybe<Scalars['Int']['output']>
}

export type TrendingPostsInput = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  timeframe?: InputMaybe<Scalars['String']['input']>
}

export type User = {
  __typename?: 'User'
  created_at?: Maybe<Scalars['Date']['output']>
  email?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  is_certified?: Maybe<Scalars['Boolean']['output']>
  profile?: Maybe<UserProfile>
  series_list?: Maybe<Array<Maybe<Series>>>
  updated_at?: Maybe<Scalars['Date']['output']>
  user_meta?: Maybe<UserMeta>
  username?: Maybe<Scalars['String']['output']>
  velog_config?: Maybe<VelogConfig>
}

export type UserMeta = {
  __typename?: 'UserMeta'
  email_notification?: Maybe<Scalars['Boolean']['output']>
  email_promotion?: Maybe<Scalars['Boolean']['output']>
  id: Scalars['ID']['output']
}

export type UserProfile = {
  __typename?: 'UserProfile'
  about?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['Date']['output']>
  display_name?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  profile_links?: Maybe<Scalars['JSON']['output']>
  short_bio?: Maybe<Scalars['String']['output']>
  thumbnail?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['Date']['output']>
}

export type VelogConfig = {
  __typename?: 'VelogConfig'
  id: Scalars['ID']['output']
  logo_image?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
}

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserQuery = {
  __typename?: 'Query'
  currentUser?: {
    __typename?: 'CurrentUser'
    id: string
    username?: string | null
    email?: string | null
    profile?: {
      __typename?: 'UserProfile'
      id: string
      thumbnail?: string | null
      display_name?: string | null
    } | null
  } | null
}

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
  options?: UseQueryOptions<CurrentUserQuery, TError, TData>
) =>
  useQuery<CurrentUserQuery, TError, TData>(
    variables === undefined ? ['currentUser'] : ['currentUser', variables],
    fetcher<CurrentUserQuery, CurrentUserQueryVariables>(
      CurrentUserDocument,
      variables
    ),
    options
  )
