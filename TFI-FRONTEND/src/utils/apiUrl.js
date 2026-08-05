/**
 * Constructs a full API URL safely regardless of whether VITE_API_BASE_URL
 * or the provided path includes leading/trailing slashes.
 *
 * @param {string} path - The endpoint path (e.g. 'auth/signin' or '/auth/signin')
 * @returns {string} The normalized full URL string
 */
export const getApiUrl = (path = '') => {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}
