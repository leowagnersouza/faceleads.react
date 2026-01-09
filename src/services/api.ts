// Central axios client with Authorization + refresh-on-401.
// Handles .NET Result<T> errors by throwing a typed Error.

import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './auth'
import type { Result, TokenResponse } from '../types/api'

function getBaseUrl(): string {
  // Guard 'process' for Vite/Browser where 'process' is undefined
  const fromCRA = typeof process !== 'undefined' ? (process as any)?.env?.REACT_APP_API_BASE_URL : undefined
  const fromVite = (import.meta as any)?.env?.VITE_API_BASE_URL
  return (fromCRA || fromVite || '').toString()
}

export class ApiError extends Error {
  code?: string
  status?: number
  constructor(message: string, opts?: { code?: string; status?: number }) {
    super(message)
    this.name = 'ApiError'
    this.code = opts?.code
    this.status = opts?.status
  }
}

const apiClient: AxiosInstance = axios.create({ baseURL: getBaseUrl() })

// Attach Authorization header if access token exists
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    ;(config.headers as any)['Authorization'] = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  pendingQueue.push(cb)
}
function onRefreshed(token: string | null) {
  pendingQueue.forEach((cb) => cb(token))
  pendingQueue = []
}

const refreshClient = axios.create({ baseURL: getBaseUrl() }) // no interceptors

apiClient.interceptors.response.use(
  (response) => {
    // If API returns Result envelope, surface an error when Success=false
    const maybeResult = response.data as Result<unknown>
    if (maybeResult && typeof maybeResult === 'object' && 'Success' in maybeResult) {
      if (maybeResult.Success === false) {
        throw new ApiError(maybeResult.ErrorMessage || 'Operação falhou', {
          code: maybeResult.ErrorCode,
          status: response.status,
        })
      }
    }
    return response
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    // Network/timeout: bubble up
    const status = error.response?.status

    // 401: try refresh if we have a refresh token and this request wasn't already retried
    if (status === 401 && !originalRequest?._retry) {
      const refresh = getRefreshToken()
      if (!refresh) {
        clearTokens()
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (!newToken) return reject(error)
            originalRequest.headers = originalRequest.headers ?? {}
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`
            originalRequest._retry = true
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true
      try {
        const { data } = await refreshClient.post<TokenResponse>('/api/v1/refresh', {
          RefreshToken: refresh,
        })
        setTokens(data.access_token, data.refresh_token)
        onRefreshed(data.access_token)

        // Update header and retry original
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`
        return apiClient(originalRequest)
      } catch (refreshErr) {
        onRefreshed(null)
        clearTokens()
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    // If response body is Result with error
    const res = error.response
    const maybeResult = res?.data as Result<unknown>
    if (maybeResult && typeof maybeResult === 'object' && 'Success' in maybeResult) {
      return Promise.reject(
        new ApiError(maybeResult.ErrorMessage || 'Erro da API', {
          code: maybeResult.ErrorCode,
          status: res?.status,
        }),
      )
    }

    return Promise.reject(error)
  },
)

export default apiClient
