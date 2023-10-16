/* eslint-disable @typescript-eslint/ban-types */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
import {
  User as UserModel,
  UserProfile as UserProfileModel,
  Post as PostModel,
  Comment as CommentModel,
} from '@prisma/client'
import { GraphQLContext } from './../common/interfaces/graphql'
export type Maybe<T> = T | null | undefined
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
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | undefined; output: string | undefined }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  Date: { input: Date; output: Date }
  JSON: { input: JSON; output: JSON }
  Void: { input: void; output: void }
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

export type FollowInput = {
  followUserId?: InputMaybe<Scalars['ID']['input']>
}

export type LikePostInput = {
  postId?: InputMaybe<Scalars['ID']['input']>
}

export type LinkedPosts = {
  next?: Maybe<Post>
  previous?: Maybe<Post>
}

export type Mutation = {
  follow?: Maybe<Scalars['Boolean']['output']>
  likePost?: Maybe<Post>
  logout?: Maybe<Scalars['Void']['output']>
  sendMail?: Maybe<SendMailResponse>
  unfollow?: Maybe<Scalars['Boolean']['output']>
  unlikePost?: Maybe<Post>
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

export type Post = {
  body?: Maybe<Scalars['String']['output']>
  comments?: Maybe<Array<Maybe<Comment>>>
  comments_count?: Maybe<Scalars['Int']['output']>
  created_at: Scalars['Date']['output']
  fk_user_id: Scalars['String']['output']
  followed?: Maybe<Scalars['Boolean']['output']>
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
  followers: Array<User>
  followings: Array<User>
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

export type SendMailInput = {
  email: Scalars['String']['input']
}

export type SendMailResponse = {
  registered?: Maybe<Scalars['Boolean']['output']>
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

export type UnfollowInput = {
  followUserId?: InputMaybe<Scalars['ID']['input']>
}

export type UnlikePostInput = {
  postId?: InputMaybe<Scalars['ID']['input']>
}

export type User = {
  created_at: Scalars['Date']['output']
  email?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  is_certified: Scalars['Boolean']['output']
  profile: UserProfile
  series_list: Array<Maybe<Series>>
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
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  Comment: ResolverTypeWrapper<CommentModel>
  Date: ResolverTypeWrapper<Scalars['Date']['output']>
  FollowInput: FollowInput
  ID: ResolverTypeWrapper<Scalars['ID']['output']>
  Int: ResolverTypeWrapper<Scalars['Int']['output']>
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>
  LikePostInput: LikePostInput
  LinkedPosts: ResolverTypeWrapper<
    Omit<LinkedPosts, 'next' | 'previous'> & {
      next?: Maybe<ResolversTypes['Post']>
      previous?: Maybe<ResolversTypes['Post']>
    }
  >
  Mutation: ResolverTypeWrapper<{}>
  Post: ResolverTypeWrapper<PostModel>
  PostHistory: ResolverTypeWrapper<PostHistory>
  Query: ResolverTypeWrapper<{}>
  ReadCountByDay: ResolverTypeWrapper<ReadCountByDay>
  ReadPostInput: ReadPostInput
  ReadingListInput: ReadingListInput
  ReadingListOption: ReadingListOption
  RecentPostsInput: RecentPostsInput
  SearchResult: ResolverTypeWrapper<
    Omit<SearchResult, 'posts'> & { posts: Array<ResolversTypes['Post']> }
  >
  SendMailInput: SendMailInput
  SendMailResponse: ResolverTypeWrapper<SendMailResponse>
  Series: ResolverTypeWrapper<
    Omit<Series, 'series_posts' | 'user'> & {
      series_posts?: Maybe<Array<Maybe<ResolversTypes['SeriesPost']>>>
      user?: Maybe<ResolversTypes['User']>
    }
  >
  SeriesPost: ResolverTypeWrapper<
    Omit<SeriesPost, 'post'> & { post?: Maybe<ResolversTypes['Post']> }
  >
  Stats: ResolverTypeWrapper<Stats>
  String: ResolverTypeWrapper<Scalars['String']['output']>
  TrendingPostsInput: TrendingPostsInput
  UnfollowInput: UnfollowInput
  UnlikePostInput: UnlikePostInput
  User: ResolverTypeWrapper<UserModel>
  UserMeta: ResolverTypeWrapper<UserMeta>
  UserProfile: ResolverTypeWrapper<UserProfileModel>
  UserToken: ResolverTypeWrapper<UserToken>
  VelogConfig: ResolverTypeWrapper<VelogConfig>
  Void: ResolverTypeWrapper<Scalars['Void']['output']>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output']
  Comment: CommentModel
  Date: Scalars['Date']['output']
  FollowInput: FollowInput
  ID: Scalars['ID']['output']
  Int: Scalars['Int']['output']
  JSON: Scalars['JSON']['output']
  LikePostInput: LikePostInput
  LinkedPosts: Omit<LinkedPosts, 'next' | 'previous'> & {
    next?: Maybe<ResolversParentTypes['Post']>
    previous?: Maybe<ResolversParentTypes['Post']>
  }
  Mutation: {}
  Post: PostModel
  PostHistory: PostHistory
  Query: {}
  ReadCountByDay: ReadCountByDay
  ReadPostInput: ReadPostInput
  ReadingListInput: ReadingListInput
  RecentPostsInput: RecentPostsInput
  SearchResult: Omit<SearchResult, 'posts'> & { posts: Array<ResolversParentTypes['Post']> }
  SendMailInput: SendMailInput
  SendMailResponse: SendMailResponse
  Series: Omit<Series, 'series_posts' | 'user'> & {
    series_posts?: Maybe<Array<Maybe<ResolversParentTypes['SeriesPost']>>>
    user?: Maybe<ResolversParentTypes['User']>
  }
  SeriesPost: Omit<SeriesPost, 'post'> & { post?: Maybe<ResolversParentTypes['Post']> }
  Stats: Stats
  String: Scalars['String']['output']
  TrendingPostsInput: TrendingPostsInput
  UnfollowInput: UnfollowInput
  UnlikePostInput: UnlikePostInput
  User: UserModel
  UserMeta: UserMeta
  UserProfile: UserProfileModel
  UserToken: UserToken
  VelogConfig: VelogConfig
  Void: Scalars['Void']['output']
}

export type CommentResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment'],
> = {
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  deleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  has_replies?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  level?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  likes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  replies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Comment']>>>, ParentType, ContextType>
  replies_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export type LinkedPostsResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['LinkedPosts'] = ResolversParentTypes['LinkedPosts'],
> = {
  next?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>
  previous?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  follow?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationFollowArgs, 'input'>
  >
  likePost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationLikePostArgs, 'input'>
  >
  logout?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType>
  sendMail?: Resolver<
    Maybe<ResolversTypes['SendMailResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationSendMailArgs, 'input'>
  >
  unfollow?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationUnfollowArgs, 'input'>
  >
  unlikePost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationUnlikePostArgs, 'input'>
  >
}

export type PostResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post'],
> = {
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  comments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Comment']>>>, ParentType, ContextType>
  comments_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  fk_user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  followed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  is_markdown?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  is_private?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  is_temp?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  last_read_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  liked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  likes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  linked_posts?: Resolver<Maybe<ResolversTypes['LinkedPosts']>, ParentType, ContextType>
  meta?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>
  original_post_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  recommended_posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>
  released_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  series?: Resolver<Maybe<ResolversTypes['Series']>, ParentType, ContextType>
  short_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  updated_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  url_slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  views?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PostHistoryResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['PostHistory'] = ResolversParentTypes['PostHistory'],
> = {
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  fk_post_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  is_markdown?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  followers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>
  followings?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>
  post?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<QueryPostArgs, 'input'>
  >
  readingList?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Post']>>>,
    ParentType,
    ContextType,
    RequireFields<QueryReadingListArgs, 'input'>
  >
  recentPosts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Post']>>>,
    ParentType,
    ContextType,
    RequireFields<QueryRecentPostsArgs, 'input'>
  >
  restoreToken?: Resolver<Maybe<ResolversTypes['UserToken']>, ParentType, ContextType>
  trendingPosts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Post']>>>,
    ParentType,
    ContextType,
    RequireFields<QueryTrendingPostsArgs, 'input'>
  >
}

export type ReadCountByDayResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ReadCountByDay'] = ResolversParentTypes['ReadCountByDay'],
> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  day?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SearchResultResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult'],
> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SendMailResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['SendMailResponse'] = ResolversParentTypes['SendMailResponse'],
> = {
  registered?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SeriesResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Series'] = ResolversParentTypes['Series'],
> = {
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
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
  ParentType extends ResolversParentTypes['SeriesPost'] = ResolversParentTypes['SeriesPost'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  index?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type StatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Stats'] = ResolversParentTypes['Stats'],
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
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  is_certified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  profile?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>
  series_list?: Resolver<Array<Maybe<ResolversTypes['Series']>>, ParentType, ContextType>
  updated_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  user_meta?: Resolver<Maybe<ResolversTypes['UserMeta']>, ParentType, ContextType>
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  velog_config?: Resolver<Maybe<ResolversTypes['VelogConfig']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserMetaResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['UserMeta'] = ResolversParentTypes['UserMeta'],
> = {
  email_notification?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  email_promotion?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserProfileResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['UserProfile'] = ResolversParentTypes['UserProfile'],
> = {
  about?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  display_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  profile_links?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>
  short_bio?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  updated_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserTokenResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['UserToken'] = ResolversParentTypes['UserToken'],
> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VelogConfigResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['VelogConfig'] = ResolversParentTypes['VelogConfig'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  logo_image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void'
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
  SendMailResponse?: SendMailResponseResolvers<ContextType>
  Series?: SeriesResolvers<ContextType>
  SeriesPost?: SeriesPostResolvers<ContextType>
  Stats?: StatsResolvers<ContextType>
  User?: UserResolvers<ContextType>
  UserMeta?: UserMetaResolvers<ContextType>
  UserProfile?: UserProfileResolvers<ContextType>
  UserToken?: UserTokenResolvers<ContextType>
  VelogConfig?: VelogConfigResolvers<ContextType>
  Void?: GraphQLScalarType
}
