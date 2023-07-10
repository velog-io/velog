import { CurrentUserDocument } from '@/graphql/generated'
import postData from '@/lib/postData'
import { CurrentUser } from '@/types/user'
import { cookies } from 'next/headers'

export default async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const accessToken = cookies().get('access_token')?.value
    const refreshToken = cookies().get('refresh_token')?.value

    if (!accessToken && !refreshToken) return null

    const headers = {}
    if (accessToken) {
      Object.assign(headers, { authorization: `Bearer ${accessToken}` })
    }

    if (refreshToken) {
      Object.assign(headers, { Cookie: `refresh_token=${refreshToken}` })
    }

    const body = {
      operationName: 'currentUser',
      query: CurrentUserDocument.loc?.source.body,
    }

    const {
      data: { currentUser },
    } = await postData({
      body,
      headers,
    })

    return currentUser
  } catch (error) {
    console.log('getCurrent User error', error)
    return null
  }
}
