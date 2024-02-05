import apiClient from '../apiClient'

export default async function checkNetwork() {
  try {
    await apiClient.get('/api/check', { timeout: 5000 })
    return true
  } catch (_) {
    return false
  }
}
