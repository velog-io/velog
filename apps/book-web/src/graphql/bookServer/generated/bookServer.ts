import {
  useMutation,
  useQuery,
  useSuspenseQuery,
  UseMutationOptions,
  UseQueryOptions,
  UseSuspenseQueryOptions,
} from '@tanstack/react-query'
import { fetcher } from '../helpers/bookServerFetcher'
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

export type CreatePageInput = {
  book_url_slug: Scalars['String']['input']
  index: Scalars['Int']['input']
  parent_url_slug: Scalars['String']['input']
  title: Scalars['String']['input']
  type: PageType
}

export type GetPageInput = {
  book_url_slug: Scalars['String']['input']
  page_url_slug: Scalars['String']['input']
}

export type GetPagesInput = {
  book_url_slug: Scalars['String']['input']
}

export type Mutation = {
  build: Maybe<Scalars['Void']['output']>
  create: Maybe<Page>
  deploy: Maybe<Scalars['Void']['output']>
  reorder: Maybe<Scalars['Void']['output']>
  update: Maybe<Page>
}

export type MutationBuildArgs = {
  input: BookIdInput
}

export type MutationCreateArgs = {
  input: CreatePageInput
}

export type MutationDeployArgs = {
  input: BookIdInput
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
  parent_id: Maybe<Scalars['ID']['output']>
  title: Scalars['String']['output']
  type: Scalars['String']['output']
  updated_at: Scalars['Date']['output']
  url_slug: Scalars['String']['output']
}

export type PageType = 'folder' | 'page' | 'separator'

export type Query = {
  book: Maybe<Book>
  page: Maybe<Page>
  pages: Array<Page>
}

export type QueryBookArgs = {
  input: BookIdInput
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
  bookBuildCompleted: Maybe<SubScriptionPayload>
  bookBuildInstalled: Maybe<SubScriptionPayload>
  bookDeployCompleted: Maybe<SubScriptionPayload>
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
  short_bio: Maybe<Scalars['String']['output']>
  username: Scalars['String']['output']
}

export type DeployMutationVariables = Exact<{
  input: BookIdInput
}>

export type DeployMutation = { deploy: void | null }

export type GetPagesQueryVariables = Exact<{
  input: GetPagesInput
}>

export type GetPagesQuery = {
  pages: Array<{
    id: string
    title: string
    url_slug: string
    type: string
    parent_id: string | null
    code: string
    childrens: Array<{
      id: string
      title: string
      url_slug: string
      type: string
      parent_id: string | null
      code: string
      childrens: Array<{
        id: string
        title: string
        url_slug: string
        type: string
        parent_id: string | null
        code: string
      }>
    }>
  }>
}

export type GetPageQueryVariables = Exact<{
  input: GetPageInput
}>

export type GetPageQuery = {
  page: {
    id: string
    title: string
    url_slug: string
    parent_id: string | null
    body: string
  } | null
}

export type CreatePageMutationVariables = Exact<{
  input: CreatePageInput
}>

export type CreatePageMutation = { create: { id: string } | null }

export type ReorderPageMutationVariables = Exact<{
  input: ReorderInput
}>

export type ReorderPageMutation = { reorder: void | null }

export type UpdatePageMutationVariables = Exact<{
  input: UpdatePageInput
}>

export type UpdatePageMutation = {
  update: { id: string; title: string; body: string; is_deleted: boolean } | null
}

export const DeployDocument = `
    mutation deploy($input: BookIDInput!) {
  deploy(input: $input)
}
    `

export const useDeployMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<DeployMutation, TError, DeployMutationVariables, TContext>,
) => {
  return useMutation<DeployMutation, TError, DeployMutationVariables, TContext>({
    mutationKey: ['deploy'],
    mutationFn: (variables?: DeployMutationVariables) =>
      fetcher<DeployMutation, DeployMutationVariables>(DeployDocument, variables)(),
    ...options,
  })
}

useDeployMutation.getKey = () => ['deploy']

useDeployMutation.fetcher = (
  variables: DeployMutationVariables,
  options?: RequestInit['headers'],
) => fetcher<DeployMutation, DeployMutationVariables>(DeployDocument, variables, options)

export const GetPagesDocument = `
    query getPages($input: GetPagesInput!) {
  pages(input: $input) {
    id
    title
    url_slug
    type
    parent_id
    code
    childrens {
      id
      title
      url_slug
      type
      parent_id
      code
      childrens {
        id
        title
        url_slug
        type
        parent_id
        code
      }
    }
  }
}
    `

export const useGetPagesQuery = <TData = GetPagesQuery, TError = unknown>(
  variables: GetPagesQueryVariables,
  options?: Omit<UseQueryOptions<GetPagesQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetPagesQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<GetPagesQuery, TError, TData>({
    queryKey: ['getPages', variables],
    queryFn: fetcher<GetPagesQuery, GetPagesQueryVariables>(GetPagesDocument, variables),
    ...options,
  })
}

useGetPagesQuery.getKey = (variables: GetPagesQueryVariables) => ['getPages', variables]

export const useSuspenseGetPagesQuery = <TData = GetPagesQuery, TError = unknown>(
  variables: GetPagesQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<GetPagesQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<GetPagesQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<GetPagesQuery, TError, TData>({
    queryKey: ['getPagesSuspense', variables],
    queryFn: fetcher<GetPagesQuery, GetPagesQueryVariables>(GetPagesDocument, variables),
    ...options,
  })
}

useSuspenseGetPagesQuery.getKey = (variables: GetPagesQueryVariables) => [
  'getPagesSuspense',
  variables,
]

useGetPagesQuery.fetcher = (variables: GetPagesQueryVariables, options?: RequestInit['headers']) =>
  fetcher<GetPagesQuery, GetPagesQueryVariables>(GetPagesDocument, variables, options)

export const GetPageDocument = `
    query getPage($input: GetPageInput!) {
  page(input: $input) {
    id
    title
    url_slug
    parent_id
    body
  }
}
    `

export const useGetPageQuery = <TData = GetPageQuery, TError = unknown>(
  variables: GetPageQueryVariables,
  options?: Omit<UseQueryOptions<GetPageQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetPageQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<GetPageQuery, TError, TData>({
    queryKey: ['getPage', variables],
    queryFn: fetcher<GetPageQuery, GetPageQueryVariables>(GetPageDocument, variables),
    ...options,
  })
}

useGetPageQuery.getKey = (variables: GetPageQueryVariables) => ['getPage', variables]

export const useSuspenseGetPageQuery = <TData = GetPageQuery, TError = unknown>(
  variables: GetPageQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<GetPageQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<GetPageQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<GetPageQuery, TError, TData>({
    queryKey: ['getPageSuspense', variables],
    queryFn: fetcher<GetPageQuery, GetPageQueryVariables>(GetPageDocument, variables),
    ...options,
  })
}

useSuspenseGetPageQuery.getKey = (variables: GetPageQueryVariables) => [
  'getPageSuspense',
  variables,
]

useGetPageQuery.fetcher = (variables: GetPageQueryVariables, options?: RequestInit['headers']) =>
  fetcher<GetPageQuery, GetPageQueryVariables>(GetPageDocument, variables, options)

export const CreatePageDocument = `
    mutation createPage($input: CreatePageInput!) {
  create(input: $input) {
    id
  }
}
    `

export const useCreatePageMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<CreatePageMutation, TError, CreatePageMutationVariables, TContext>,
) => {
  return useMutation<CreatePageMutation, TError, CreatePageMutationVariables, TContext>({
    mutationKey: ['createPage'],
    mutationFn: (variables?: CreatePageMutationVariables) =>
      fetcher<CreatePageMutation, CreatePageMutationVariables>(CreatePageDocument, variables)(),
    ...options,
  })
}

useCreatePageMutation.getKey = () => ['createPage']

useCreatePageMutation.fetcher = (
  variables: CreatePageMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<CreatePageMutation, CreatePageMutationVariables>(CreatePageDocument, variables, options)

export const ReorderPageDocument = `
    mutation reorderPage($input: ReorderInput!) {
  reorder(input: $input)
}
    `

export const useReorderPageMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<ReorderPageMutation, TError, ReorderPageMutationVariables, TContext>,
) => {
  return useMutation<ReorderPageMutation, TError, ReorderPageMutationVariables, TContext>({
    mutationKey: ['reorderPage'],
    mutationFn: (variables?: ReorderPageMutationVariables) =>
      fetcher<ReorderPageMutation, ReorderPageMutationVariables>(ReorderPageDocument, variables)(),
    ...options,
  })
}

useReorderPageMutation.getKey = () => ['reorderPage']

useReorderPageMutation.fetcher = (
  variables: ReorderPageMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<ReorderPageMutation, ReorderPageMutationVariables>(
    ReorderPageDocument,
    variables,
    options,
  )

export const UpdatePageDocument = `
    mutation updatePage($input: UpdatePageInput!) {
  update(input: $input) {
    id
    title
    body
    is_deleted
  }
}
    `

export const useUpdatePageMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<UpdatePageMutation, TError, UpdatePageMutationVariables, TContext>,
) => {
  return useMutation<UpdatePageMutation, TError, UpdatePageMutationVariables, TContext>({
    mutationKey: ['updatePage'],
    mutationFn: (variables?: UpdatePageMutationVariables) =>
      fetcher<UpdatePageMutation, UpdatePageMutationVariables>(UpdatePageDocument, variables)(),
    ...options,
  })
}

useUpdatePageMutation.getKey = () => ['updatePage']

useUpdatePageMutation.fetcher = (
  variables: UpdatePageMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<UpdatePageMutation, UpdatePageMutationVariables>(UpdatePageDocument, variables, options)
