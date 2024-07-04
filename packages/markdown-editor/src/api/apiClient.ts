import { ENV } from '@/env'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: ENV.graphqlBookServerHost,
  withCredentials: true,
})

export default apiClient
