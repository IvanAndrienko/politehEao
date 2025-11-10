import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { API_BASE_URL } from './lib/api.ts'

const originalFetch = window.fetch.bind(window)

const shouldAttachAuth = (target: string) => {
  const normalized = target.toString()
  return (
    normalized.startsWith('/api') ||
    normalized.startsWith('/uploads') ||
    normalized.startsWith(API_BASE_URL)
  )
}

const mergeHeaders = (...sources: (HeadersInit | undefined)[]) => {
  const headers = new Headers()
  sources.forEach((source) => {
    if (!source) return
    new Headers(source).forEach((value, key) => headers.set(key, value))
  })
  return headers
}

window.fetch = (input, init = {}) => {
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input instanceof Request
          ? input.url
          : ''

  if (!url) {
    return originalFetch(input, init)
  }

  const token = localStorage.getItem('adminToken')
  if (!token || !shouldAttachAuth(url)) {
    return originalFetch(input, init)
  }

  const headers = mergeHeaders(
    input instanceof Request ? input.headers : undefined,
    init.headers
  )
  headers.set('Authorization', `Bearer ${token}`)

  const nextInit: RequestInit = {
    ...init,
    headers
  }

  if (input instanceof Request) {
    return originalFetch(new Request(input, nextInit))
  }

  return originalFetch(url, nextInit)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
