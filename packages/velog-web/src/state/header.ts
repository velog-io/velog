import { sangte, useSangteActions, useSangteValue } from 'sangte'

type HeaderState = {
  isCustom: boolean
  userLogo: UserLogo | null
  username: string | null
}

export type UserLogo = {
  title: string | null
  logo_image: string | null
}

const initialState: HeaderState = {
  isCustom: false,
  userLogo: null,
  username: null,
}

const headerState = sangte(initialState, (prev) => ({
  enterUserVelog(payload: EnterUserVelogPayload) {
    prev.isCustom = true
    prev.userLogo = payload.userLogo || null
    prev.username = payload.username
  },
  leaveUserVelog() {
    prev.isCustom = false
    prev.userLogo = null
    prev.username = null
  },
}))

type EnterUserVelogPayload = {
  username: string
  userLogo?: UserLogo | null
}

export function useHeader() {
  const value = useSangteValue(headerState)
  const actions = useSangteActions(headerState)

  return { value, actions }
}
