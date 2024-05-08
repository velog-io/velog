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
  id: Scalars['ID']['output']
  is_published: Scalars['Boolean']['output']
  pages: Array<Page>
  thumbnail: Scalars['String']['output']
  writer_id: Scalars['String']['output']
}

export type BookIdInput = {
  book_id: Scalars['ID']['input']
}

export type GetPageMetadataInput = {
  book_url_slug: Scalars['String']['input']
}

export type Mutation = {
  build: Maybe<Scalars['Void']['output']>
  deploy: Maybe<Scalars['Void']['output']>
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
  parent_id: Maybe<Scalars['ID']['output']>
  title: Scalars['String']['output']
  type: PageType
  url_slug: Scalars['String']['output']
  writer_id: Scalars['ID']['output']
}

export type PageMetadata = {
  childrens: Array<PageMetadata>
  code: Scalars['String']['output']
  id: Scalars['ID']['output']
  level: Scalars['Int']['output']
  parent_id: Maybe<Scalars['String']['output']>
  title: Scalars['String']['output']
  type: Scalars['String']['output']
  url_slug: Scalars['String']['output']
}

export type PageType = 'page' | 'separator'

export type Query = {
  book: Maybe<Book>
  getPageMetadata: Array<PageMetadata>
}

export type QueryBookArgs = {
  input: BookIdInput
}

export type QueryGetPageMetadataArgs = {
  input: GetPageMetadataInput
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

export type GetPageMetadataQueryVariables = Exact<{
  input: GetPageMetadataInput
}>

export type GetPageMetadataQuery = {
  getPageMetadata: Array<{
    title: string
    url_slug: string
    type: string
    childrens: Array<{
      title: string
      url_slug: string
      type: string
      childrens: Array<{ title: string; url_slug: string; type: string }>
    }>
  }>
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

export const GetPageMetadataDocument = `
    query getPageMetadata($input: GetPageMetadataInput!) {
  getPageMetadata(input: $input) {
    title
    url_slug
    type
    childrens {
      title
      url_slug
      type
      childrens {
        title
        url_slug
        type
      }
    }
  }
}
    `

export const useGetPageMetadataQuery = <TData = GetPageMetadataQuery, TError = unknown>(
  variables: GetPageMetadataQueryVariables,
  options?: Omit<UseQueryOptions<GetPageMetadataQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetPageMetadataQuery, TError, TData>['queryKey']
  },
) => {
  return useQuery<GetPageMetadataQuery, TError, TData>({
    queryKey: ['getPageMetadata', variables],
    queryFn: fetcher<GetPageMetadataQuery, GetPageMetadataQueryVariables>(
      GetPageMetadataDocument,
      variables,
    ),
    ...options,
  })
}

useGetPageMetadataQuery.getKey = (variables: GetPageMetadataQueryVariables) => [
  'getPageMetadata',
  variables,
]

export const useSuspenseGetPageMetadataQuery = <TData = GetPageMetadataQuery, TError = unknown>(
  variables: GetPageMetadataQueryVariables,
  options?: Omit<UseSuspenseQueryOptions<GetPageMetadataQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseSuspenseQueryOptions<GetPageMetadataQuery, TError, TData>['queryKey']
  },
) => {
  return useSuspenseQuery<GetPageMetadataQuery, TError, TData>({
    queryKey: ['getPageMetadataSuspense', variables],
    queryFn: fetcher<GetPageMetadataQuery, GetPageMetadataQueryVariables>(
      GetPageMetadataDocument,
      variables,
    ),
    ...options,
  })
}

useSuspenseGetPageMetadataQuery.getKey = (variables: GetPageMetadataQueryVariables) => [
  'getPageMetadataSuspense',
  variables,
]

useGetPageMetadataQuery.fetcher = (
  variables: GetPageMetadataQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<GetPageMetadataQuery, GetPageMetadataQueryVariables>(
    GetPageMetadataDocument,
    variables,
    options,
  )
