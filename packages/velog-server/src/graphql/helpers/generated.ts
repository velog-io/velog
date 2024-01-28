/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationType } from './enums'
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
import {
  User as UserModel,
  UserProfile as UserProfileModel,
  Post as PostModel,
  Comment as CommentModel,
} from '@prisma/client'
import { GraphQLContext } from './../../common/interfaces/graphql'
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
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  Date: { input: Date; output: Date }
  JSON: { input: Record<string, any>; output: Record<string, any> }
  PositiveInt: { input: number; output: number }
  Void: { input: void; output: void }
}

export type Ad = {
  body: Scalars['String']['output']
  end_date: Scalars['Date']['output']
  id: Scalars['ID']['output']
  image: Scalars['String']['output']
  is_disabled: Scalars['Boolean']['output']
  start_date: Scalars['Date']['output']
  title: Scalars['String']['output']
  type: Scalars['String']['output']
  url: Scalars['String']['output']
}

export type AdsInput = {
  limit?: InputMaybe<Scalars['Int']['input']>
  type: Scalars['String']['input']
  writer_username?: InputMaybe<Scalars['String']['input']>
}

export type CheckEmailExistsInput = {
  email: Scalars['String']['input']
}

export type Comment = {
  created_at?: Maybe<Scalars['Date']['output']>
  deleted?: Maybe<Scalars['Boolean']['output']>
  has_replies?: Maybe<Scalars['Boolean']['output']>
  id: Scalars['ID']['output']
  level?: Maybe<Scalars['Int']['output']>
  likes?: Maybe<Scalars['Int']['output']>
  replies: Array<Comment>
  replies_count?: Maybe<Scalars['Int']['output']>
  text?: Maybe<Scalars['String']['output']>
  user?: Maybe<User>
}

export type CommentNotificationActionInput = {
  actor_display_name: Scalars['String']['input']
  actor_thumbnail: Scalars['String']['input']
  actor_username: Scalars['String']['input']
  comment_id: Scalars['ID']['input']
  comment_text: Scalars['String']['input']
  post_id: Scalars['ID']['input']
  post_title: Scalars['String']['input']
  post_url_slug: Scalars['String']['input']
  post_writer_username: Scalars['String']['input']
  type: NotificationType
}

export type ConfirmChangeEmailInput = {
  code: Scalars['String']['input']
}

export type CreateNotificationInput = {
  action: NotificationActionInput
  action_id?: InputMaybe<Scalars['String']['input']>
  actor_id?: InputMaybe<Scalars['String']['input']>
  fk_user_id: Scalars['String']['input']
  type: NotificationType
}

export type FeedPostsInput = {
  limit?: InputMaybe<Scalars['PositiveInt']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
}

export type FollowInput = {
  followingUserId: Scalars['ID']['input']
}

export type FollowNotificationActionInput = {
  actor_display_name: Scalars['String']['input']
  actor_thumbnail: Scalars['String']['input']
  actor_user_id: Scalars['ID']['input']
  actor_username: Scalars['String']['input']
  follow_id: Scalars['ID']['input']
  type: NotificationType
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

export type InitiateChangeEmailInput = {
  email: Scalars['String']['input']
}

export type LikePostInput = {
  postId?: InputMaybe<Scalars['ID']['input']>
}

export type LinkedPosts = {
  next?: Maybe<Post>
  previous?: Maybe<Post>
}

export type Mutation = {
  acceptIntegration: Scalars['String']['output']
  confirmChangeEmail?: Maybe<Scalars['Void']['output']>
  createNotification: Notification
  follow?: Maybe<Scalars['Boolean']['output']>
  initiateChangeEmail?: Maybe<Scalars['Void']['output']>
  likePost?: Maybe<Post>
  logout?: Maybe<Scalars['Void']['output']>
  readAllNotifications?: Maybe<Scalars['Void']['output']>
  readNotification?: Maybe<Scalars['Void']['output']>
  removeAllNotifications?: Maybe<Scalars['Void']['output']>
  sendMail?: Maybe<SendMailResponse>
  unfollow?: Maybe<Scalars['Boolean']['output']>
  unlikePost?: Maybe<Post>
  unregister?: Maybe<Scalars['Void']['output']>
  updateAbout?: Maybe<UserProfile>
  updateEmailRules?: Maybe<UserMeta>
  updateProfile?: Maybe<UserProfile>
  updateSocialInfo?: Maybe<UserProfile>
  updateThumbnail?: Maybe<UserProfile>
  updateVelogTitle?: Maybe<VelogConfig>
}

export type MutationConfirmChangeEmailArgs = {
  input: ConfirmChangeEmailInput
}

export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput
}

export type MutationFollowArgs = {
  input: FollowInput
}

export type MutationInitiateChangeEmailArgs = {
  input: InitiateChangeEmailInput
}

export type MutationLikePostArgs = {
  input: LikePostInput
}

export type MutationReadNotificationArgs = {
  input: ReadNotificationInput
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

export type MutationUnregisterArgs = {
  input: UnregisterInput
}

export type MutationUpdateAboutArgs = {
  input: UpdateAboutInput
}

export type MutationUpdateEmailRulesArgs = {
  input: UpdateEmailRulesInput
}

export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput
}

export type MutationUpdateSocialInfoArgs = {
  input: UpdateSocialInfoInput
}

export type MutationUpdateThumbnailArgs = {
  input: UpdateThumbnailInput
}

export type MutationUpdateVelogTitleArgs = {
  input: UpdateVelogTitleInput
}

export type Notification = {
  action: Scalars['JSON']['output']
  action_id?: Maybe<Scalars['ID']['output']>
  actor_id?: Maybe<Scalars['ID']['output']>
  created_at: Scalars['Date']['output']
  fk_user_id: Scalars['String']['output']
  id: Scalars['ID']['output']
  is_deleted: Scalars['Boolean']['output']
  is_read: Scalars['Boolean']['output']
  type: NotificationType
}

export type NotificationActionInput = {
  comment?: InputMaybe<CommentNotificationActionInput>
  follow?: InputMaybe<FollowNotificationActionInput>
  postLike?: InputMaybe<PostLikeNotificationActionInput>
}

export { NotificationType }

export type NotificationsInput = {
  is_read?: InputMaybe<Scalars['Boolean']['input']>
}

export type Post = {
  body?: Maybe<Scalars['String']['output']>
  comments: Array<Comment>
  comments_count?: Maybe<Scalars['Int']['output']>
  created_at: Scalars['Date']['output']
  fk_user_id: Scalars['String']['output']
  id: Scalars['ID']['output']
  is_followed?: Maybe<Scalars['Boolean']['output']>
  is_liked?: Maybe<Scalars['Boolean']['output']>
  is_markdown?: Maybe<Scalars['Boolean']['output']>
  is_private: Scalars['Boolean']['output']
  is_temp?: Maybe<Scalars['Boolean']['output']>
  last_read_at?: Maybe<Scalars['Date']['output']>
  likes?: Maybe<Scalars['Int']['output']>
  linked_posts?: Maybe<LinkedPosts>
  meta?: Maybe<Scalars['JSON']['output']>
  original_post_id?: Maybe<Scalars['ID']['output']>
  recommended_posts: Array<Post>
  released_at?: Maybe<Scalars['Date']['output']>
  series?: Maybe<Series>
  short_description?: Maybe<Scalars['String']['output']>
  tags: Array<Scalars['String']['output']>
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

export type PostLikeNotificationActionInput = {
  actor_display_name: Scalars['String']['input']
  actor_thumbnail: Scalars['String']['input']
  actor_username: Scalars['String']['input']
  post_id: Scalars['ID']['input']
  post_like_id: Scalars['ID']['input']
  post_title: Scalars['String']['input']
  post_url_slug: Scalars['String']['input']
  post_writer_username: Scalars['String']['input']
  type: NotificationType
}

export type Query = {
  ads: Array<Ad>
  checkEmailExists: Scalars['Boolean']['output']
  currentUser?: Maybe<User>
  feedPosts: Array<Post>
  followers: Array<FollowResult>
  followings: Array<FollowResult>
  isLogged?: Maybe<Scalars['Boolean']['output']>
  notificationCount: Scalars['Int']['output']
  notifications: Array<Notification>
  post?: Maybe<Post>
  posts: Array<Post>
  readingList: Array<Post>
  recentPosts: Array<Post>
  restoreToken: UserToken
  searchPosts: SearchResult
  series?: Maybe<Series>
  seriesList: Array<Series>
  trendingPosts: Array<Post>
  trendingWriters: Array<TrendingWriter>
  unregisterToken: Scalars['String']['output']
  user?: Maybe<User>
  userTags?: Maybe<UserTags>
  velogConfig: VelogConfig
}

export type QueryAdsArgs = {
  input: AdsInput
}

export type QueryCheckEmailExistsArgs = {
  input: CheckEmailExistsInput
}

export type QueryFeedPostsArgs = {
  input: FeedPostsInput
}

export type QueryFollowersArgs = {
  input: GetFollowInput
}

export type QueryFollowingsArgs = {
  input: GetFollowInput
}

export type QueryNotificationsArgs = {
  input: NotificationsInput
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
  count?: Maybe<Scalars['Int']['output']>
  day?: Maybe<Scalars['Date']['output']>
}

export type ReadNotificationInput = {
  notification_ids: Array<Scalars['String']['input']>
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
  registered?: Maybe<Scalars['Boolean']['output']>
}

export type Series = {
  created_at: Scalars['Date']['output']
  description?: Maybe<Scalars['String']['output']>
  fk_user_id?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  name?: Maybe<Scalars['String']['output']>
  posts_count?: Maybe<Scalars['Int']['output']>
  series_posts?: Maybe<Array<SeriesPost>>
  thumbnail?: Maybe<Scalars['String']['output']>
  updated_at: Scalars['Date']['output']
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

export type Tag = {
  created_at?: Maybe<Scalars['Date']['output']>
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  name?: Maybe<Scalars['String']['output']>
  posts_count?: Maybe<Scalars['Int']['output']>
  thumbnail?: Maybe<Scalars['String']['output']>
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
  thumbnail?: Maybe<Scalars['String']['output']>
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

export type UnregisterInput = {
  token: Scalars['String']['input']
}

export type UpdateAboutInput = {
  about: Scalars['String']['input']
}

export type UpdateEmailRulesInput = {
  notification: Scalars['Boolean']['input']
  promotion: Scalars['Boolean']['input']
}

export type UpdateProfileInput = {
  display_name: Scalars['String']['input']
  short_bio: Scalars['String']['input']
}

export type UpdateSocialInfoInput = {
  profile_links: Scalars['JSON']['input']
}

export type UpdateThumbnailInput = {
  url?: InputMaybe<Scalars['String']['input']>
}

export type UpdateVelogTitleInput = {
  title: Scalars['String']['input']
}

export type User = {
  created_at: Scalars['Date']['output']
  email?: Maybe<Scalars['String']['output']>
  followers_count: Scalars['Int']['output']
  followings_count: Scalars['Int']['output']
  id: Scalars['ID']['output']
  is_certified: Scalars['Boolean']['output']
  is_followed: Scalars['Boolean']['output']
  profile: UserProfile
  series_list: Array<Series>
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
  Ad: ResolverTypeWrapper<Ad>
  AdsInput: AdsInput
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  CheckEmailExistsInput: CheckEmailExistsInput
  Comment: ResolverTypeWrapper<CommentModel>
  CommentNotificationActionInput: CommentNotificationActionInput
  ConfirmChangeEmailInput: ConfirmChangeEmailInput
  CreateNotificationInput: CreateNotificationInput
  Date: ResolverTypeWrapper<Scalars['Date']['output']>
  FeedPostsInput: FeedPostsInput
  FollowInput: FollowInput
  FollowNotificationActionInput: FollowNotificationActionInput
  FollowResult: ResolverTypeWrapper<
    Omit<FollowResult, 'profile'> & { profile: ResolversTypes['UserProfile'] }
  >
  GetFollowInput: GetFollowInput
  GetPostsInput: GetPostsInput
  GetSearchPostsInput: GetSearchPostsInput
  GetSeriesInput: GetSeriesInput
  GetSeriesListInput: GetSeriesListInput
  GetUserInput: GetUserInput
  GetVelogConfigInput: GetVelogConfigInput
  ID: ResolverTypeWrapper<Scalars['ID']['output']>
  InitiateChangeEmailInput: InitiateChangeEmailInput
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
  Notification: ResolverTypeWrapper<Notification>
  NotificationActionInput: NotificationActionInput
  NotificationType: NotificationType
  NotificationsInput: NotificationsInput
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']['output']>
  Post: ResolverTypeWrapper<PostModel>
  PostHistory: ResolverTypeWrapper<PostHistory>
  PostLikeNotificationActionInput: PostLikeNotificationActionInput
  Query: ResolverTypeWrapper<{}>
  ReadCountByDay: ResolverTypeWrapper<ReadCountByDay>
  ReadNotificationInput: ReadNotificationInput
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
      series_posts?: Maybe<Array<ResolversTypes['SeriesPost']>>
      user?: Maybe<ResolversTypes['User']>
    }
  >
  SeriesPost: ResolverTypeWrapper<
    Omit<SeriesPost, 'post'> & { post?: Maybe<ResolversTypes['Post']> }
  >
  Stats: ResolverTypeWrapper<Stats>
  String: ResolverTypeWrapper<Scalars['String']['output']>
  Tag: ResolverTypeWrapper<Tag>
  TrendingPostsInput: TrendingPostsInput
  TrendingWriter: ResolverTypeWrapper<TrendingWriter>
  TrendingWriterPosts: ResolverTypeWrapper<TrendingWriterPosts>
  TrendingWriterProfile: ResolverTypeWrapper<TrendingWriterProfile>
  TrendingWriterUser: ResolverTypeWrapper<TrendingWriterUser>
  TrendingWritersInput: TrendingWritersInput
  UnfollowInput: UnfollowInput
  UnlikePostInput: UnlikePostInput
  UnregisterInput: UnregisterInput
  UpdateAboutInput: UpdateAboutInput
  UpdateEmailRulesInput: UpdateEmailRulesInput
  UpdateProfileInput: UpdateProfileInput
  UpdateSocialInfoInput: UpdateSocialInfoInput
  UpdateThumbnailInput: UpdateThumbnailInput
  UpdateVelogTitleInput: UpdateVelogTitleInput
  User: ResolverTypeWrapper<UserModel>
  UserMeta: ResolverTypeWrapper<UserMeta>
  UserProfile: ResolverTypeWrapper<UserProfileModel>
  UserTags: ResolverTypeWrapper<UserTags>
  UserTagsInput: UserTagsInput
  UserToken: ResolverTypeWrapper<UserToken>
  VelogConfig: ResolverTypeWrapper<VelogConfig>
  Void: ResolverTypeWrapper<Scalars['Void']['output']>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Ad: Ad
  AdsInput: AdsInput
  Boolean: Scalars['Boolean']['output']
  CheckEmailExistsInput: CheckEmailExistsInput
  Comment: CommentModel
  CommentNotificationActionInput: CommentNotificationActionInput
  ConfirmChangeEmailInput: ConfirmChangeEmailInput
  CreateNotificationInput: CreateNotificationInput
  Date: Scalars['Date']['output']
  FeedPostsInput: FeedPostsInput
  FollowInput: FollowInput
  FollowNotificationActionInput: FollowNotificationActionInput
  FollowResult: Omit<FollowResult, 'profile'> & { profile: ResolversParentTypes['UserProfile'] }
  GetFollowInput: GetFollowInput
  GetPostsInput: GetPostsInput
  GetSearchPostsInput: GetSearchPostsInput
  GetSeriesInput: GetSeriesInput
  GetSeriesListInput: GetSeriesListInput
  GetUserInput: GetUserInput
  GetVelogConfigInput: GetVelogConfigInput
  ID: Scalars['ID']['output']
  InitiateChangeEmailInput: InitiateChangeEmailInput
  Int: Scalars['Int']['output']
  JSON: Scalars['JSON']['output']
  LikePostInput: LikePostInput
  LinkedPosts: Omit<LinkedPosts, 'next' | 'previous'> & {
    next?: Maybe<ResolversParentTypes['Post']>
    previous?: Maybe<ResolversParentTypes['Post']>
  }
  Mutation: {}
  Notification: Notification
  NotificationActionInput: NotificationActionInput
  NotificationsInput: NotificationsInput
  PositiveInt: Scalars['PositiveInt']['output']
  Post: PostModel
  PostHistory: PostHistory
  PostLikeNotificationActionInput: PostLikeNotificationActionInput
  Query: {}
  ReadCountByDay: ReadCountByDay
  ReadNotificationInput: ReadNotificationInput
  ReadPostInput: ReadPostInput
  ReadingListInput: ReadingListInput
  RecentPostsInput: RecentPostsInput
  SearchResult: Omit<SearchResult, 'posts'> & { posts: Array<ResolversParentTypes['Post']> }
  SendMailInput: SendMailInput
  SendMailResponse: SendMailResponse
  Series: Omit<Series, 'series_posts' | 'user'> & {
    series_posts?: Maybe<Array<ResolversParentTypes['SeriesPost']>>
    user?: Maybe<ResolversParentTypes['User']>
  }
  SeriesPost: Omit<SeriesPost, 'post'> & { post?: Maybe<ResolversParentTypes['Post']> }
  Stats: Stats
  String: Scalars['String']['output']
  Tag: Tag
  TrendingPostsInput: TrendingPostsInput
  TrendingWriter: TrendingWriter
  TrendingWriterPosts: TrendingWriterPosts
  TrendingWriterProfile: TrendingWriterProfile
  TrendingWriterUser: TrendingWriterUser
  TrendingWritersInput: TrendingWritersInput
  UnfollowInput: UnfollowInput
  UnlikePostInput: UnlikePostInput
  UnregisterInput: UnregisterInput
  UpdateAboutInput: UpdateAboutInput
  UpdateEmailRulesInput: UpdateEmailRulesInput
  UpdateProfileInput: UpdateProfileInput
  UpdateSocialInfoInput: UpdateSocialInfoInput
  UpdateThumbnailInput: UpdateThumbnailInput
  UpdateVelogTitleInput: UpdateVelogTitleInput
  User: UserModel
  UserMeta: UserMeta
  UserProfile: UserProfileModel
  UserTags: UserTags
  UserTagsInput: UserTagsInput
  UserToken: UserToken
  VelogConfig: VelogConfig
  Void: Scalars['Void']['output']
}

export type AdResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Ad'] = ResolversParentTypes['Ad'],
> = {
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  end_date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  is_disabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  start_date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
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
  replies?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>
  replies_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type FollowResultResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['FollowResult'] = ResolversParentTypes['FollowResult'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  is_followed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  profile?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
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
  acceptIntegration?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  confirmChangeEmail?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationConfirmChangeEmailArgs, 'input'>
  >
  createNotification?: Resolver<
    ResolversTypes['Notification'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateNotificationArgs, 'input'>
  >
  follow?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationFollowArgs, 'input'>
  >
  initiateChangeEmail?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationInitiateChangeEmailArgs, 'input'>
  >
  likePost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationLikePostArgs, 'input'>
  >
  logout?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType>
  readAllNotifications?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType>
  readNotification?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationReadNotificationArgs, 'input'>
  >
  removeAllNotifications?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType>
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
  unregister?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationUnregisterArgs, 'input'>
  >
  updateAbout?: Resolver<
    Maybe<ResolversTypes['UserProfile']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateAboutArgs, 'input'>
  >
  updateEmailRules?: Resolver<
    Maybe<ResolversTypes['UserMeta']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateEmailRulesArgs, 'input'>
  >
  updateProfile?: Resolver<
    Maybe<ResolversTypes['UserProfile']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateProfileArgs, 'input'>
  >
  updateSocialInfo?: Resolver<
    Maybe<ResolversTypes['UserProfile']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateSocialInfoArgs, 'input'>
  >
  updateThumbnail?: Resolver<
    Maybe<ResolversTypes['UserProfile']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateThumbnailArgs, 'input'>
  >
  updateVelogTitle?: Resolver<
    Maybe<ResolversTypes['VelogConfig']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateVelogTitleArgs, 'input'>
  >
}

export type NotificationResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification'],
> = {
  action?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>
  action_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  actor_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  fk_user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  is_deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  is_read?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['NotificationType'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type NotificationTypeResolvers = EnumResolverSignature<
  { comment?: any; follow?: any; postLike?: any },
  ResolversTypes['NotificationType']
>

export interface PositiveIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt'
}

export type PostResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post'],
> = {
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>
  comments_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  fk_user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  is_followed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  is_liked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  is_markdown?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  is_private?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  is_temp?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  last_read_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  likes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  linked_posts?: Resolver<Maybe<ResolversTypes['LinkedPosts']>, ParentType, ContextType>
  meta?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>
  original_post_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  recommended_posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>
  released_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  series?: Resolver<Maybe<ResolversTypes['Series']>, ParentType, ContextType>
  short_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
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
  ads?: Resolver<
    Array<ResolversTypes['Ad']>,
    ParentType,
    ContextType,
    RequireFields<QueryAdsArgs, 'input'>
  >
  checkEmailExists?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<QueryCheckEmailExistsArgs, 'input'>
  >
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  feedPosts?: Resolver<
    Array<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<QueryFeedPostsArgs, 'input'>
  >
  followers?: Resolver<
    Array<ResolversTypes['FollowResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryFollowersArgs, 'input'>
  >
  followings?: Resolver<
    Array<ResolversTypes['FollowResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryFollowingsArgs, 'input'>
  >
  isLogged?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  notificationCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  notifications?: Resolver<
    Array<ResolversTypes['Notification']>,
    ParentType,
    ContextType,
    RequireFields<QueryNotificationsArgs, 'input'>
  >
  post?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<QueryPostArgs, 'input'>
  >
  posts?: Resolver<
    Array<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<QueryPostsArgs, 'input'>
  >
  readingList?: Resolver<
    Array<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<QueryReadingListArgs, 'input'>
  >
  recentPosts?: Resolver<
    Array<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<QueryRecentPostsArgs, 'input'>
  >
  restoreToken?: Resolver<ResolversTypes['UserToken'], ParentType, ContextType>
  searchPosts?: Resolver<
    ResolversTypes['SearchResult'],
    ParentType,
    ContextType,
    RequireFields<QuerySearchPostsArgs, 'input'>
  >
  series?: Resolver<
    Maybe<ResolversTypes['Series']>,
    ParentType,
    ContextType,
    RequireFields<QuerySeriesArgs, 'input'>
  >
  seriesList?: Resolver<
    Array<ResolversTypes['Series']>,
    ParentType,
    ContextType,
    RequireFields<QuerySeriesListArgs, 'input'>
  >
  trendingPosts?: Resolver<
    Array<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<QueryTrendingPostsArgs, 'input'>
  >
  trendingWriters?: Resolver<
    Array<ResolversTypes['TrendingWriter']>,
    ParentType,
    ContextType,
    RequireFields<QueryTrendingWritersArgs, 'input'>
  >
  unregisterToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  user?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<QueryUserArgs, 'input'>
  >
  userTags?: Resolver<
    Maybe<ResolversTypes['UserTags']>,
    ParentType,
    ContextType,
    RequireFields<QueryUserTagsArgs, 'input'>
  >
  velogConfig?: Resolver<
    ResolversTypes['VelogConfig'],
    ParentType,
    ContextType,
    RequireFields<QueryVelogConfigArgs, 'input'>
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
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
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
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  fk_user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  posts_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  series_posts?: Resolver<Maybe<Array<ResolversTypes['SeriesPost']>>, ParentType, ContextType>
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  updated_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
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

export type TagResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag'],
> = {
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  posts_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TrendingWriterResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['TrendingWriter'] = ResolversParentTypes['TrendingWriter'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  posts?: Resolver<Array<ResolversTypes['TrendingWriterPosts']>, ParentType, ContextType>
  user?: Resolver<ResolversTypes['TrendingWriterUser'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TrendingWriterPostsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['TrendingWriterPosts'] = ResolversParentTypes['TrendingWriterPosts'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  thumbnail?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  url_slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TrendingWriterProfileResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['TrendingWriterProfile'] = ResolversParentTypes['TrendingWriterProfile'],
> = {
  display_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  short_bio?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TrendingWriterUserResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['TrendingWriterUser'] = ResolversParentTypes['TrendingWriterUser'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  profile?: Resolver<ResolversTypes['TrendingWriterProfile'], ParentType, ContextType>
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  followers_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  followings_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  is_certified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  is_followed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  profile?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>
  series_list?: Resolver<Array<ResolversTypes['Series']>, ParentType, ContextType>
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

export type UserTagsResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['UserTags'] = ResolversParentTypes['UserTags'],
> = {
  posts_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>
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
  Ad?: AdResolvers<ContextType>
  Comment?: CommentResolvers<ContextType>
  Date?: GraphQLScalarType
  FollowResult?: FollowResultResolvers<ContextType>
  JSON?: GraphQLScalarType
  LinkedPosts?: LinkedPostsResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Notification?: NotificationResolvers<ContextType>
  NotificationType?: NotificationTypeResolvers
  PositiveInt?: GraphQLScalarType
  Post?: PostResolvers<ContextType>
  PostHistory?: PostHistoryResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  ReadCountByDay?: ReadCountByDayResolvers<ContextType>
  SearchResult?: SearchResultResolvers<ContextType>
  SendMailResponse?: SendMailResponseResolvers<ContextType>
  Series?: SeriesResolvers<ContextType>
  SeriesPost?: SeriesPostResolvers<ContextType>
  Stats?: StatsResolvers<ContextType>
  Tag?: TagResolvers<ContextType>
  TrendingWriter?: TrendingWriterResolvers<ContextType>
  TrendingWriterPosts?: TrendingWriterPostsResolvers<ContextType>
  TrendingWriterProfile?: TrendingWriterProfileResolvers<ContextType>
  TrendingWriterUser?: TrendingWriterUserResolvers<ContextType>
  User?: UserResolvers<ContextType>
  UserMeta?: UserMetaResolvers<ContextType>
  UserProfile?: UserProfileResolvers<ContextType>
  UserTags?: UserTagsResolvers<ContextType>
  UserToken?: UserTokenResolvers<ContextType>
  VelogConfig?: VelogConfigResolvers<ContextType>
  Void?: GraphQLScalarType
}
