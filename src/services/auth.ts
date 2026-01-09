// Auth service: manages tokens + login/logout calls.
// Storage strategy: access token in-memory, refresh token in localStorage.
// NOTE: For production, consider httpOnly cookies + secure storage.

import axios from 'axios'
import type { TokenResponse, Result } from '../types/api'

const ACCESS_MEM_KEY = 'faceleads_access_mem' // in-memory only
const REFRESH_KEY = 'faceleads_refresh_token'

let accessTokenMemory: string | null = null

function getBaseUrl(): string {
  // CRA vs Vite compatibility: prefer CRA-style env var if provided
  // Guard 'process' for Vite/Browser where 'process' is undefined
  const fromCRA = typeof process !== 'undefined' ? (process as any)?.env?.REACT_APP_API_BASE_URL : undefined
  const fromVite = (import.meta as any)?.env?.VITE_API_BASE_URL
  return (fromCRA || fromVite || '').toString()
}

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
  try {
    localStorage.removeItem(REFRESH_KEY)
  } catch {}
}

export async function login(username: string, password: string): Promise<TokenResponse> {
  const baseURL = getBaseUrl()
  // Use a raw axios instance here to avoid any interceptor side-effects
  const client = axios.create({ baseURL })
  const { data } = await client.post<TokenResponse>('/api/v1/login', {
    Username: username,
    Password: password,
  })
  setTokens(data.access_token, data.refresh_token)
  return data
}

export async function logout(): Promise<void> {
  const baseURL = getBaseUrl()
  const client = axios.create({ baseURL })
  const refresh = getRefreshToken()
  try {
    if (refresh) {
      await client.post<Result<unknown>>('/api/v1/logout', { RefreshToken: refresh })
    }
  } finally {
    clearTokens()
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken()
}
