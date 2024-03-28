import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  UseQueryOptions,
  UseSuspenseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'
import { fetcher } from './fetcher'
export type Maybe<T> = T | null
export type InputMaybe<T> = T | null | undefined
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
  JSON: { input: Record<string, any>; output: Record<string, any> }
  PositiveInt: { input: number; output: number }
  Void: { input: void; output: void }
}

export type Ad = {
  body: Scalars['String']['output']
  end_date: Scalars['DateTimeISO']['output']
  id: Scalars['ID']['output']
  image: Scalars['String']['output']
  is_disabled: Scalars['Boolean']['output']
  start_date: Scalars['DateTimeISO']['output']
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

export type CommentReplyNotifictionActionInput = {
  actor_display_name: Scalars['String']['input']
  actor_thumbnail: Scalars['String']['input']
  actor_username: Scalars['String']['input']
  comment_id: Scalars['ID']['input']
  parent_comment_text: Scalars['String']['input']
  post_id: Scalars['ID']['input']
  post_url_slug: Scalars['String']['input']
  post_writer_username: Scalars['String']['input']
  reply_comment_text: Scalars['String']['input']
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

export type EditPostInput = {
  body: Scalars['String']['input']
  id: Scalars['ID']['input']
  is_markdown: Scalars['Boolean']['input']
  is_private: Scalars['Boolean']['input']
  is_temp: Scalars['Boolean']['input']
  meta: Scalars['JSON']['input']
  series_id?: InputMaybe<Scalars['ID']['input']>
  tags: Array<Scalars['String']['input']>
  thumbnail?: InputMaybe<Scalars['String']['input']>
  title: Scalars['String']['input']
  token?: InputMaybe<Scalars['String']['input']>
  url_slug: Scalars['String']['input']
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
  next: Maybe<Post>
  previous: Maybe<Post>
}

export type Mutation = {
  acceptIntegration: Scalars['String']['output']
  confirmChangeEmail: Maybe<Scalars['Void']['output']>
  createNotification: Notification
  editPost: Post
  follow: Maybe<Scalars['Boolean']['output']>
  initiateChangeEmail: Maybe<Scalars['Void']['output']>
  likePost: Post
  logout: Maybe<Scalars['Void']['output']>
  readAllNotifications: Maybe<Scalars['Void']['output']>
  readNotification: Maybe<Scalars['Void']['output']>
  removeAllNotifications: Maybe<Scalars['Void']['output']>
  sendMail: Maybe<SendMailResponse>
  unfollow: Maybe<Scalars['Boolean']['output']>
  unlikePost: Post
  unregister: Maybe<Scalars['Void']['output']>
  updateAbout: Maybe<UserProfile>
  updateEmailRules: Maybe<UserMeta>
  updateNotNoticeNotification: Maybe<Scalars['Void']['output']>
  updateProfile: Maybe<UserProfile>
  updateSocialInfo: Maybe<UserProfile>
  updateThumbnail: Maybe<UserProfile>
  updateVelogTitle: Maybe<VelogConfig>
  writePost: Post
}

export type MutationConfirmChangeEmailArgs = {
  input: ConfirmChangeEmailInput
}

export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput
}

export type MutationEditPostArgs = {
  input: EditPostInput
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

export type MutationWritePostArgs = {
  input: WritePostInput
}

export type Notification = {
  action: Scalars['JSON']['output']
  action_id: Maybe<Scalars['ID']['output']>
  actor_id: Maybe<Scalars['ID']['output']>
  created_at: Scalars['DateTimeISO']['output']
  fk_user_id: Scalars['String']['output']
  id: Scalars['ID']['output']
  is_deleted: Scalars['Boolean']['output']
  is_read: Scalars['Boolean']['output']
  type: NotificationType
}

export type NotificationActionInput = {
  comment?: InputMaybe<CommentNotificationActionInput>
  commentReply?: InputMaybe<CommentReplyNotifictionActionInput>
  follow?: InputMaybe<FollowNotificationActionInput>
  postLike?: InputMaybe<PostLikeNotificationActionInput>
}

export enum NotificationType {
  Comment = 'comment',
  CommentReply = 'commentReply',
  Follow = 'follow',
  PostLike = 'postLike',
}

export type NotificationsInput = {
  is_read?: InputMaybe<Scalars['Boolean']['input']>
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
  currentUser: Maybe<User>
  feedPosts: Array<Post>
  followers: Array<FollowResult>
  followings: Array<FollowResult>
  isLogged: Maybe<Scalars['Boolean']['output']>
  notNoticeNotificationCount: Scalars['Int']['output']
  notifications: Array<Notification>
  post: Maybe<Post>
  posts: Array<Post>
  readingList: Array<Post>
  recentPosts: Array<Post>
  restoreToken: UserToken
  searchPosts: SearchResult
  series: Maybe<Series>
  seriesList: Array<Series>
  trendingPosts: Array<Post>
  trendingWriters: Array<TrendingWriter>
  unregisterToken: Scalars['String']['output']
  user: Maybe<User>
  userTags: Maybe<UserTags>
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
  count: Maybe<Scalars['Int']['output']>
  day: Maybe<Scalars['DateTimeISO']['output']>
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
  created_at: Scalars['DateTimeISO']['output']
  email: Maybe<Scalars['String']['output']>
  followers_count: Scalars['Int']['output']
  followings_count: Scalars['Int']['output']
  id: Scalars['ID']['output']
  is_certified: Scalars['Boolean']['output']
  is_followed: Scalars['Boolean']['output']
  is_trusted: Scalars['Boolean']['output']
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

export type WritePostInput = {
  body: Scalars['String']['input']
  is_markdown: Scalars['Boolean']['input']
  is_private: Scalars['Boolean']['input']
  is_temp: Scalars['Boolean']['input']
  meta: Scalars['JSON']['input']
  series_id?: InputMaybe<Scalars['ID']['input']>
  tags: Array<Scalars['String']['input']>
  thumbnail?: InputMaybe<Scalars['String']['input']>
  title: Scalars['String']['input']
  token?: InputMaybe<Scalars['String']['input']>
  url_slug: Scalars['String']['input']
}

export type AdsQueryVariables = Exact<{
  input: AdsInput
}>

export type AdsQuery = {
  ads: Array<{
    id: string
    title: string
    body: string
    image: string
    url: string
    start_date: any
  }>
}

export type IsLoggedQueryVariables = Exact<{ [key: string]: never }>

export type IsLoggedQuery = { isLogged: boolean | null }

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
    profile: { short_bio: string; thumbnail: string | null; display_name: string }
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
    profile: { short_bio: string; thumbnail: string | null; display_name: string }
  }>
}

export type NotificationQueryVariables = Exact<{
  input: NotificationsInput
}>

export type NotificationQuery = {
  notifications: Array<{
    id: string
    type: NotificationType
    action: Record<string, any>
    actor_id: string | null
    action_id: string | null
    is_read: boolean
    created_at: any
  }>
}

export type NotNoticeNotificationCountQueryVariables = Exact<{ [key: string]: never }>

export type NotNoticeNotificationCountQuery = { notNoticeNotificationCount: number }

export type ReadAllNotificationsMutationVariables = Exact<{ [key: string]: never }>

export type ReadAllNotificationsMutation = { readAllNotifications: void | null }

export type RemoveAllNotificationsMutationVariables = Exact<{ [key: string]: never }>

export type RemoveAllNotificationsMutation = { removeAllNotifications: void | null }

export type ReadNoticationMutationVariables = Exact<{
  input: ReadNotificationInput
}>

export type ReadNoticationMutation = { readNotification: void | null }

export type UpdateNotNoticeNotificationMutationVariables = Exact<{ [key: string]: never }>

export type UpdateNotNoticeNotificationMutation = { updateNotNoticeNotification: void | null }

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
        profile_links: Record<string, any>
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

export type FeedPostsQueryVariables = Exact<{
  input: FeedPostsInput
}>

export type FeedPostsQuery = {
  feedPosts: Array<{
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
      profile_links: Record<string, any>
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
      profile_links: Record<string, any>
    }
  } | null
}

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserQuery = {
  currentUser: {
    id: string
    username: string
    email: string | null
    profile: {
      id: string
      thumbnail: string | null
      display_name: string
      short_bio: string
      profile_links: Record<string, any>
    }
    user_meta: {
      id: string
      email_notification: boolean | null
      email_promotion: boolean | null
    } | null
  } | null
}

export type VelogConfigQueryVariables = Exact<{
  input: GetVelogConfigInput
}>

export type VelogConfigQuery = { velogConfig: { title: string | null; logo_image: string | null } }

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

export type UnregisterTokenQueryVariables = Exact<{ [key: string]: never }>

export type UnregisterTokenQuery = { unregisterToken: string }

export type CheckEmailExistsQueryVariables = Exact<{
  input: CheckEmailExistsInput
}>

export type CheckEmailExistsQuery = { checkEmailExists: boolean }

export type UpdateAboutMutationVariables = Exact<{
  input: UpdateAboutInput
}>

export type UpdateAboutMutation = { updateAbout: { id: string; about: string } | null }

export type UpdateThumbnailMutationVariables = Exact<{
  input: UpdateThumbnailInput
}>

export type UpdateThumbnailMutation = {
  updateThumbnail: { id: string; thumbnail: string | null } | null
}

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput
}>

export type UpdateProfileMutation = {
  updateProfile: { id: string; display_name: string; short_bio: string } | null
}

export type UpdateVelogTitleMutationVariables = Exact<{
  input: UpdateVelogTitleInput
}>

export type UpdateVelogTitleMutation = {
  updateVelogTitle: { id: string; title: string | null } | null
}

export type UpdateSocialInfoMutationVariables = Exact<{
  input: UpdateSocialInfoInput
}>

export type UpdateSocialInfoMutation = {
  updateSocialInfo: { id: string; profile_links: Record<string, any> } | null
}

export type UpdateEmailRulesMutationVariables = Exact<{
  input: UpdateEmailRulesInput
}>

export type UpdateEmailRulesMutation = {
  updateEmailRules: { email_notification: boolean | null; email_promotion: boolean | null } | null
}

export type UnregisterMutationVariables = Exact<{
  input: UnregisterInput
}>

export type UnregisterMutation = { unregister: void | null }

export type InitiateChangeEmailMutationVariables = Exact<{
  input: InitiateChangeEmailInput
}>

export type InitiateChangeEmailMutation = { initiateChangeEmail: void | null }

export type ConfirmChangeEmailMutationVariables = Exact<{
  input: ConfirmChangeEmailInput
}>

export type ConfirmChangeEmailMutation = { confirmChangeEmail: void | null }

export type LogoutMutationVariables = Exact<{ [key: string]: never }>

export type LogoutMutation = { logout: void | null }

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

export const AdsDocument = `
    query ads($input: AdsInput!) {
  ads(input: $input) {
    id
    title
    body
    image
    url
    start_date
  }
}
    `

export const useAdsQuery = <TData = AdsQuery, TError = unknown>(
  variables: AdsQueryVariables,
  options?: Omit<UseQueryOptions<AdsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<AdsQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<AdsQuery, TError, TData>({
    queryKey: ['ads', variables],
    queryFn: fetcher<AdsQuery, AdsQueryVariables>(AdsDocument, variables),
    ...options,
  })
}

useAdsQuery.getKey = (variables: AdsQueryVariables) => ['ads', variables]

export const useSuspenseAdsQuery = <TData = AdsQuery, TError = unknown>(
  variables: AdsQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<AdsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<AdsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<AdsQuery, TError, TData>({
    queryKey: ['adsSuspense', variables],
    queryFn: fetcher<AdsQuery, AdsQueryVariables>(AdsDocument, variables),
    ...options,
  })
}

useSuspenseAdsQuery.getKey = (variables: AdsQueryVariables) => ['adsSuspense', variables]

useAdsQuery.fetcher = (variables: AdsQueryVariables, options?: RequestInit['headers']) =>
  fetcher<AdsQuery, AdsQueryVariables>(AdsDocument, variables, options)

export const IsLoggedDocument = `
    query isLogged {
  isLogged
}
    `

export const useIsLoggedQuery = <TData = IsLoggedQuery, TError = unknown>(
  variables?: IsLoggedQueryVariables,
  options?: Omit<UseQueryOptions<IsLoggedQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<IsLoggedQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<IsLoggedQuery, TError, TData>({
    queryKey: variables === undefined ? ['isLogged'] : ['isLogged', variables],
    queryFn: fetcher<IsLoggedQuery, IsLoggedQueryVariables>(IsLoggedDocument, variables),
    ...options,
  })
}

useIsLoggedQuery.getKey = (variables?: IsLoggedQueryVariables) =>
  variables === undefined ? ['isLogged'] : ['isLogged', variables]

export const useSuspenseIsLoggedQuery = <TData = IsLoggedQuery, TError = unknown>(
  variables?: IsLoggedQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<IsLoggedQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<IsLoggedQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<IsLoggedQuery, TError, TData>({
    queryKey: variables === undefined ? ['isLoggedSuspense'] : ['isLoggedSuspense', variables],
    queryFn: fetcher<IsLoggedQuery, IsLoggedQueryVariables>(IsLoggedDocument, variables),
    ...options,
  })
}

useSuspenseIsLoggedQuery.getKey = (variables?: IsLoggedQueryVariables) =>
  variables === undefined ? ['isLoggedSuspense'] : ['isLoggedSuspense', variables]

useIsLoggedQuery.fetcher = (variables?: IsLoggedQueryVariables, options?: RequestInit['headers']) =>
  fetcher<IsLoggedQuery, IsLoggedQueryVariables>(IsLoggedDocument, variables, options)

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

useSendMailMutation.fetcher = (
  variables: SendMailMutationVariables,
  options?: RequestInit['headers'],
) => fetcher<SendMailMutation, SendMailMutationVariables>(SendMailDocument, variables, options)

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

useFollowMutation.fetcher = (
  variables: FollowMutationVariables,
  options?: RequestInit['headers'],
) => fetcher<FollowMutation, FollowMutationVariables>(FollowDocument, variables, options)

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

useUnfollowMutation.fetcher = (
  variables: UnfollowMutationVariables,
  options?: RequestInit['headers'],
) => fetcher<UnfollowMutation, UnfollowMutationVariables>(UnfollowDocument, variables, options)

export const GetFollowersDocument = `
    query getFollowers($input: GetFollowInput!) {
  followers(input: $input) {
    id
    userId
    username
    profile {
      short_bio
      thumbnail
      display_name
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

useGetFollowersQuery.fetcher = (
  variables: GetFollowersQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, variables, options)

export const GetFollowingsDocument = `
    query getFollowings($input: GetFollowInput!) {
  followings(input: $input) {
    id
    userId
    username
    profile {
      short_bio
      thumbnail
      display_name
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

useGetFollowingsQuery.fetcher = (
  variables: GetFollowingsQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<GetFollowingsQuery, GetFollowingsQueryVariables>(
    GetFollowingsDocument,
    variables,
    options,
  )

export const NotificationDocument = `
    query notification($input: NotificationsInput!) {
  notifications(input: $input) {
    id
    type
    action
    actor_id
    action_id
    is_read
    created_at
  }
}
    `

export const useNotificationQuery = <TData = NotificationQuery, TError = unknown>(
  variables: NotificationQueryVariables,
  options?: Omit<UseQueryOptions<NotificationQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<NotificationQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<NotificationQuery, TError, TData>({
    queryKey: ['notification', variables],
    queryFn: fetcher<NotificationQuery, NotificationQueryVariables>(
      NotificationDocument,
      variables,
    ),
    ...options,
  })
}

useNotificationQuery.getKey = (variables: NotificationQueryVariables) => ['notification', variables]

export const useSuspenseNotificationQuery = <TData = NotificationQuery, TError = unknown>(
  variables: NotificationQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<NotificationQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<NotificationQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<NotificationQuery, TError, TData>({
    queryKey: ['notificationSuspense', variables],
    queryFn: fetcher<NotificationQuery, NotificationQueryVariables>(
      NotificationDocument,
      variables,
    ),
    ...options,
  })
}

useSuspenseNotificationQuery.getKey = (variables: NotificationQueryVariables) => [
  'notificationSuspense',
  variables,
]

useNotificationQuery.fetcher = (
  variables: NotificationQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<NotificationQuery, NotificationQueryVariables>(NotificationDocument, variables, options)

export const NotNoticeNotificationCountDocument = `
    query notNoticeNotificationCount {
  notNoticeNotificationCount
}
    `

export const useNotNoticeNotificationCountQuery = <
  TData = NotNoticeNotificationCountQuery,
  TError = unknown,
>(
  variables?: NotNoticeNotificationCountQueryVariables,
  options?: Omit<UseQueryOptions<NotNoticeNotificationCountQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<NotNoticeNotificationCountQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<NotNoticeNotificationCountQuery, TError, TData>({
    queryKey:
      variables === undefined
        ? ['notNoticeNotificationCount']
        : ['notNoticeNotificationCount', variables],
    queryFn: fetcher<NotNoticeNotificationCountQuery, NotNoticeNotificationCountQueryVariables>(
      NotNoticeNotificationCountDocument,
      variables,
    ),
    ...options,
  })
}

useNotNoticeNotificationCountQuery.getKey = (
  variables?: NotNoticeNotificationCountQueryVariables,
) =>
  variables === undefined
    ? ['notNoticeNotificationCount']
    : ['notNoticeNotificationCount', variables]

export const useSuspenseNotNoticeNotificationCountQuery = <
  TData = NotNoticeNotificationCountQuery,
  TError = unknown,
>(
  variables?: NotNoticeNotificationCountQueryVariables,
  options?: Omit<
    UseSuspenseQueryOptions<NotNoticeNotificationCountQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseSuspenseQueryOptions<NotNoticeNotificationCountQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<NotNoticeNotificationCountQuery, TError, TData>({
    queryKey:
      variables === undefined
        ? ['notNoticeNotificationCountSuspense']
        : ['notNoticeNotificationCountSuspense', variables],
    queryFn: fetcher<NotNoticeNotificationCountQuery, NotNoticeNotificationCountQueryVariables>(
      NotNoticeNotificationCountDocument,
      variables,
    ),
    ...options,
  })
}

useSuspenseNotNoticeNotificationCountQuery.getKey = (
  variables?: NotNoticeNotificationCountQueryVariables,
) =>
  variables === undefined
    ? ['notNoticeNotificationCountSuspense']
    : ['notNoticeNotificationCountSuspense', variables]

useNotNoticeNotificationCountQuery.fetcher = (
  variables?: NotNoticeNotificationCountQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<NotNoticeNotificationCountQuery, NotNoticeNotificationCountQueryVariables>(
    NotNoticeNotificationCountDocument,
    variables,
    options,
  )

export const ReadAllNotificationsDocument = `
    mutation readAllNotifications {
  readAllNotifications
}
    `

export const useReadAllNotificationsMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    ReadAllNotificationsMutation,
    TError,
    ReadAllNotificationsMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    ReadAllNotificationsMutation,
    TError,
    ReadAllNotificationsMutationVariables,
    TContext
  >({
    mutationKey: ['readAllNotifications'],
    mutationFn: (variables?: ReadAllNotificationsMutationVariables) =>
      fetcher<ReadAllNotificationsMutation, ReadAllNotificationsMutationVariables>(
        ReadAllNotificationsDocument,
        variables,
      )(),
    ...options,
  })
}

useReadAllNotificationsMutation.getKey = () => ['readAllNotifications']

useReadAllNotificationsMutation.fetcher = (
  variables?: ReadAllNotificationsMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<ReadAllNotificationsMutation, ReadAllNotificationsMutationVariables>(
    ReadAllNotificationsDocument,
    variables,
    options,
  )

export const RemoveAllNotificationsDocument = `
    mutation removeAllNotifications {
  removeAllNotifications
}
    `

export const useRemoveAllNotificationsMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    RemoveAllNotificationsMutation,
    TError,
    RemoveAllNotificationsMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    RemoveAllNotificationsMutation,
    TError,
    RemoveAllNotificationsMutationVariables,
    TContext
  >({
    mutationKey: ['removeAllNotifications'],
    mutationFn: (variables?: RemoveAllNotificationsMutationVariables) =>
      fetcher<RemoveAllNotificationsMutation, RemoveAllNotificationsMutationVariables>(
        RemoveAllNotificationsDocument,
        variables,
      )(),
    ...options,
  })
}

useRemoveAllNotificationsMutation.getKey = () => ['removeAllNotifications']

useRemoveAllNotificationsMutation.fetcher = (
  variables?: RemoveAllNotificationsMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<RemoveAllNotificationsMutation, RemoveAllNotificationsMutationVariables>(
    RemoveAllNotificationsDocument,
    variables,
    options,
  )

export const ReadNoticationDocument = `
    mutation readNotication($input: ReadNotificationInput!) {
  readNotification(input: $input)
}
    `

export const useReadNoticationMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    ReadNoticationMutation,
    TError,
    ReadNoticationMutationVariables,
    TContext
  >,
) => {
  return useMutation<ReadNoticationMutation, TError, ReadNoticationMutationVariables, TContext>({
    mutationKey: ['readNotication'],
    mutationFn: (variables?: ReadNoticationMutationVariables) =>
      fetcher<ReadNoticationMutation, ReadNoticationMutationVariables>(
        ReadNoticationDocument,
        variables,
      )(),
    ...options,
  })
}

useReadNoticationMutation.getKey = () => ['readNotication']

useReadNoticationMutation.fetcher = (
  variables: ReadNoticationMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<ReadNoticationMutation, ReadNoticationMutationVariables>(
    ReadNoticationDocument,
    variables,
    options,
  )

export const UpdateNotNoticeNotificationDocument = `
    mutation updateNotNoticeNotification {
  updateNotNoticeNotification
}
    `

export const useUpdateNotNoticeNotificationMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateNotNoticeNotificationMutation,
    TError,
    UpdateNotNoticeNotificationMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateNotNoticeNotificationMutation,
    TError,
    UpdateNotNoticeNotificationMutationVariables,
    TContext
  >({
    mutationKey: ['updateNotNoticeNotification'],
    mutationFn: (variables?: UpdateNotNoticeNotificationMutationVariables) =>
      fetcher<UpdateNotNoticeNotificationMutation, UpdateNotNoticeNotificationMutationVariables>(
        UpdateNotNoticeNotificationDocument,
        variables,
      )(),
    ...options,
  })
}

useUpdateNotNoticeNotificationMutation.getKey = () => ['updateNotNoticeNotification']

useUpdateNotNoticeNotificationMutation.fetcher = (
  variables?: UpdateNotNoticeNotificationMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<UpdateNotNoticeNotificationMutation, UpdateNotNoticeNotificationMutationVariables>(
    UpdateNotNoticeNotificationDocument,
    variables,
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

useReadPostQuery.fetcher = (variables: ReadPostQueryVariables, options?: RequestInit['headers']) =>
  fetcher<ReadPostQuery, ReadPostQueryVariables>(ReadPostDocument, variables, options)

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

useRecentPostsQuery.fetcher = (
  variables: RecentPostsQueryVariables,
  options?: RequestInit['headers'],
) => fetcher<RecentPostsQuery, RecentPostsQueryVariables>(RecentPostsDocument, variables, options)

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

useTrendingPostsQuery.fetcher = (
  variables: TrendingPostsQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<TrendingPostsQuery, TrendingPostsQueryVariables>(
    TrendingPostsDocument,
    variables,
    options,
  )

export const FeedPostsDocument = `
    query feedPosts($input: FeedPostsInput!) {
  feedPosts(input: $input) {
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

export const useFeedPostsQuery = <TData = FeedPostsQuery, TError = unknown>(
  variables: FeedPostsQueryVariables,
  options?: Omit<UseQueryOptions<FeedPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<FeedPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<FeedPostsQuery, TError, TData>({
    queryKey: ['feedPosts', variables],
    queryFn: fetcher<FeedPostsQuery, FeedPostsQueryVariables>(FeedPostsDocument, variables),
    ...options,
  })
}

useFeedPostsQuery.getKey = (variables: FeedPostsQueryVariables) => ['feedPosts', variables]

export const useSuspenseFeedPostsQuery = <TData = FeedPostsQuery, TError = unknown>(
  variables: FeedPostsQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<FeedPostsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<FeedPostsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<FeedPostsQuery, TError, TData>({
    queryKey: ['feedPostsSuspense', variables],
    queryFn: fetcher<FeedPostsQuery, FeedPostsQueryVariables>(FeedPostsDocument, variables),
    ...options,
  })
}

useSuspenseFeedPostsQuery.getKey = (variables: FeedPostsQueryVariables) => [
  'feedPostsSuspense',
  variables,
]

useFeedPostsQuery.fetcher = (
  variables: FeedPostsQueryVariables,
  options?: RequestInit['headers'],
) => fetcher<FeedPostsQuery, FeedPostsQueryVariables>(FeedPostsDocument, variables, options)

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

useVelogPostsQuery.fetcher = (
  variables: VelogPostsQueryVariables,
  options?: RequestInit['headers'],
) => fetcher<VelogPostsQuery, VelogPostsQueryVariables>(VelogPostsDocument, variables, options)

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

useSearchPostsQuery.fetcher = (
  variables: SearchPostsQueryVariables,
  options?: RequestInit['headers'],
) => fetcher<SearchPostsQuery, SearchPostsQueryVariables>(SearchPostsDocument, variables, options)

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

useUserTagsQuery.fetcher = (variables: UserTagsQueryVariables, options?: RequestInit['headers']) =>
  fetcher<UserTagsQuery, UserTagsQueryVariables>(UserTagsDocument, variables, options)

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

useGetUserQuery.fetcher = (variables: GetUserQueryVariables, options?: RequestInit['headers']) =>
  fetcher<GetUserQuery, GetUserQueryVariables>(GetUserDocument, variables, options)

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

useGetUserFollowInfoQuery.fetcher = (
  variables: GetUserFollowInfoQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<GetUserFollowInfoQuery, GetUserFollowInfoQueryVariables>(
    GetUserFollowInfoDocument,
    variables,
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
      short_bio
      profile_links
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

useCurrentUserQuery.fetcher = (
  variables?: CurrentUserQueryVariables,
  options?: RequestInit['headers'],
) => fetcher<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, variables, options)

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

useVelogConfigQuery.fetcher = (
  variables: VelogConfigQueryVariables,
  options?: RequestInit['headers'],
) => fetcher<VelogConfigQuery, VelogConfigQueryVariables>(VelogConfigDocument, variables, options)

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

useGetUserAboutQuery.fetcher = (
  variables: GetUserAboutQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<GetUserAboutQuery, GetUserAboutQueryVariables>(GetUserAboutDocument, variables, options)

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

useGetUserSeriesListQuery.fetcher = (
  variables: GetUserSeriesListQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<GetUserSeriesListQuery, GetUserSeriesListQueryVariables>(
    GetUserSeriesListDocument,
    variables,
    options,
  )

export const UnregisterTokenDocument = `
    query unregisterToken {
  unregisterToken
}
    `

export const useUnregisterTokenQuery = <TData = UnregisterTokenQuery, TError = unknown>(
  variables?: UnregisterTokenQueryVariables,
  options?: Omit<UseQueryOptions<UnregisterTokenQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<UnregisterTokenQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<UnregisterTokenQuery, TError, TData>({
    queryKey: variables === undefined ? ['unregisterToken'] : ['unregisterToken', variables],
    queryFn: fetcher<UnregisterTokenQuery, UnregisterTokenQueryVariables>(
      UnregisterTokenDocument,
      variables,
    ),
    ...options,
  })
}

useUnregisterTokenQuery.getKey = (variables?: UnregisterTokenQueryVariables) =>
  variables === undefined ? ['unregisterToken'] : ['unregisterToken', variables]

export const useSuspenseUnregisterTokenQuery = <TData = UnregisterTokenQuery, TError = unknown>(
  variables?: UnregisterTokenQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<UnregisterTokenQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<UnregisterTokenQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<UnregisterTokenQuery, TError, TData>({
    queryKey:
      variables === undefined
        ? ['unregisterTokenSuspense']
        : ['unregisterTokenSuspense', variables],
    queryFn: fetcher<UnregisterTokenQuery, UnregisterTokenQueryVariables>(
      UnregisterTokenDocument,
      variables,
    ),
    ...options,
  })
}

useSuspenseUnregisterTokenQuery.getKey = (variables?: UnregisterTokenQueryVariables) =>
  variables === undefined ? ['unregisterTokenSuspense'] : ['unregisterTokenSuspense', variables]

useUnregisterTokenQuery.fetcher = (
  variables?: UnregisterTokenQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<UnregisterTokenQuery, UnregisterTokenQueryVariables>(
    UnregisterTokenDocument,
    variables,
    options,
  )

export const CheckEmailExistsDocument = `
    query checkEmailExists($input: CheckEmailExistsInput!) {
  checkEmailExists(input: $input)
}
    `

export const useCheckEmailExistsQuery = <TData = CheckEmailExistsQuery, TError = unknown>(
  variables: CheckEmailExistsQueryVariables,
  options?: Omit<UseQueryOptions<CheckEmailExistsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<CheckEmailExistsQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<CheckEmailExistsQuery, TError, TData>({
    queryKey: ['checkEmailExists', variables],
    queryFn: fetcher<CheckEmailExistsQuery, CheckEmailExistsQueryVariables>(
      CheckEmailExistsDocument,
      variables,
    ),
    ...options,
  })
}

useCheckEmailExistsQuery.getKey = (variables: CheckEmailExistsQueryVariables) => [
  'checkEmailExists',
  variables,
]

export const useSuspenseCheckEmailExistsQuery = <TData = CheckEmailExistsQuery, TError = unknown>(
  variables: CheckEmailExistsQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<CheckEmailExistsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<CheckEmailExistsQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<CheckEmailExistsQuery, TError, TData>({
    queryKey: ['checkEmailExistsSuspense', variables],
    queryFn: fetcher<CheckEmailExistsQuery, CheckEmailExistsQueryVariables>(
      CheckEmailExistsDocument,
      variables,
    ),
    ...options,
  })
}

useSuspenseCheckEmailExistsQuery.getKey = (variables: CheckEmailExistsQueryVariables) => [
  'checkEmailExistsSuspense',
  variables,
]

useCheckEmailExistsQuery.fetcher = (
  variables: CheckEmailExistsQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<CheckEmailExistsQuery, CheckEmailExistsQueryVariables>(
    CheckEmailExistsDocument,
    variables,
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
) => {
  return useMutation<UpdateAboutMutation, TError, UpdateAboutMutationVariables, TContext>({
    mutationKey: ['updateAbout'],
    mutationFn: (variables?: UpdateAboutMutationVariables) =>
      fetcher<UpdateAboutMutation, UpdateAboutMutationVariables>(UpdateAboutDocument, variables)(),
    ...options,
  })
}

useUpdateAboutMutation.getKey = () => ['updateAbout']

useUpdateAboutMutation.fetcher = (
  variables: UpdateAboutMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<UpdateAboutMutation, UpdateAboutMutationVariables>(
    UpdateAboutDocument,
    variables,
    options,
  )

export const UpdateThumbnailDocument = `
    mutation updateThumbnail($input: UpdateThumbnailInput!) {
  updateThumbnail(input: $input) {
    id
    thumbnail
  }
}
    `

export const useUpdateThumbnailMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateThumbnailMutation,
    TError,
    UpdateThumbnailMutationVariables,
    TContext
  >,
) => {
  return useMutation<UpdateThumbnailMutation, TError, UpdateThumbnailMutationVariables, TContext>({
    mutationKey: ['updateThumbnail'],
    mutationFn: (variables?: UpdateThumbnailMutationVariables) =>
      fetcher<UpdateThumbnailMutation, UpdateThumbnailMutationVariables>(
        UpdateThumbnailDocument,
        variables,
      )(),
    ...options,
  })
}

useUpdateThumbnailMutation.getKey = () => ['updateThumbnail']

useUpdateThumbnailMutation.fetcher = (
  variables: UpdateThumbnailMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<UpdateThumbnailMutation, UpdateThumbnailMutationVariables>(
    UpdateThumbnailDocument,
    variables,
    options,
  )

export const UpdateProfileDocument = `
    mutation updateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    display_name
    short_bio
  }
}
    `

export const useUpdateProfileMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateProfileMutation,
    TError,
    UpdateProfileMutationVariables,
    TContext
  >,
) => {
  return useMutation<UpdateProfileMutation, TError, UpdateProfileMutationVariables, TContext>({
    mutationKey: ['updateProfile'],
    mutationFn: (variables?: UpdateProfileMutationVariables) =>
      fetcher<UpdateProfileMutation, UpdateProfileMutationVariables>(
        UpdateProfileDocument,
        variables,
      )(),
    ...options,
  })
}

useUpdateProfileMutation.getKey = () => ['updateProfile']

useUpdateProfileMutation.fetcher = (
  variables: UpdateProfileMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<UpdateProfileMutation, UpdateProfileMutationVariables>(
    UpdateProfileDocument,
    variables,
    options,
  )

export const UpdateVelogTitleDocument = `
    mutation updateVelogTitle($input: UpdateVelogTitleInput!) {
  updateVelogTitle(input: $input) {
    id
    title
  }
}
    `

export const useUpdateVelogTitleMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateVelogTitleMutation,
    TError,
    UpdateVelogTitleMutationVariables,
    TContext
  >,
) => {
  return useMutation<UpdateVelogTitleMutation, TError, UpdateVelogTitleMutationVariables, TContext>(
    {
      mutationKey: ['updateVelogTitle'],
      mutationFn: (variables?: UpdateVelogTitleMutationVariables) =>
        fetcher<UpdateVelogTitleMutation, UpdateVelogTitleMutationVariables>(
          UpdateVelogTitleDocument,
          variables,
        )(),
      ...options,
    },
  )
}

useUpdateVelogTitleMutation.getKey = () => ['updateVelogTitle']

useUpdateVelogTitleMutation.fetcher = (
  variables: UpdateVelogTitleMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<UpdateVelogTitleMutation, UpdateVelogTitleMutationVariables>(
    UpdateVelogTitleDocument,
    variables,
    options,
  )

export const UpdateSocialInfoDocument = `
    mutation updateSocialInfo($input: UpdateSocialInfoInput!) {
  updateSocialInfo(input: $input) {
    id
    profile_links
  }
}
    `

export const useUpdateSocialInfoMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateSocialInfoMutation,
    TError,
    UpdateSocialInfoMutationVariables,
    TContext
  >,
) => {
  return useMutation<UpdateSocialInfoMutation, TError, UpdateSocialInfoMutationVariables, TContext>(
    {
      mutationKey: ['updateSocialInfo'],
      mutationFn: (variables?: UpdateSocialInfoMutationVariables) =>
        fetcher<UpdateSocialInfoMutation, UpdateSocialInfoMutationVariables>(
          UpdateSocialInfoDocument,
          variables,
        )(),
      ...options,
    },
  )
}

useUpdateSocialInfoMutation.getKey = () => ['updateSocialInfo']

useUpdateSocialInfoMutation.fetcher = (
  variables: UpdateSocialInfoMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<UpdateSocialInfoMutation, UpdateSocialInfoMutationVariables>(
    UpdateSocialInfoDocument,
    variables,
    options,
  )

export const UpdateEmailRulesDocument = `
    mutation updateEmailRules($input: UpdateEmailRulesInput!) {
  updateEmailRules(input: $input) {
    email_notification
    email_promotion
  }
}
    `

export const useUpdateEmailRulesMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateEmailRulesMutation,
    TError,
    UpdateEmailRulesMutationVariables,
    TContext
  >,
) => {
  return useMutation<UpdateEmailRulesMutation, TError, UpdateEmailRulesMutationVariables, TContext>(
    {
      mutationKey: ['updateEmailRules'],
      mutationFn: (variables?: UpdateEmailRulesMutationVariables) =>
        fetcher<UpdateEmailRulesMutation, UpdateEmailRulesMutationVariables>(
          UpdateEmailRulesDocument,
          variables,
        )(),
      ...options,
    },
  )
}

useUpdateEmailRulesMutation.getKey = () => ['updateEmailRules']

useUpdateEmailRulesMutation.fetcher = (
  variables: UpdateEmailRulesMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<UpdateEmailRulesMutation, UpdateEmailRulesMutationVariables>(
    UpdateEmailRulesDocument,
    variables,
    options,
  )

export const UnregisterDocument = `
    mutation unregister($input: UnregisterInput!) {
  unregister(input: $input)
}
    `

export const useUnregisterMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<UnregisterMutation, TError, UnregisterMutationVariables, TContext>,
) => {
  return useMutation<UnregisterMutation, TError, UnregisterMutationVariables, TContext>({
    mutationKey: ['unregister'],
    mutationFn: (variables?: UnregisterMutationVariables) =>
      fetcher<UnregisterMutation, UnregisterMutationVariables>(UnregisterDocument, variables)(),
    ...options,
  })
}

useUnregisterMutation.getKey = () => ['unregister']

useUnregisterMutation.fetcher = (
  variables: UnregisterMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<UnregisterMutation, UnregisterMutationVariables>(UnregisterDocument, variables, options)

export const InitiateChangeEmailDocument = `
    mutation initiateChangeEmail($input: InitiateChangeEmailInput!) {
  initiateChangeEmail(input: $input)
}
    `

export const useInitiateChangeEmailMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    InitiateChangeEmailMutation,
    TError,
    InitiateChangeEmailMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    InitiateChangeEmailMutation,
    TError,
    InitiateChangeEmailMutationVariables,
    TContext
  >({
    mutationKey: ['initiateChangeEmail'],
    mutationFn: (variables?: InitiateChangeEmailMutationVariables) =>
      fetcher<InitiateChangeEmailMutation, InitiateChangeEmailMutationVariables>(
        InitiateChangeEmailDocument,
        variables,
      )(),
    ...options,
  })
}

useInitiateChangeEmailMutation.getKey = () => ['initiateChangeEmail']

useInitiateChangeEmailMutation.fetcher = (
  variables: InitiateChangeEmailMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<InitiateChangeEmailMutation, InitiateChangeEmailMutationVariables>(
    InitiateChangeEmailDocument,
    variables,
    options,
  )

export const ConfirmChangeEmailDocument = `
    mutation confirmChangeEmail($input: ConfirmChangeEmailInput!) {
  confirmChangeEmail(input: $input)
}
    `

export const useConfirmChangeEmailMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    ConfirmChangeEmailMutation,
    TError,
    ConfirmChangeEmailMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    ConfirmChangeEmailMutation,
    TError,
    ConfirmChangeEmailMutationVariables,
    TContext
  >({
    mutationKey: ['confirmChangeEmail'],
    mutationFn: (variables?: ConfirmChangeEmailMutationVariables) =>
      fetcher<ConfirmChangeEmailMutation, ConfirmChangeEmailMutationVariables>(
        ConfirmChangeEmailDocument,
        variables,
      )(),
    ...options,
  })
}

useConfirmChangeEmailMutation.getKey = () => ['confirmChangeEmail']

useConfirmChangeEmailMutation.fetcher = (
  variables: ConfirmChangeEmailMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<ConfirmChangeEmailMutation, ConfirmChangeEmailMutationVariables>(
    ConfirmChangeEmailDocument,
    variables,
    options,
  )

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

useLogoutMutation.fetcher = (
  variables?: LogoutMutationVariables,
  options?: RequestInit['headers'],
) => fetcher<LogoutMutation, LogoutMutationVariables>(LogoutDocument, variables, options)

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

useTrendingWritersQuery.fetcher = (
  variables: TrendingWritersQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<TrendingWritersQuery, TrendingWritersQueryVariables>(
    TrendingWritersDocument,
    variables,
    options,
  )
