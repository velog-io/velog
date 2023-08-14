import { SocialAccount } from '@prisma/client'

export type SocialProvider = 'google' | 'facebook' | 'github'
export type GetSocialAccountParams = {
  uid: number | string
  provider: SocialProvider
}

export type GetProfileFromSocial = {
  uid: number | string
  thumbnail: string | null
  email: string | null
  name: string | null
  username?: string
}

export type SocialProfile = {
  profile: GetProfileFromSocial
  socialAccount: SocialAccount | null
  accessToken: string
  provider: SocialProvider
}

export type GetAccessTokenParams = {
  code: string
  clientId: string
  clientSecret: string
  redirectUri?: string
}

export type FacebookTokenResult = {
  access_token: string
  token_type: string
  expires_in: string
}

export type FacebookProfile = {
  id: string
  name: string
  email: string | null
  picture: {
    data: {
      height: number
      is_silhouette: boolean
      url: string
      width: number
    }
  }
}

export type GithubOAuthResult = {
  access_token: string
  token_type: string
  scope: string
}
