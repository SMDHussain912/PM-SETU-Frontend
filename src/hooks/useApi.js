import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ApiError } from '../lib/api'

/**
 * useApi — the single data-fetching hook for the portal (plan §7.2).
 *
 * Guarantees the four states from §7.3 are distinguishable by the caller:
 *
 *   loading  true while a request is in flight (and during a refetch)
 *   error    an ApiError when the service failed — the page shows ErrorState
 *            and MUST NOT render fallback or stale numbers
 *   data     null before the first success; the payload afterwards
 *   meta     pagination metadata when the endpoint supplies it
 *
 * `loading` is DERIVED from a request key rather than set with setState in the
 * effect body: a synchronous setState inside an effect causes cascading renders.
 *
 * Cancellation: each request gets an AbortSignal and is aborted on unmount or
 * when the key changes, so a fast navigation cannot update an unmounted
 * component or let two pages' responses race.
 *
 * @example
 * const { data, loading, error, refetch } = useApi((signal) => getHomeKpis({ signal }))
 *
 * @param {(signal: AbortSignal) => Promise<{data: unknown, meta: object|null}>} fetcher
 * @param {Array<string|number>} [deps] primitive re-fetch keys, e.g. [id, page]
 * @param {{ enabled?: boolean }} [options] enabled:false skips fetching
 */
export function useApi(fetcher, deps = [], options = {}) {
  const { enabled = true } = options

  const [reloadToken, setReloadToken] = useState(0)
  const [state, setState] = useState({ key: null, data: null, meta: null, error: null })

  // Stable identity for "the request we are currently waiting on".
  // `deps` holds primitives, so joining them is a stable key.
  const depKey = useMemo(() => deps.join('|'), [deps])
  const requestKey = `${enabled ? 'on' : 'off'}|${reloadToken}|${depKey}`

  // Keep the latest fetcher without making it an effect dependency, so an
  // inline arrow function does not cause an infinite refetch loop.
  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  useEffect(() => {
    if (!enabled) return undefined

    const controller = new AbortController()
    let active = true

    fetcherRef
      .current(controller.signal)
      .then(({ data, meta }) => {
        if (!active) return
        setState({ key: requestKey, data, meta: meta ?? null, error: null })
      })
      .catch((error) => {
        // An abort is a cancellation, not a failure — stay quiet.
        if (error?.name === 'AbortError') return
        if (!active) return
        setState({
          key: requestKey,
          data: null,
          meta: null,
          error:
            error instanceof ApiError
              ? error
              : new ApiError('Something went wrong while loading this information.'),
        })
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [requestKey, enabled])

  const refetch = useCallback(() => setReloadToken((n) => n + 1), [])

  const loading = enabled && state.key !== requestKey

  return {
    data: state.data,
    meta: state.meta,
    error: state.error,
    loading,
    refetch,
  }
}

export default useApi
