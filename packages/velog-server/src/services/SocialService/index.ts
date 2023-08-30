import { ENV } from '@env'
import { DbService } from '@lib/db/DbService.js'
import { injectable, singleton } from 'tsyringe'
import { google } from 'googleapis'
import qs from 'qs'
import axios from 'axios'
import { Octokit } from '@octokit/rest'
import { SocialAccount } from '@prisma/client'
import {
  FacebookProfile,
  FacebookTokenResult,
  GetAccessTokenParams,
  GetProfileFromSocial,
  GetSocialAccountParams,
  GithubOAuthResult,
  SocialProfile,
} from '@services/SocialService/SocialServiceInterface.js'

interface Service {
  getSocialAccount({ uid, provider }: GetSocialAccountParams): Promise<SocialAccount | null>
  getSocialDataFromGoogle(code: string): Promise<SocialProfile>
  getSocialDataFromFacebook(code: string): Promise<SocialProfile>
  getSocialDataFromGithub(code: string): Promise<SocialProfile>
}

@injectable()
@singleton()
export class SocialService implements Service {
  constructor(private readonly db: DbService) {}
  private get redirectUri() {
    const redirectPath = `/api/auth/v3/social/callback`
    const redirectUri =
      ENV.appEnv === 'development'
        ? `http://localhost:5003${redirectPath}`
        : `https://${ENV.apiHost}${redirectPath}`
    return redirectUri
  }
  public async getSocialAccount({
    uid,
    provider,
  }: GetSocialAccountParams): Promise<SocialAccount | null> {
    const socialAccount = await this.db.socialAccount.findFirst({
      where: {
        social_id: uid.toString(),
        provider,
      },
    })
    return socialAccount
  }
  public async getSocialDataFromGoogle(code: string): Promise<SocialProfile> {
    const accessToken = await this.getGoogleAccessToken({
      code,
      clientId: ENV.googleClientId,
      clientSecret: ENV.googleSecret,
      redirectUri: `${this.redirectUri}/google`,
    })

    console.log('accessToken', accessToken)
    const profile = await this.getGoogleProfile(accessToken)

    console.log('profile', profile)
    const socialAccount = await this.getSocialAccount({
      uid: profile.uid,
      provider: 'google',
    })

    return {
      profile,
      accessToken,
      socialAccount,
      provider: 'google',
    }
  }
  private async getGoogleAccessToken({
    code,
    clientId,
    clientSecret,
    redirectUri,
  }: GetAccessTokenParams): Promise<string> {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
    const { tokens } = await oauth2Client.getToken(code)
    if (!tokens.access_token) throw new Error('Failed to retrieve google access token')
    return tokens.access_token
  }
  private async getGoogleProfile(accessToken: string) {
    const people = google.people('v1')
    const profile = await people.people.get({
      access_token: accessToken,
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos',
    })
    const { data } = profile
    const socialProfile: GetProfileFromSocial = {
      email: data.emailAddresses![0].value || null,
      name: data.names![0].displayName || 'emptyname',
      thumbnail: data.photos![0].url || null,
      uid: data.resourceName!.replace('people/', ''),
    }
    return socialProfile
  }
  public async getSocialDataFromFacebook(code: string): Promise<SocialProfile> {
    const accessToken = await this.getFacebookAccessToken({
      code,
      clientId: ENV.facebookClientId,
      clientSecret: ENV.facebookSecret,
      redirectUri: `${this.redirectUri}/facebook`,
    })
    const profile = await this.getFacebookProfile(accessToken)
    const socialAccount = await this.getSocialAccount({
      uid: profile.uid,
      provider: 'facebook',
    })

    return {
      profile,
      socialAccount,
      accessToken,
      provider: 'facebook',
    }
  }
  private async getFacebookAccessToken({
    code,
    clientId,
    clientSecret,
    redirectUri,
  }: GetAccessTokenParams): Promise<string> {
    const query = qs.stringify({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    })
    const response = await axios.get<FacebookTokenResult>(
      `https://graph.facebook.com/v4.0/oauth/access_token?${query}`,
    )
    return response.data.access_token
  }
  private async getFacebookProfile(token: string): Promise<GetProfileFromSocial> {
    const response = await axios.get<FacebookProfile>(
      'https://graph.facebook.com/v4.0/me?fields=id,name,email,picture',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const facebookProfile = response.data
    const profile: GetProfileFromSocial = {
      uid: facebookProfile.id,
      name: facebookProfile.name,
      username: '',
      email: facebookProfile.email,
      thumbnail: facebookProfile.picture.data.url,
    }

    return profile
  }
  public async getSocialDataFromGithub(code: string): Promise<SocialProfile> {
    const accessToken = await this.getGithubAccessToken({
      code,
      clientId: ENV.githubClientId,
      clientSecret: ENV.githubSecret,
    })
    const profile = await this.getGithubProfile(accessToken)
    const socialAccount = await this.getSocialAccount({
      uid: profile.uid,
      provider: 'github',
    })

    return {
      profile,
      socialAccount,
      accessToken,
      provider: 'github',
    }
  }
  private async getGithubAccessToken({
    code,
    clientId,
    clientSecret,
  }: GetAccessTokenParams): Promise<string> {
    const response = await axios.post<GithubOAuthResult>(
      'https://github.com/login/oauth/access_token',
      {
        code,
        client_id: clientId,
        client_secret: clientSecret,
      },
      {
        headers: {
          accept: 'application/json',
        },
      },
    )
    return response.data.access_token
  }
  private async getGithubProfile(token: string): Promise<GetProfileFromSocial> {
    const octokit = new Octokit({
      auth: `Bearer ${token}`,
    })
    const { data } = await octokit.users.getAuthenticated()
    const profile: GetProfileFromSocial = {
      uid: data.id,
      email: data.email,
      name: data.name,
      thumbnail: data.avatar_url,
      username: data.login,
    }
    return profile
  }
}
