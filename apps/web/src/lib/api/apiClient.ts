import { ENV } from '@/env'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: ENV.apiV3Host,
  withCredentials: true,
})

export const cachedApiClient = axios.create({
  baseURL: ENV.cachedApiHost,
})

export default apiClient
