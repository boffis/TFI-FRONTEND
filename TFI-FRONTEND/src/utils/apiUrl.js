/**
 * Constructs a full API URL safely regardless of whether VITE_API_BASE_URL
 * includes protocol ('http://' or 'https://'), or leading/trailing slashes.
 *
 * @param {string} path - The endpoint path (e.g. 'auth/signin' or '/auth/signin')
 * @returns {string} The normalized full URL string
 */
export const getApiUrl = (path = '') => {
  let baseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()

  // Ensure protocol is present (if missing, relative fetches target current origin)
  if (baseUrl && !/^https?:\/\//i.test(baseUrl)) {
    if (baseUrl.startsWith('localhost') || baseUrl.startsWith('127.0.0.1')) {
      baseUrl = `http://${baseUrl}`
    } else {
      baseUrl = `https://${baseUrl}`
    }
  }

  // Strip trailing slashes from base URL
  baseUrl = baseUrl.replace(/\/+$/, '')

  // Ensure path starts with a single slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  return `${baseUrl}${cleanPath}`
}
