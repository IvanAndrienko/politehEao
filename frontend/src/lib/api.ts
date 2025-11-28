const normalizeBase = (value?: string) => {
  const raw = (value ?? window.location.origin).replace(/\/+$/, '')
  return raw.replace(/\/api$/i, '')
}

const API_BASE_URL = normalizeBase(import.meta.env.VITE_API_BASE_URL)
const DEFAULT_ASSETS_BASE = `${API_BASE_URL}/uploads`
const ASSETS_BASE_URL = normalizeBase(
  import.meta.env.VITE_ASSETS_BASE_URL ?? DEFAULT_ASSETS_BASE
)

const normalizeApiPath = (path = '') => {
  if (!path) return ''
  const cleaned = path.replace(/^\/+/, '')
  return cleaned.startsWith('api/') ? cleaned.slice(4) : cleaned
}

const buildApiPath = (path = '') => {
  const relative = normalizeApiPath(path)
  return `/api${relative ? `/${relative}` : ''}`
}

const buildUrl = (base: string, path = '') => {
  if (!path) return base
  if (/^https?:\/\//i.test(path)) return path
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export const apiUrl = (path = '') => buildUrl(API_BASE_URL, buildApiPath(path))
const buildAssetPath = (path = '') => {
  if (!path) return ''
  const cleaned = path.replace(/^\/+/, '')
  return cleaned.startsWith('uploads/') ? cleaned : `uploads/${cleaned}`
}
export const assetUrl = (path = '') => buildUrl(ASSETS_BASE_URL, buildAssetPath(path))

export { API_BASE_URL }
