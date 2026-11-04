import { getAccessToken } from '../context/auth-storage'

/**
 * API client — plan §18 (API layer) and §7.3.
 *
 * Public requests remain anonymous. When an official session exists, the
 * bearer token is attached automatically for protected backend endpoints.
 */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '')
const DEFAULT_TIMEOUT_MS = 15000

export class ApiError extends Error {
  constructor(message, { code = 'UNKNOWN', status = 0, details } = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

export function buildQuery(params) {
  if (!params) return ''
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    if (typeof value === 'string' && value.trim() === '') continue
    if (Array.isArray(value) && value.length === 0) continue
    search.append(key, Array.isArray(value) ? value.join(',') : String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

function withTimeout(signal, timeoutMs) {
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)
  const onAbort = () => controller.abort()
  if (signal) {
    if (signal.aborted) controller.abort()
    else signal.addEventListener('abort', onAbort, { once: true })
  }
  return {
    signal: controller.signal,
    get timedOut() { return timedOut },
    cleanup: () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
    },
  }
}

async function request(path, options = {}) {
  const { params, method = 'GET', body, signal, timeout = DEFAULT_TIMEOUT_MS } = options
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}${buildQuery(params)}`
  const guard = withTimeout(signal, timeout)
  const accessToken = getAccessToken()

  let response
  try {
    response = await fetch(url, {
      method,
      signal: guard.signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    throw new ApiError(
      guard.timedOut
        ? 'The PM SETU service took too long to respond. Please try again.'
        : 'We could not reach the PM SETU service. Please check your connection and try again.',
      { code: guard.timedOut ? 'TIMEOUT' : 'NETWORK_ERROR' },
    )
  } finally {
    guard.cleanup()
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new ApiError(`The PM SETU service returned an unexpected response (HTTP ${response.status}).`, {
      code: 'INVALID_RESPONSE', status: response.status,
    })
  }

  if (!response.ok || payload?.success !== true) {
    throw new ApiError(payload?.error?.message || `Request failed with status ${response.status}.`, {
      code: payload?.error?.code || 'REQUEST_FAILED',
      status: response.status,
      details: payload?.error?.details,
    })
  }

  return { data: payload.data, meta: payload.meta ?? null }
}

export const api = {
  request,
  get: (path, params, options) => request(path, { ...options, method: 'GET', params }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}

export { BASE_URL }
