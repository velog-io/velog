import { detectIOS } from './detect-ios'

const getMetakey = (): string => {
  const isIOS = detectIOS()
  return isIOS ? 'Cmd' : 'Ctrl'
}

export const metaKey = getMetakey()
