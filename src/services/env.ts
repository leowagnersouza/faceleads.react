// API base URL manual toggle
// Escolha UMA das linhas abaixo e comente a outra.
// A aplicação SEMPRE usará o valor codificado aqui.

// Online (Azure)
export const API_BASE_URL = 'https://faceleads-api-dev.azurewebsites.net'

// Local
//export const API_BASE_URL = 'https://localhost:7062'

export function getApiBaseUrl(): string {
	return API_BASE_URL
}
