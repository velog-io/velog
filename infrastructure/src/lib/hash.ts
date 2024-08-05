import crypto from 'crypto'

export const getRandomSHA256Hash = () => {
  const randomString = crypto.randomBytes(16).toString('hex')
  const hash = crypto.createHash('sha256').update(randomString).digest('hex')
  return hash
}
