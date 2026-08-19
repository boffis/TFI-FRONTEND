/**
 * Builds a full API URL whether or not VITE_API_BASE_URL carries a protocol or stray slashes.
 * @param {string} path - Endpoint path, with or without a leading slash.
 */
export const getApiUrl = (path = '') => {
  let baseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()

  // Without a protocol, fetch would resolve against the current origin.
  if (baseUrl && !/^https?:\/\//i.test(baseUrl)) {
    if (baseUrl.startsWith('localhost') || baseUrl.startsWith('127.0.0.1')) {
      baseUrl = `http://${baseUrl}`
    } else {
      baseUrl = `https://${baseUrl}`
    }
  }

  baseUrl = baseUrl.replace(/\/+$/, '')

  const cleanPath = path.startsWith('/') ? path : `/${path}`

  return `${baseUrl}${cleanPath}`
}
