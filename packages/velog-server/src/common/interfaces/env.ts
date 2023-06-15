export type Envrionment = 'development' | 'production' | 'test' | 'stage'
export type EnvFiles = Record<Envrionment, string>
export type EnvVars = {
  appEnv: Envrionment
  port: number
  clientHost: string
  cookieSecretKey: string
  jwtSecretKey: string
  awsDefaultProfile: string
  esHost: string
  social: {
    githubId: string
    githubSecret: string
    facebookId: string
    facebookSecret: string
    googleId: string
    googleSecret: string
  }
  hashKey: string
  slack: {
    token: string
    image: string
  }
  googleApplicationCredentials: string
  banned: {
    keywords: string
    altKeywords: string
  }
  unscored: {
    category: string
    words: string
  }
  graphcdnToken: string
  blacklist: {
    username: string
    ip: string
  }
  cloudflare: {
    id: string
    token: string
    accountHash: string
  }
  b2: {
    keyId: string
    key: string
    bucketId: string
  }
  codenary: {
    apiKey: string
    webhook: string
    callback: string
  }
  databaseUrl: string
}
