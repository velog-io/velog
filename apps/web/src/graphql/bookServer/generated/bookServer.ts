import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { bookServerFetcher } from '../helpers/bookServerFetcher'
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

export type Book = {
  id: Scalars['ID']['output']
  is_published: Scalars['Boolean']['output']
  pages: Array<Page>
  thumbnail: Scalars['String']['output']
  writer_id: Scalars['String']['output']
}

export type BookInput = {
  book_id: Scalars['ID']['input']
}

export type DeployInput = {
  book_id: Scalars['ID']['input']
}

export type Mutation = {
  deploy: Maybe<Scalars['Void']['output']>
}

export type MutationDeployArgs = {
  input: DeployInput
}

export type Page = {
  body: Scalars['String']['output']
  book_id: Scalars['ID']['output']
  childrens: Array<Page>
  id: Scalars['ID']['output']
  parent_id: Maybe<Scalars['ID']['output']>
  title: Scalars['String']['output']
}

export type Query = {
  book: Maybe<Book>
}

export type QueryBookArgs = {
  input: BookInput
}

export type Subscription = {
  bookDeploy: Maybe<Scalars['Void']['output']>
}

export type SubscriptionBookDeployArgs = {
  input: DeployInput
}

export type Writer = {
  email: Scalars['String']['output']
  fk_user_id: Scalars['String']['output']
  id: Scalars['ID']['output']
  username: Scalars['String']['output']
}

export type DeployMutationVariables = Exact<{
  input: DeployInput
}>

export type DeployMutation = { deploy: void | null }

export const DeployDocument = `
    mutation deploy($input: DeployInput!) {
  deploy(input: $input)
}
    `

export const useDeployMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<DeployMutation, TError, DeployMutationVariables, TContext>,
) => {
  return useMutation<DeployMutation, TError, DeployMutationVariables, TContext>({
    mutationKey: ['deploy'],
    mutationFn: (variables?: DeployMutationVariables) =>
      bookServerFetcher<DeployMutation, DeployMutationVariables>(DeployDocument, variables)(),
    ...options,
  })
}

useDeployMutation.getKey = () => ['deploy']

useDeployMutation.fetcher = (
  variables: DeployMutationVariables,
  options?: RequestInit['headers'],
) => bookServerFetcher<DeployMutation, DeployMutationVariables>(DeployDocument, variables, options)
