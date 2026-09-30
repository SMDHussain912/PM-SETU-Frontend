/**
 * API client — plan §18 (API layer) and §7.3.
 *
 * The backend (Backend/src/utils/response.ts) always answers with one of two
 * envelopes:
 *
 *   { "success": true,  "data": <T>, "meta": { page, pageSize, total,
 *                                            totalPages, hasNextPage,
 *                                            hasPreviousPage } }
 *   { "success": false, "error": { message, code, details? } }
 *
 * This module unwraps that shape so pages only ever see `data` and `meta`, and
 * throws a typed ApiError otherwise. It deliberately has NO fallback data: if
 * the service is down the caller must show an error state, never invented
 * numbers (plan §95, and the Home KPI contract in sql/home/home_kpis.sql).
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '')

/** Default per-request timeout. The public rate limit is 300 req / 15 min. */
const DEFAULT_TIMEOUT_MS = 15000

export class ApiError extends Error {
  /**
   * @param {string} message human-readable, safe to show a visitor
   * @param {{ code?: string, status?: number, details?: unknown }} [options]
   */
  constructor(message, { code = 'UNKNOWN', status = 0, details } = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

/**
 * Serialises query parameters.
 *
 * Drops undefined / null / empty-string / empty-array entries because the
 * backend validates with zod `.optional()`, which rejects `""` — sending an
 * empty filter would fail the whole request. `0` and `false` are PRESERVED:
 * they are meaningful values, not "absent".
 */
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

/**
 * Combines the caller's AbortSignal with a timeout, so both a route change and
 * a hung request can cancel an in-flight call.
 */
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
    get timedOut() {
      return timedOut
    },
    cleanup: () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
    },
  }
}

/**
 * Performs a request and returns `{ data, meta }`.
 *
 * @param {string} path    path below the API base, e.g. '/clusters'
 * @param {object} [options]
 * @param {object} [options.params]  query parameters
 * @param {'GET'|'POST'|'PATCH'|'PUT'|'DELETE'} [options.method]
 * @param {unknown} [options.body]   JSON request body
 * @param {AbortSignal} [options.signal]
 * @param {number} [options.timeout]
 * @returns {Promise<{ data: unknown, meta: object|null }>}
 */
async function request(path, options = {}) {
  const {
    params,
    method = 'GET',
    body,
    signal,
    timeout = DEFAULT_TIMEOUT_MS,
  } = options

  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}${buildQuery(params)}`
  const guard = withTimeout(signal, timeout)

  let response
  try {
    response = await fetch(url, {
      method,
      signal: guard.signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
  } catch (error) {
    // Re-throw aborts untouched so callers can tell "cancelled" from "failed".
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

  // A non-JSON body (proxy error page, gateway timeout) would throw here.
  let payload
  try {
    payload = await response.json()
  } catch {
    throw new ApiError(
      `The PM SETU service returned an unexpected response (HTTP ${response.status}).`,
      { code: 'INVALID_RESPONSE', status: response.status },
    )
  }

  if (!response.ok || payload?.success !== true) {
    throw new ApiError(
      payload?.error?.message ||
        `Request failed with status ${response.status}.`,
      {
        code: payload?.error?.code || 'REQUEST_FAILED',
        status: response.status,
        details: payload?.error?.details,
      },
    )
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
