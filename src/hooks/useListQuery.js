import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * useListQuery — page + filter state for the paginated list endpoints.
 *
 * Reads the initial state from the URL query string so a filtered list is
 * shareable and the browser Back button steps through filter changes — required
 * for the "search, filter, sort" behaviour in plan §15 and §6.
 *
 * Uses page.js's `useSearchParams`, so no extra router-state library is needed.
 */
export function useListQuery(defaults = {}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const pageSize =
    Math.min(100, Math.max(1, Number(searchParams.get('pageSize')) || defaults.pageSize || 20))

  const filters = {}
  for (const [key, fallback] of Object.entries(defaults)) {
    if (key === 'pageSize') continue
    const raw = searchParams.get(key)
    filters[key] = raw === null || raw === '' ? (fallback ?? '') : raw
  }

  /** Replaces the query string; any change resets to page 1. */
  const setFilters = useCallback(
    (next) => {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(next)) {
        if (value === '' || value === null || value === undefined) continue
        params.set(key, String(value))
      }
      setSearchParams(params, { replace: false })
    },
    [setSearchParams],
  )

  const setPage = useCallback(
    (nextPage) => {
      const params = new URLSearchParams(searchParams)
      if (nextPage <= 1) params.delete('page')
      else params.set('page', String(nextPage))
      setSearchParams(params, { replace: false })
    },
    [searchParams, setSearchParams],
  )

  const reset = useCallback(() => setSearchParams(new URLSearchParams(), { replace: false }), [
    setSearchParams,
  ])

  // Keep the URL honest if the user edits ?page=abc or ?page=-4 by hand.
  useEffect(() => {
    if (page < 1) setPage(1)
  }, [page, setPage])

  return { page, pageSize, filters, setFilters, setPage, reset }
}

export default useListQuery
