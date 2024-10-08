/* eslint-disable @typescript-eslint/ban-types */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
import {
  Book as BookModel,
  Writer as WriterModel,
  Page as PageModel,
} from '@packages/database/velog-book-mongo'
import { GraphQLContext } from '../common/interfaces/graphql.mjs'
export type Maybe<T> = T | null
export type InputMaybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }
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

export type Book = {
  fk_writer_id: Scalars['String']['output']
  id: Scalars['ID']['output']
  is_published: Scalars['Boolean']['output']
  pages: Array<Page>
  thumbnail: Scalars['String']['output']
}

export type BookIdInput = {
  book_id: Scalars['ID']['input']
}

export type BookUrlSlugInput = {
  book_url_slug: Scalars['String']['input']
}

export type BuildResult = {
  message?: Maybe<Scalars['String']['output']>
  result: Scalars['Boolean']['output']
}

export type CreatePageInput = {
  book_url_slug: Scalars['String']['input']
  index: Scalars['Int']['input']
  parent_url_slug: Scalars['String']['input']
  title: Scalars['String']['input']
  type: PageType
}

export type DeletePageInput = {
  book_url_slug: Scalars['String']['input']
  page_url_slug: Scalars['String']['input']
}

export type DeployCompletedPayload = {
  message: Scalars['String']['output']
  published_url: Scalars['String']['output']
}

export type DeployResult = {
  message?: Maybe<Scalars['String']['output']>
  published_url?: Maybe<Scalars['String']['output']>
}

export type GetPageInput = {
  book_url_slug: Scalars['String']['input']
  page_url_slug: Scalars['String']['input']
}

export type GetPagesInput = {
  book_url_slug: Scalars['String']['input']
}

export type IsDeployInput = {
  book_url_slug: Scalars['String']['input']
}

export type Mutation = {
  build: BuildResult
  create?: Maybe<Page>
  delete?: Maybe<Scalars['Void']['output']>
  deploy: DeployResult
  reorder?: Maybe<Scalars['Void']['output']>
  update?: Maybe<Page>
}

export type MutationBuildArgs = {
  input: BookUrlSlugInput
}

export type MutationCreateArgs = {
  input: CreatePageInput
}

export type MutationDeleteArgs = {
  input: DeletePageInput
}

export type MutationDeployArgs = {
  input: BookUrlSlugInput
}

export type MutationReorderArgs = {
  input: ReorderInput
}

export type MutationUpdateArgs = {
  input: UpdatePageInput
}

export type Page = {
  body: Scalars['String']['output']
  childrens: Array<Page>
  code: Scalars['String']['output']
  created_at: Scalars['Date']['output']
  depth: Scalars['Int']['output']
  fk_book_id: Scalars['ID']['output']
  fk_writer_id: Scalars['ID']['output']
  id: Scalars['ID']['output']
  index: Scalars['Int']['output']
  is_deleted: Scalars['Boolean']['output']
  parent_id?: Maybe<Scalars['ID']['output']>
  title: Scalars['String']['output']
  type: Scalars['String']['output']
  updated_at: Scalars['Date']['output']
  url_slug: Scalars['String']['output']
}

export type PageType = 'folder' | 'page' | 'separator'

export type Query = {
  book?: Maybe<Book>
  isDeploy: Scalars['Boolean']['output']
  page?: Maybe<Page>
  pages: Array<Page>
}

export type QueryBookArgs = {
  input: BookIdInput
}

export type QueryIsDeployArgs = {
  input: IsDeployInput
}

export type QueryPageArgs = {
  input: GetPageInput
}

export type QueryPagesArgs = {
  input: GetPagesInput
}

export type ReorderInput = {
  book_url_slug: Scalars['String']['input']
  index: Scalars['Int']['input']
  parent_url_slug?: InputMaybe<Scalars['String']['input']>
  target_url_slug: Scalars['String']['input']
}

export type SubScriptionPayload = {
  message: Scalars['String']['output']
}

export type Subscription = {
  buildCompleted?: Maybe<SubScriptionPayload>
  buildInstalled?: Maybe<SubScriptionPayload>
  deployCompleted?: Maybe<DeployCompletedPayload>
}

export type SubscriptionBuildCompletedArgs = {
  input: BookUrlSlugInput
}

export type SubscriptionBuildInstalledArgs = {
  input: BookUrlSlugInput
}

export type SubscriptionDeployCompletedArgs = {
  input: BookUrlSlugInput
}

export type UpdatePageInput = {
  body?: InputMaybe<Scalars['String']['input']>
  book_url_slug: Scalars['String']['input']
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>
  page_url_slug: Scalars['String']['input']
  title?: InputMaybe<Scalars['String']['input']>
}

export type Writer = {
  email: Scalars['String']['output']
  fk_user_id: Scalars['String']['output']
  id: Scalars['ID']['output']
  short_bio?: Maybe<Scalars['String']['output']>
  username: Scalars['String']['output']
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
  Book: ResolverTypeWrapper<BookModel>
  BookIdInput: BookIdInput
  BookUrlSlugInput: BookUrlSlugInput
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  BuildResult: ResolverTypeWrapper<BuildResult>
  CreatePageInput: CreatePageInput
  Date: ResolverTypeWrapper<Scalars['Date']['output']>
  DeletePageInput: DeletePageInput
  DeployCompletedPayload: ResolverTypeWrapper<DeployCompletedPayload>
  DeployResult: ResolverTypeWrapper<DeployResult>
  GetPageInput: GetPageInput
  GetPagesInput: GetPagesInput
  ID: ResolverTypeWrapper<Scalars['ID']['output']>
  Int: ResolverTypeWrapper<Scalars['Int']['output']>
  IsDeployInput: IsDeployInput
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>
  Mutation: ResolverTypeWrapper<{}>
  Page: ResolverTypeWrapper<PageModel>
  PageType: PageType
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']['output']>
  Query: ResolverTypeWrapper<{}>
  ReorderInput: ReorderInput
  String: ResolverTypeWrapper<Scalars['String']['output']>
  SubScriptionPayload: ResolverTypeWrapper<SubScriptionPayload>
  Subscription: ResolverTypeWrapper<{}>
  UpdatePageInput: UpdatePageInput
  Void: ResolverTypeWrapper<Scalars['Void']['output']>
  Writer: ResolverTypeWrapper<WriterModel>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Book: BookModel
  BookIdInput: BookIdInput
  BookUrlSlugInput: BookUrlSlugInput
  Boolean: Scalars['Boolean']['output']
  BuildResult: BuildResult
  CreatePageInput: CreatePageInput
  Date: Scalars['Date']['output']
  DeletePageInput: DeletePageInput
  DeployCompletedPayload: DeployCompletedPayload
  DeployResult: DeployResult
  GetPageInput: GetPageInput
  GetPagesInput: GetPagesInput
  ID: Scalars['ID']['output']
  Int: Scalars['Int']['output']
  IsDeployInput: IsDeployInput
  JSON: Scalars['JSON']['output']
  Mutation: {}
  Page: PageModel
  PositiveInt: Scalars['PositiveInt']['output']
  Query: {}
  ReorderInput: ReorderInput
  String: Scalars['String']['output']
  SubScriptionPayload: SubScriptionPayload
  Subscription: {}
  UpdatePageInput: UpdatePageInput
  Void: Scalars['Void']['output']
  Writer: WriterModel
}

export type AuthDirectiveArgs = {}

export type AuthDirectiveResolver<
  Result,
  Parent,
  ContextType = GraphQLContext,
  Args = AuthDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type BookResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book'],
> = {
  fk_writer_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  is_published?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  pages?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType>
  thumbnail?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type BuildResultResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['BuildResult'] = ResolversParentTypes['BuildResult'],
> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type DeployCompletedPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['DeployCompletedPayload'] = ResolversParentTypes['DeployCompletedPayload'],
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  published_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type DeployResultResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['DeployResult'] = ResolversParentTypes['DeployResult'],
> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  published_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export type MutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  build?: Resolver<
    ResolversTypes['BuildResult'],
    ParentType,
    ContextType,
    RequireFields<MutationBuildArgs, 'input'>
  >
  create?: Resolver<
    Maybe<ResolversTypes['Page']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateArgs, 'input'>
  >
  delete?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteArgs, 'input'>
  >
  deploy?: Resolver<
    ResolversTypes['DeployResult'],
    ParentType,
    ContextType,
    RequireFields<MutationDeployArgs, 'input'>
  >
  reorder?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationReorderArgs, 'input'>
  >
  update?: Resolver<
    Maybe<ResolversTypes['Page']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateArgs, 'input'>
  >
}

export type PageResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page'],
> = {
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  childrens?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType>
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  depth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  fk_book_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  fk_writer_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  is_deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  parent_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  updated_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  url_slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface PositiveIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt'
}

export type QueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  book?: Resolver<
    Maybe<ResolversTypes['Book']>,
    ParentType,
    ContextType,
    RequireFields<QueryBookArgs, 'input'>
  >
  isDeploy?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<QueryIsDeployArgs, 'input'>
  >
  page?: Resolver<
    Maybe<ResolversTypes['Page']>,
    ParentType,
    ContextType,
    RequireFields<QueryPageArgs, 'input'>
  >
  pages?: Resolver<
    Array<ResolversTypes['Page']>,
    ParentType,
    ContextType,
    RequireFields<QueryPagesArgs, 'input'>
  >
}

export type SubScriptionPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['SubScriptionPayload'] = ResolversParentTypes['SubScriptionPayload'],
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription'],
> = {
  buildCompleted?: SubscriptionResolver<
    Maybe<ResolversTypes['SubScriptionPayload']>,
    'buildCompleted',
    ParentType,
    ContextType,
    RequireFields<SubscriptionBuildCompletedArgs, 'input'>
  >
  buildInstalled?: SubscriptionResolver<
    Maybe<ResolversTypes['SubScriptionPayload']>,
    'buildInstalled',
    ParentType,
    ContextType,
    RequireFields<SubscriptionBuildInstalledArgs, 'input'>
  >
  deployCompleted?: SubscriptionResolver<
    Maybe<ResolversTypes['DeployCompletedPayload']>,
    'deployCompleted',
    ParentType,
    ContextType,
    RequireFields<SubscriptionDeployCompletedArgs, 'input'>
  >
}

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void'
}

export type WriterResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Writer'] = ResolversParentTypes['Writer'],
> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  fk_user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  short_bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = GraphQLContext> = {
  Book?: BookResolvers<ContextType>
  BuildResult?: BuildResultResolvers<ContextType>
  Date?: GraphQLScalarType
  DeployCompletedPayload?: DeployCompletedPayloadResolvers<ContextType>
  DeployResult?: DeployResultResolvers<ContextType>
  JSON?: GraphQLScalarType
  Mutation?: MutationResolvers<ContextType>
  Page?: PageResolvers<ContextType>
  PositiveInt?: GraphQLScalarType
  Query?: QueryResolvers<ContextType>
  SubScriptionPayload?: SubScriptionPayloadResolvers<ContextType>
  Subscription?: SubscriptionResolvers<ContextType>
  Void?: GraphQLScalarType
  Writer?: WriterResolvers<ContextType>
}

export type DirectiveResolvers<ContextType = GraphQLContext> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>
}
