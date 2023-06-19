type TokenData = {
  iat: number
  exp: number
  sub: string
  iss: string
}

export type AccessTokenData = {
  user_id: string
} & TokenData

export type RefreshTokenData = {
  user_id: string
  token_id: string
} & TokenData
