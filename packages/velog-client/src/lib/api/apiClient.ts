import axios from 'axios'

const host =
  process.env.NODE_ENV === 'development'
    ? '/'
    : process.env.NEXT_PUBLIC_API_V2_HOST || '/'
const apiClient = axios.create({
  baseURL: host,
  withCredentials: true,
})

export default apiClient
