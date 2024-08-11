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

export type BookUrlSlugInput = {
  book_url_slug: Scalars['String']['input']
}

export type BuildResult = {
  message: Maybe<Scalars['String']['output']>
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
  message: Maybe<Scalars['String']['output']>
  published_url: Maybe<Scalars['String']['output']>
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
  create: Maybe<Page>
  delete: Maybe<Scalars['Void']['output']>
  deploy: DeployResult
  reorder: Maybe<Scalars['Void']['output']>
  update: Maybe<Page>
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
  parent_id: Maybe<Scalars['ID']['output']>
  title: Scalars['String']['output']
  type: Scalars['String']['output']
  updated_at: Scalars['Date']['output']
  url_slug: Scalars['String']['output']
}

export type PageType = 'folder' | 'page' | 'separator'

export type Query = {
  book: Maybe<Book>
  isDeploy: Scalars['Boolean']['output']
  page: Maybe<Page>
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
  buildCompleted: Maybe<SubScriptionPayload>
  buildInstalled: Maybe<SubScriptionPayload>
  deployCompleted: Maybe<DeployCompletedPayload>
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
  short_bio: Maybe<Scalars['String']['output']>
  username: Scalars['String']['output']
}

export type DeployMutationVariables = Exact<{
  input: BookUrlSlugInput
}>

export type DeployMutation = { deploy: { published_url: string | null } }

export type BuildMutationVariables = Exact<{
  input: BookUrlSlugInput
}>

export type BuildMutation = { build: { result: boolean } }

export type IsDeployQueryVariables = Exact<{
  input: IsDeployInput
}>

export type IsDeployQuery = { isDeploy: boolean }

export type DeployCompletedSubscriptionVariables = Exact<{
  input: BookUrlSlugInput
}>

export type DeployCompletedSubscription = {
  deployCompleted: { message: string; published_url: string } | null
}

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

export type DeletePageMutationVariables = Exact<{
  input: DeletePageInput
}>

export type DeletePageMutation = { delete: void | null }

export const DeployDocument = `
    mutation deploy($input: BookUrlSlugInput!) {
  deploy(input: $input) {
    published_url
  }
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

export const BuildDocument = `
    mutation build($input: BookUrlSlugInput!) {
  build(input: $input) {
    result
  }
}
    `

export const useBuildMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<BuildMutation, TError, BuildMutationVariables, TContext>,
) => {
  return useMutation<BuildMutation, TError, BuildMutationVariables, TContext>({
    mutationKey: ['build'],
    mutationFn: (variables?: BuildMutationVariables) =>
      fetcher<BuildMutation, BuildMutationVariables>(BuildDocument, variables)(),
    ...options,
  })
}

useBuildMutation.getKey = () => ['build']

useBuildMutation.fetcher = (variables: BuildMutationVariables, options?: RequestInit['headers']) =>
  fetcher<BuildMutation, BuildMutationVariables>(BuildDocument, variables, options)

export const IsDeployDocument = `
    query isDeploy($input: IsDeployInput!) {
  isDeploy(input: $input)
}
    `

export const useIsDeployQuery = <TData = IsDeployQuery, TError = unknown>(
  variables: IsDeployQueryVariables,
  options?: Omit<UseQueryOptions<IsDeployQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<IsDeployQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<IsDeployQuery, TError, TData>({
    queryKey: ['isDeploy', variables],
    queryFn: fetcher<IsDeployQuery, IsDeployQueryVariables>(IsDeployDocument, variables),
    ...options,
  })
}

useIsDeployQuery.getKey = (variables: IsDeployQueryVariables) => ['isDeploy', variables]

export const useSuspenseIsDeployQuery = <TData = IsDeployQuery, TError = unknown>(
  variables: IsDeployQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<IsDeployQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<IsDeployQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<IsDeployQuery, TError, TData>({
    queryKey: ['isDeploySuspense', variables],
    queryFn: fetcher<IsDeployQuery, IsDeployQueryVariables>(IsDeployDocument, variables),
    ...options,
  })
}

useSuspenseIsDeployQuery.getKey = (variables: IsDeployQueryVariables) => [
  'isDeploySuspense',
  variables,
]

useIsDeployQuery.fetcher = (variables: IsDeployQueryVariables, options?: RequestInit['headers']) =>
  fetcher<IsDeployQuery, IsDeployQueryVariables>(IsDeployDocument, variables, options)

export const DeployCompletedDocument = `
    subscription deployCompleted($input: BookUrlSlugInput!) {
  deployCompleted(input: $input) {
    message
    published_url
  }
}
    `
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

export const DeletePageDocument = `
    mutation deletePage($input: DeletePageInput!) {
  delete(input: $input)
}
    `

export const useDeletePageMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<DeletePageMutation, TError, DeletePageMutationVariables, TContext>,
) => {
  return useMutation<DeletePageMutation, TError, DeletePageMutationVariables, TContext>({
    mutationKey: ['deletePage'],
    mutationFn: (variables?: DeletePageMutationVariables) =>
      fetcher<DeletePageMutation, DeletePageMutationVariables>(DeletePageDocument, variables)(),
    ...options,
  })
}

useDeletePageMutation.getKey = () => ['deletePage']

useDeletePageMutation.fetcher = (
  variables: DeletePageMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<DeletePageMutation, DeletePageMutationVariables>(DeletePageDocument, variables, options)
