// Types for Faceleads API v1
// Keep names aligned with the .NET DTOs to avoid mapping churn.

export interface Result<T> {
  Success: boolean
  Value?: T
  ErrorCode?: string
  ErrorMessage?: string
}

export interface Consultor {
  Id: string
  NomeCompleto: string
  Email: string
  Telefone?: string
  Ativo: boolean
  CriadoEmUtc: string // ISO string from server
}

export interface CreateConsultorCommand {
  NomeCompleto: string
  Email: string
  Telefone?: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
}
