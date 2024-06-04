import { ENV } from '@/env'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: ENV.apiV3Host,
  withCredentials: true,
})

export default apiClient
