type TokenData = {
  iat: number
  exp: number
  sub: string
  iss: string
}

export type AccessTokenData = {
  userId: string
} & TokenData

export type RefreshTokenData = {
  userId: string
  tokenId: string
} & TokenData
