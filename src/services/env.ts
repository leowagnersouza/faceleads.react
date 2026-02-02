// Environment utilities
// Centralized helper for resolving API base URL with sane defaults.
// Behavior:
// - If `VITE_API_BASE_URL` is defined, use it (without trailing slash).
// - In production, fallback to same-origin (window.location.origin).
// - In development, fallback to localhost.

function normalize(url: string): string {
	const trimmed = url.trim()
	return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

export function getApiBaseUrl(): string {
	const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined
	if (fromEnv && fromEnv.trim() !== '') {
		return normalize(fromEnv)
	}

	// Production fallback: assume same-origin deployment (reverse proxy/API gateway)
	if (import.meta.env.PROD) {
		if (typeof window !== 'undefined' && window.location?.origin) {
			return normalize(window.location.origin)
		}
	}

	// Development fallback: localhost API
	// Adjust the port if your local API runs elsewhere.
	return 'http://localhost:5293'
}
