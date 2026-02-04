// Types for Faceleads API v1
// Keep names aligned with the .NET DTOs to avoid mapping churn.

// API envelope (camelCase) esperado pelo frontend
export interface Result<T> {
  success: boolean
  value?: T
  errorCode?: string
  errorMessage?: string
}

// Normalized error object used by hooks/services.
// Keep lightweight; map from server envelope when available.
export interface AppError {
  message: string
  errorCode?: string
}

export interface Consultor {
  id: string
  nomeCompleto: string
  email: string
  telefone?: string
  ativo: boolean
  criadoEmUtc: string // ISO string from server
}

export interface CreateConsultorCommand {
  nomeCompleto: string
  email: string
  telefone?: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  tenant_name?: string
}
