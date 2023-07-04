import { getSdk, graphQLClient } from '@/graphql/generated'
import { sdk } from '@/lib/sdk'
import { CurrentUser } from '@/types/user'
import { cookies } from 'next/headers'

export default async function getCurrentUser(): Promise<
  CurrentUser | undefined
> {
  const accessToken = cookies().get('access_token')?.value
  const refreshToken = cookies().get('refresh_token')?.value

  if (!accessToken && !refreshToken) return undefined

  if (accessToken) {
    graphQLClient.setHeader('authorization', `Bearer ${accessToken}`)
  }

  if (refreshToken) {
    graphQLClient.setHeader('Cookie', `refresh_token=${refreshToken}`)
  }

  const { currentUser } = await sdk.currentUser()
  return currentUser
}
