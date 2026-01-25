// Central axios client with Authorization + refresh-on-401.
// Observação: o frontend espera envelopes camelCase `Result<T>` do backend
// com as chaves: `success`, `value`, `errorCode`, `errorMessage`.
// O cliente desenbrulha automaticamente quando `success=true`.

import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './auth'
import { getApiBaseUrl } from './env'
import type { TokenResponse } from '../types/api'

// Base URL comes from centralized env helper

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

const apiClient: AxiosInstance = axios.create({ baseURL: getApiBaseUrl() })

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

const refreshClient = axios.create({ baseURL: getApiBaseUrl() }) // no interceptors

apiClient.interceptors.response.use(
  (response) => {
    // Unwrap camelCase Result<T> envelopes
    const body = response.data as any
    if (body && typeof body === 'object' && 'success' in body) {
      if (body.success === false) {
        throw new ApiError(body.errorMessage || 'Operação falhou', {
          code: body.errorCode,
          status: response.status,
        })
      }
      return { ...response, data: body.value }
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
        const { data } = await refreshClient.post('/api/v1/refresh', {
          RefreshToken: refresh,
        })
        if (!data?.success || !data?.value) {
          throw new ApiError(data?.errorMessage || 'Falha ao renovar token', {
            code: data?.errorCode,
            status: 401,
          })
        }
        const tokens = data.value as TokenResponse
        setTokens(tokens.access_token, tokens.refresh_token)
        onRefreshed(tokens.access_token)

        // Update header and retry original
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers['Authorization'] = `Bearer ${tokens.access_token}`
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
    const bodyErr = res?.data as any
    if (bodyErr && typeof bodyErr === 'object' && 'success' in bodyErr && bodyErr.success === false) {
      return Promise.reject(
        new ApiError(bodyErr.errorMessage || 'Erro da API', {
          code: bodyErr.errorCode,
          status: res?.status,
        }),
      )
    }

    return Promise.reject(error)
  },
)

export default apiClient
