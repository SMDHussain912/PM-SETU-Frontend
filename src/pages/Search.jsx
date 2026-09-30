import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useListQuery } from '../hooks/useListQuery'
import { search } from '../lib/endpoints'
import { orPending } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import DataBoundary from '../components/common/DataBoundary'
import Pagination from '../components/common/Pagination'

/**
 * Portal-wide search — plan §27.
 *
 * §27 requires one search across Cluster, ITI, AIP, SPV, GO, RFP, SIP, News,
 * Circular and District, with filters for Category, Cluster, District, Year,
 * Date and Document Type. The endpoint
 * (Backend/src/modules/search/search.schema.ts) accepts exactly:
 *
 *   q (required) · type (enum) · district · year (YYYY) · category
 *   date (YYYY-MM-DD) · document_type
 *
 * `type` is a closed enum, so it is a <select>; the rest are free text because
 * their vocabularies are still TO CONFIRM.
 */
const TYPES = [
  { value: '', label: 'All types' },
  { value: 'cluster', label: 'Cluster' },
  { value: 'iti', label: 'ITI' },
  { value: 'aip', label: 'Industry Partner (AIP)' },
  { value: 'spv', label: 'SPV' },
  { value: 'sip', label: 'SIP' },
  { value: 'document', label: 'Document / GO' },
  { value: 'news', label: 'News' },
]

const Search = () => {
  const { page, pageSize, filters, setFilters, setPage, reset } = useListQuery({
    q: '',
    type: '',
    district: '',
    year: '',
    category: '',
    date: '',
    document_type: '',
  })

  const { data, meta, loading, error, refetch } = useApi(
    (signal) => search({ ...filters, page, pageSize }, { signal }),
    [
      page,
      pageSize,
      filters.q,
      filters.type,
      filters.district,
      filters.year,
      filters.category,
      filters.date,
      filters.document_type,
    ],
    { enabled: filters.q.trim().length > 0 },
  )

  const results = data?.results ?? []
  const [term, setTerm] = useState(filters.q)

  const submit = (e) => {
    e.preventDefault()
    setFilters({ ...filters, q: term.trim() })
  }

  return (
    <>
      <PageHeader
        title="Search"
        lead="Search clusters, ITIs, industry partners, Special Purpose Vehicles, documents and news in one place."
        breadcrumb={[{ label: 'Search' }]}
      />

      <div className="container page-section">
        <form className="search-form" role="search" onSubmit={submit}>
          <label className="field">
            <span className="field__label">Search PM SETU</span>
            <input
              className="field__input"
              type="search"
              name="q"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g. Amaravati, Electronics, Government Order…"
            />
          </label>
          <button type="submit" className="btn btn--primary">
            Search
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => { setTerm(''); reset() }}>
            Clear
          </button>
        </form>

        {/* §27 filters */}
        <form
          className="filter-bar"
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            setFilters({
              ...filters,
              type: fd.get('type'),
              district: fd.get('district'),
              year: fd.get('year'),
              category: fd.get('category'),
              date: fd.get('date'),
              document_type: fd.get('document_type'),
            })
          }}
        >
          <label className="field">
            <span className="field__label">Type</span>
            <select className="field__input" name="type" defaultValue={filters.type}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">District</span>
            <input className="field__input" type="text" name="district" defaultValue={filters.district} />
          </label>

          <label className="field">
            <span className="field__label">Category</span>
            <input className="field__input" type="text" name="category" defaultValue={filters.category} />
          </label>

          <label className="field">
            <span className="field__label">Document type</span>
            <input
              className="field__input"
              type="text"
              name="document_type"
              defaultValue={filters.document_type}
            />
          </label>

          <label className="field">
            <span className="field__label">Year</span>
            <input
              className="field__input"
              type="text"
              name="year"
              defaultValue={filters.year}
              placeholder="YYYY"
              inputMode="numeric"
            />
          </label>

          <label className="field">
            <span className="field__label">Date</span>
            <input className="field__input" type="date" name="date" defaultValue={filters.date} />
          </label>

          <div className="filter-bar__actions">
            <button type="submit" className="btn btn--primary">
              Apply filters
            </button>
          </div>
        </form>

        {filters.q.trim() === '' ? (
          <p className="page-note">
            Enter a term above to search the portal. Prefer to browse? See the{' '}
            <Link to="/sitemap">sitemap</Link>.
          </p>
        ) : (
          <DataBoundary
            loading={loading}
            error={error}
            isEmpty={results.length === 0}
            onRetry={refetch}
            emptyTitle={`No results for “${filters.q}”`}
            emptyMessage="Try a different term, relax the filters, or browse the sitemap."
            skeletonRows={3}
          >
            <p className="search-count">
              {data.total} result{data.total === 1 ? '' : 's'} for{' '}
              <strong>{filters.q}</strong>
            </p>
            <ul className="search-results">
              {results.map((item, i) => (
                <li key={`${item.type}-${item.id}-${i}`} className="search-result">
                  <span className="badge badge--muted">{orPending(item.type)}</span>
                  <h2 className="search-result__title">
                    <Link to={item.url}>{orPending(item.title)}</Link>
                  </h2>
                  {item.summary && <p className="search-result__summary">{item.summary}</p>}
                </li>
              ))}
            </ul>
            <Pagination meta={meta} onPageChange={setPage} />
          </DataBoundary>
        )}
      </div>
    </>
  )
}

export default Search
