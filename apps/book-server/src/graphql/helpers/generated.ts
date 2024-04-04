/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
import { GraphQLContext } from '../../common/interfaces/graphql.mjs'
import { Book as BookModel } from '@packages/database/velog-book-mongo'
export type Maybe<T> = T | null | undefined
export type InputMaybe<T> = T | undefined
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
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

export type BookInput = {
  bookId: Scalars['ID']['input']
}

export type Page = {
  body: Scalars['String']['output']
  book_id: Scalars['ID']['output']
  childrens: Array<Page>
  id: Scalars['ID']['output']
  parent_id?: Maybe<Scalars['ID']['output']>
  title: Scalars['String']['output']
}

export type Query = {
  book?: Maybe<Book>
}

export type QueryBookArgs = {
  input: BookInput
}

export type Writer = {
  email: Scalars['String']['output']
  fk_user_id: Scalars['String']['output']
  id: Scalars['ID']['output']
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
  BookInput: BookInput
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  Date: ResolverTypeWrapper<Scalars['Date']['output']>
  ID: ResolverTypeWrapper<Scalars['ID']['output']>
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>
  Page: ResolverTypeWrapper<Page>
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']['output']>
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']['output']>
  Void: ResolverTypeWrapper<Scalars['Void']['output']>
  Writer: ResolverTypeWrapper<Writer>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Book: Book
  BookInput: BookInput
  Boolean: Scalars['Boolean']['output']
  Date: Scalars['Date']['output']
  ID: Scalars['ID']['output']
  JSON: Scalars['JSON']['output']
  Page: Page
  PositiveInt: Scalars['PositiveInt']['output']
  Query: {}
  String: Scalars['String']['output']
  Void: Scalars['Void']['output']
  Writer: Writer
}

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

export type PageResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page'],
> = {
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  book_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  childrens?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  parent_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
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
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = GraphQLContext> = {
  Book?: BookResolvers<ContextType>
  Date?: GraphQLScalarType
  JSON?: GraphQLScalarType
  Page?: PageResolvers<ContextType>
  PositiveInt?: GraphQLScalarType
  Query?: QueryResolvers<ContextType>
  Void?: GraphQLScalarType
  Writer?: WriterResolvers<ContextType>
}
