import { getSdk, graphQLClient } from '@/graphql/generated'
import { cookies } from 'next/headers'

export default async function loadUesr() {
  const accessToken = cookies().get('access_token')?.value
  const refreshToken = cookies().get('refresh_token')?.value

  if (!accessToken && !refreshToken) return null

  if (accessToken) {
    graphQLClient.setHeader('authorization', `Bearer ${accessToken}`)
  }

  if (refreshToken) {
    graphQLClient.setHeader('Cookie', `refresh_token=${refreshToken}`)
  }

  const sdk = getSdk(graphQLClient)
  const { currentUser } = await sdk.currentUser()
  return currentUser
}
