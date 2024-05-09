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
  id: Scalars['ID']['output']
  is_published: Scalars['Boolean']['output']
  pages: Array<Page>
  thumbnail: Scalars['String']['output']
  writer_id: Scalars['String']['output']
}

export type BookIdInput = {
  book_id: Scalars['ID']['input']
}

export type GetPagesInput = {
  book_url_slug: Scalars['String']['input']
}

export type Mutation = {
  build?: Maybe<Scalars['Void']['output']>
  deploy?: Maybe<Scalars['Void']['output']>
}

export type MutationBuildArgs = {
  input: BookIdInput
}

export type MutationDeployArgs = {
  input: BookIdInput
}

export type Page = {
  body: Scalars['String']['output']
  book_id: Scalars['ID']['output']
  childrens: Array<Page>
  code: Scalars['String']['output']
  created_at: Scalars['Date']['output']
  id: Scalars['ID']['output']
  index: Scalars['Int']['output']
  level: Scalars['Int']['output']
  parent_id?: Maybe<Scalars['ID']['output']>
  title: Scalars['String']['output']
  type: Scalars['String']['output']
  updated_at: Scalars['Date']['output']
  url_slug: Scalars['String']['output']
  writer_id: Scalars['ID']['output']
}

export type PageType = 'page' | 'separator'

export type Query = {
  book?: Maybe<Book>
  pages: Array<Page>
}

export type QueryBookArgs = {
  input: BookIdInput
}

export type QueryPagesArgs = {
  input: GetPagesInput
}

export type SubScriptionPayload = {
  message: Scalars['String']['output']
}

export type Subscription = {
  bookBuildCompleted?: Maybe<SubScriptionPayload>
  bookBuildInstalled?: Maybe<SubScriptionPayload>
  bookDeployCompleted?: Maybe<SubScriptionPayload>
}

export type SubscriptionBookBuildCompletedArgs = {
  input: BookIdInput
}

export type SubscriptionBookBuildInstalledArgs = {
  input: BookIdInput
}

export type SubscriptionBookDeployCompletedArgs = {
  input: BookIdInput
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
  BookIDInput: BookIdInput
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  Date: ResolverTypeWrapper<Scalars['Date']['output']>
  GetPagesInput: GetPagesInput
  ID: ResolverTypeWrapper<Scalars['ID']['output']>
  Int: ResolverTypeWrapper<Scalars['Int']['output']>
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>
  Mutation: ResolverTypeWrapper<{}>
  Page: ResolverTypeWrapper<PageModel>
  PageType: PageType
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']['output']>
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']['output']>
  SubScriptionPayload: ResolverTypeWrapper<SubScriptionPayload>
  Subscription: ResolverTypeWrapper<{}>
  Void: ResolverTypeWrapper<Scalars['Void']['output']>
  Writer: ResolverTypeWrapper<WriterModel>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Book: BookModel
  BookIDInput: BookIdInput
  Boolean: Scalars['Boolean']['output']
  Date: Scalars['Date']['output']
  GetPagesInput: GetPagesInput
  ID: Scalars['ID']['output']
  Int: Scalars['Int']['output']
  JSON: Scalars['JSON']['output']
  Mutation: {}
  Page: PageModel
  PositiveInt: Scalars['PositiveInt']['output']
  Query: {}
  String: Scalars['String']['output']
  SubScriptionPayload: SubScriptionPayload
  Subscription: {}
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
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  is_published?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  pages?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType>
  thumbnail?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  writer_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export type MutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  build?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationBuildArgs, 'input'>
  >
  deploy?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeployArgs, 'input'>
  >
}

export type PageResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page'],
> = {
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  book_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  childrens?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType>
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  level?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  parent_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  updated_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  url_slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  writer_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
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
  bookBuildCompleted?: SubscriptionResolver<
    Maybe<ResolversTypes['SubScriptionPayload']>,
    'bookBuildCompleted',
    ParentType,
    ContextType,
    RequireFields<SubscriptionBookBuildCompletedArgs, 'input'>
  >
  bookBuildInstalled?: SubscriptionResolver<
    Maybe<ResolversTypes['SubScriptionPayload']>,
    'bookBuildInstalled',
    ParentType,
    ContextType,
    RequireFields<SubscriptionBookBuildInstalledArgs, 'input'>
  >
  bookDeployCompleted?: SubscriptionResolver<
    Maybe<ResolversTypes['SubScriptionPayload']>,
    'bookDeployCompleted',
    ParentType,
    ContextType,
    RequireFields<SubscriptionBookDeployCompletedArgs, 'input'>
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
  Date?: GraphQLScalarType
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
