// Auth service: manages tokens + login/logout calls.
// Storage strategy: access token in-memory, refresh token in localStorage.
// NOTE: For production, consider httpOnly cookies + secure storage.

import axios from 'axios'
import type { TokenResponse } from '../types/api'
import { ApiError } from './api'
import { getApiBaseUrl } from './env'

const REFRESH_KEY = 'faceleads_refresh_token'
const TENANT_NAME_KEY = 'faceleads_tenant_name'

let accessTokenMemory: string | null = null
let tenantNameMemory: string | null = null

export function getAccessToken(): string | null {
  return accessTokenMemory
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_KEY)
  } catch {
    return null
  }
}

export function getTenantName(): string | null {
  if (tenantNameMemory) return tenantNameMemory
  try {
    const v = localStorage.getItem(TENANT_NAME_KEY)
    tenantNameMemory = v
    return v
  } catch {
    return null
  }
}

export function setTokens(access: string, refresh: string) {
  accessTokenMemory = access
  try {
    localStorage.setItem(REFRESH_KEY, refresh)
  } catch {
    // Ignore storage errors (Safari private mode, etc.)
  }
}

export function clearTokens() {
  accessTokenMemory = null
  tenantNameMemory = null
  try {
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(TENANT_NAME_KEY)
  } catch {}
}

export async function login(username: string, password: string): Promise<TokenResponse> {
  const baseURL = getApiBaseUrl()
  // Use a raw axios instance here to avoid any interceptor side-effects
  const client = axios.create({ baseURL })
  const { data } = await client.post('/api/v1/login', {
    Username: username,
    Password: password,
  })
  // Espera envelope camelCase: { success, value, errorMessage, errorCode }
  if (!data?.success || !data?.value) {
    throw new ApiError(data?.errorMessage || 'Falha no login', {
      code: data?.errorCode,
      status: 401,
    })
  }
  const tokens = data.value as TokenResponse
  setTokens(tokens.access_token, tokens.refresh_token)
  // Capture tenant name
  if (tokens.tenant_name) {
    tenantNameMemory = tokens.tenant_name
    try {
      localStorage.setItem(TENANT_NAME_KEY, tokens.tenant_name)
    } catch {}
  }
  return tokens
}

export async function logout(): Promise<void> {
  const baseURL = getApiBaseUrl()
  const client = axios.create({ baseURL })
  const refresh = getRefreshToken()
  try {
    if (refresh) {
      const { data } = await client.post('/api/v1/logout', { RefreshToken: refresh })
      if (data?.success === false) {
        throw new ApiError(data?.errorMessage || 'Falha ao sair', {
          code: data?.errorCode,
          status: 400,
        })
      }
    }
  } finally {
    clearTokens()
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken()
}
