// Types for Faceleads API v1
// Keep names aligned with the .NET DTOs to avoid mapping churn.

export interface Result<T> {
  Success: boolean
  Value?: T
  ErrorCode?: string
  ErrorMessage?: string
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
}
