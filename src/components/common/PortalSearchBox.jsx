import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Shared portal-wide search. Results are served by the backend /search endpoint,
 * so every list page uses the same cross-module search behaviour.
 */
export default function PortalSearchBox({ compact = false }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    navigate(`/search?q=${encodeURIComponent(value)}`)
  }

  return (
    <form className={`portal-search${compact ? ' portal-search--compact' : ''}`} role="search" onSubmit={submit}>
      <label className="portal-search__label">
        <span>Search across PM SETU</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search clusters, ITIs, AIPs, SPVs, SIPs, documents and news…"
          aria-label="Search across PM SETU"
        />
      </label>
      <button className="btn btn--primary" type="submit" disabled={!query.trim()}>Search</button>
    </form>
  )
}
