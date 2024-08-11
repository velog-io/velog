export function includeProtocol(address: string) {
  return /^https?:\/\//.test(address) ? address : `https://${address}`
}
