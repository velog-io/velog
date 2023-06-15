/* eslint-disable @typescript-eslint/ban-types */
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
import { GraphQLContext } from './../common/interfaces/graphql'
import { DeepPartial } from 'utility-types'
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
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  Date: { input: Date; output: Date }
  JSON: { input: JSON; output: JSON }
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

export type EditPostInput = {
  body?: InputMaybe<Scalars['String']['input']>
  id: Scalars['ID']['input']
  is_markdown?: InputMaybe<Scalars['Boolean']['input']>
  is_private?: InputMaybe<Scalars['Boolean']['input']>
  is_temp?: InputMaybe<Scalars['Boolean']['input']>
  meta?: InputMaybe<Scalars['JSON']['input']>
  series_id?: InputMaybe<Scalars['ID']['input']>
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  thumbnail?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
  url_slug?: InputMaybe<Scalars['String']['input']>
}

export type LinkedPosts = {
  __typename?: 'LinkedPosts'
  next?: Maybe<Post>
  previous?: Maybe<Post>
}

export type Mutation = {
  __typename?: 'Mutation'
  createPostHistory?: Maybe<PostHistory>
  editPost?: Maybe<Post>
  writePost?: Maybe<Post>
}

export type MutationCreatePostHistoryArgs = {
  body: Scalars['String']['input']
  is_markdown: Scalars['Boolean']['input']
  post_id: Scalars['ID']['input']
  title: Scalars['String']['input']
}

export type MutationEditPostArgs = {
  input?: InputMaybe<EditPostInput>
}

export type MutationWritePostArgs = {
  input: WritePostInput
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
  posts?: Maybe<Array<Maybe<Post>>>
  recentPosts?: Maybe<Array<Maybe<Post>>>
  trendingPosts?: Maybe<Array<Maybe<Post>>>
}

export type QueryPostsArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
  tag?: InputMaybe<Scalars['String']['input']>
  temp_only?: InputMaybe<Scalars['Boolean']['input']>
  username?: InputMaybe<Scalars['String']['input']>
}

export type QueryRecentPostsArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
}

export type QueryTrendingPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  timeframe?: InputMaybe<Scalars['String']['input']>
}

export type ReadCountByDay = {
  __typename?: 'ReadCountByDay'
  count?: Maybe<Scalars['Int']['output']>
  day?: Maybe<Scalars['Date']['output']>
}

export enum ReadingListOption {
  Liked = 'LIKED',
  Read = 'READ',
}

export type SearchResult = {
  __typename?: 'SearchResult'
  count?: Maybe<Scalars['Int']['output']>
  posts?: Maybe<Array<Maybe<Post>>>
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

export type WritePostInput = {
  body?: InputMaybe<Scalars['String']['input']>
  is_markdown?: InputMaybe<Scalars['Boolean']['input']>
  is_private?: InputMaybe<Scalars['Boolean']['input']>
  is_temp?: InputMaybe<Scalars['Boolean']['input']>
  meta?: InputMaybe<Scalars['JSON']['input']>
  series_id?: InputMaybe<Scalars['ID']['input']>
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  thumbnail?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
  url_slug?: InputMaybe<Scalars['String']['input']>
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<DeepPartial<Scalars['Boolean']['output']>>
  Comment: ResolverTypeWrapper<DeepPartial<Comment>>
  Date: ResolverTypeWrapper<DeepPartial<Scalars['Date']['output']>>
  EditPostInput: ResolverTypeWrapper<DeepPartial<EditPostInput>>
  ID: ResolverTypeWrapper<DeepPartial<Scalars['ID']['output']>>
  Int: ResolverTypeWrapper<DeepPartial<Scalars['Int']['output']>>
  JSON: ResolverTypeWrapper<DeepPartial<Scalars['JSON']['output']>>
  LinkedPosts: ResolverTypeWrapper<DeepPartial<LinkedPosts>>
  Mutation: ResolverTypeWrapper<{}>
  Post: ResolverTypeWrapper<DeepPartial<Post>>
  PostHistory: ResolverTypeWrapper<DeepPartial<PostHistory>>
  Query: ResolverTypeWrapper<{}>
  ReadCountByDay: ResolverTypeWrapper<DeepPartial<ReadCountByDay>>
  ReadingListOption: ResolverTypeWrapper<DeepPartial<ReadingListOption>>
  SearchResult: ResolverTypeWrapper<DeepPartial<SearchResult>>
  Series: ResolverTypeWrapper<DeepPartial<Series>>
  SeriesPost: ResolverTypeWrapper<DeepPartial<SeriesPost>>
  Stats: ResolverTypeWrapper<DeepPartial<Stats>>
  String: ResolverTypeWrapper<DeepPartial<Scalars['String']['output']>>
  User: ResolverTypeWrapper<DeepPartial<User>>
  UserMeta: ResolverTypeWrapper<DeepPartial<UserMeta>>
  UserProfile: ResolverTypeWrapper<DeepPartial<UserProfile>>
  VelogConfig: ResolverTypeWrapper<DeepPartial<VelogConfig>>
  WritePostInput: ResolverTypeWrapper<DeepPartial<WritePostInput>>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: DeepPartial<Scalars['Boolean']['output']>
  Comment: DeepPartial<Comment>
  Date: DeepPartial<Scalars['Date']['output']>
  EditPostInput: DeepPartial<EditPostInput>
  ID: DeepPartial<Scalars['ID']['output']>
  Int: DeepPartial<Scalars['Int']['output']>
  JSON: DeepPartial<Scalars['JSON']['output']>
  LinkedPosts: DeepPartial<LinkedPosts>
  Mutation: {}
  Post: DeepPartial<Post>
  PostHistory: DeepPartial<PostHistory>
  Query: {}
  ReadCountByDay: DeepPartial<ReadCountByDay>
  SearchResult: DeepPartial<SearchResult>
  Series: DeepPartial<Series>
  SeriesPost: DeepPartial<SeriesPost>
  Stats: DeepPartial<Stats>
  String: DeepPartial<Scalars['String']['output']>
  User: DeepPartial<User>
  UserMeta: DeepPartial<UserMeta>
  UserProfile: DeepPartial<UserProfile>
  VelogConfig: DeepPartial<VelogConfig>
  WritePostInput: DeepPartial<WritePostInput>
}

export type CommentResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']
> = {
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  deleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  has_replies?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  level?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  likes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  replies?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Comment']>>>,
    ParentType,
    ContextType
  >
  replies_count?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export type LinkedPostsResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['LinkedPosts'] = ResolversParentTypes['LinkedPosts']
> = {
  next?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>
  previous?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  createPostHistory?: Resolver<
    Maybe<ResolversTypes['PostHistory']>,
    ParentType,
    ContextType,
    RequireFields<
      MutationCreatePostHistoryArgs,
      'body' | 'is_markdown' | 'post_id' | 'title'
    >
  >
  editPost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    Partial<MutationEditPostArgs>
  >
  writePost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationWritePostArgs, 'input'>
  >
}

export type PostResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']
> = {
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  comments?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Comment']>>>,
    ParentType,
    ContextType
  >
  comments_count?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  is_markdown?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  is_private?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  is_temp?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  last_read_at?: Resolver<
    Maybe<ResolversTypes['Date']>,
    ParentType,
    ContextType
  >
  liked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  likes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  linked_posts?: Resolver<
    Maybe<ResolversTypes['LinkedPosts']>,
    ParentType,
    ContextType
  >
  meta?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>
  recommended_posts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Post']>>>,
    ParentType,
    ContextType
  >
  released_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  series?: Resolver<Maybe<ResolversTypes['Series']>, ParentType, ContextType>
  short_description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  tags?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  url_slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  views?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PostHistoryResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['PostHistory'] = ResolversParentTypes['PostHistory']
> = {
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  fk_post_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  is_markdown?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  posts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Post']>>>,
    ParentType,
    ContextType,
    Partial<QueryPostsArgs>
  >
  recentPosts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Post']>>>,
    ParentType,
    ContextType,
    Partial<QueryRecentPostsArgs>
  >
  trendingPosts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Post']>>>,
    ParentType,
    ContextType,
    Partial<QueryTrendingPostsArgs>
  >
}

export type ReadCountByDayResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['ReadCountByDay'] = ResolversParentTypes['ReadCountByDay']
> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  day?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SearchResultResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']
> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  posts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Post']>>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SeriesResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Series'] = ResolversParentTypes['Series']
> = {
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  posts_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  series_posts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['SeriesPost']>>>,
    ParentType,
    ContextType
  >
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  url_slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SeriesPostResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['SeriesPost'] = ResolversParentTypes['SeriesPost']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  index?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type StatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Stats'] = ResolversParentTypes['Stats']
> = {
  count_by_day?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ReadCountByDay']>>>,
    ParentType,
    ContextType
  >
  total?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  is_certified?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  profile?: Resolver<
    Maybe<ResolversTypes['UserProfile']>,
    ParentType,
    ContextType
  >
  series_list?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Series']>>>,
    ParentType,
    ContextType
  >
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  user_meta?: Resolver<
    Maybe<ResolversTypes['UserMeta']>,
    ParentType,
    ContextType
  >
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  velog_config?: Resolver<
    Maybe<ResolversTypes['VelogConfig']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserMetaResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['UserMeta'] = ResolversParentTypes['UserMeta']
> = {
  email_notification?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  email_promotion?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserProfileResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['UserProfile'] = ResolversParentTypes['UserProfile']
> = {
  about?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  display_name?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  profile_links?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >
  short_bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VelogConfigResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['VelogConfig'] = ResolversParentTypes['VelogConfig']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  logo_image?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = GraphQLContext> = {
  Comment?: CommentResolvers<ContextType>
  Date?: GraphQLScalarType
  JSON?: GraphQLScalarType
  LinkedPosts?: LinkedPostsResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Post?: PostResolvers<ContextType>
  PostHistory?: PostHistoryResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  ReadCountByDay?: ReadCountByDayResolvers<ContextType>
  SearchResult?: SearchResultResolvers<ContextType>
  Series?: SeriesResolvers<ContextType>
  SeriesPost?: SeriesPostResolvers<ContextType>
  Stats?: StatsResolvers<ContextType>
  User?: UserResolvers<ContextType>
  UserMeta?: UserMetaResolvers<ContextType>
  UserProfile?: UserProfileResolvers<ContextType>
  VelogConfig?: VelogConfigResolvers<ContextType>
}
