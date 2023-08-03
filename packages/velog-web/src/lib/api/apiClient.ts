import { ENV } from '@/env'
import axios from 'axios'

const host = ENV.apiV2Host

// ENV.appEnv === 'development' ? ENV.apiV2Host : ENV.apiV2Host || '/'

const apiClient = axios.create({
  baseURL: host,
  withCredentials: true,
})

export default apiClient
