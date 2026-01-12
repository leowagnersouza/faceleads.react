// Environment utilities
// Centralized helper for resolving API base URL in Vite/CRA

export function getApiBaseUrl(): string {
	const apiUrl = import.meta.env.VITE_API_BASE_URL;
	return apiUrl;
}
