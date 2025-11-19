const normalizeBase = (value?: string) =>
  (value ?? 'http://localhost:5000').replace(/\/$/, '')

const API_BASE_URL = normalizeBase(import.meta.env.VITE_API_BASE_URL)
const ASSETS_BASE_URL = normalizeBase(import.meta.env.VITE_ASSETS_BASE_URL ?? API_BASE_URL)

const buildUrl = (base: string, path = '') => {
  if (!path) return base
  if (/^https?:\/\//i.test(path)) return path
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export const apiUrl = (path = '') => buildUrl(API_BASE_URL, path)
export const assetUrl = (path = '') => buildUrl(ASSETS_BASE_URL, path)

export { API_BASE_URL }