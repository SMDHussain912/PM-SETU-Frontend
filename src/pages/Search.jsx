import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useListQuery } from '../hooks/useListQuery'
import { search } from '../lib/endpoints'
import { orPending } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import DataBoundary from '../components/common/DataBoundary'
import Pagination from '../components/common/Pagination'
import './Search.css'

/**
 * Portal-wide search — plan §27.
 * Search filters and API parameters are intentionally unchanged.
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

const CATEGORIES = [
  { title: 'AP Clusters', description: 'Explore cluster locations, sectors and linked institutes.', to: '/clusters', icon: 'cluster' },
  { title: 'Industry Partners', description: 'Find Anchor Industry Partners and their sectors.', to: '/industry-partners', icon: 'industry' },
  { title: 'SPVs', description: 'Browse Special Purpose Vehicle records and status.', to: '/spvs', icon: 'partners' },
  { title: 'Investment Plans', description: 'Explore Strategic Investment Plans and approvals.', to: '/sips', icon: 'investment' },
  { title: 'GOs & Documents', description: 'Find government orders, guidelines and circulars.', to: '/documents', icon: 'document' },
  { title: 'News & Events', description: 'Read programme updates and published announcements.', to: '/news', icon: 'news' },
]

const CategoryIcon = ({ name }) => {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    cluster: <><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.2" /><path d="M5 19h14" /></>,
    industry: <><path d="M3 21V9l6 3V9l6 3V5h6v16Z" /><path d="M7 16h2m3 0h2m3-6h2m-7 6h2" /></>,
    partners: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0m1-4a4.5 4.5 0 0 1 5 4" /></>,
    investment: <><path d="M4 19V5m0 14h17" /><path d="m7 15 4-4 3 2 6-7" /><path d="M16 6h4v4" /></>,
    document: <><path d="M6 3h8l5 5v13H6Z" /><path d="M14 3v6h5M9 13h7m-7 4h7" /></>,
    news: <><path d="M4 5h16v15H4z" /><path d="M8 9h8m-8 4h8m-8 4h4" /></>,
  }
  return (
    <svg className="search-category__icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name]}
    </svg>
  )
}

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

  const clearSearch = () => {
    setTerm('')
    reset()
  }

  return (
    <>
      <PageHeader
        title="Search"
        lead="Search clusters, ITIs, industry partners, Special Purpose Vehicles, documents and news in one place."
        breadcrumb={[{ label: 'Search' }]}
      />

      <div className="container page-section search-page">
        <section className="search-intro" aria-labelledby="search-intro-title">
          <div className="search-intro__copy">
            <span className="search-eyebrow">PM SETU · ANDHRA PRADESH</span>
            <h2 id="search-intro-title">Find the information you need</h2>
            <p>Search programme records and published resources from across the portal. Enter a keyword, district, organisation or document reference.</p>
          </div>
          <div className="search-intro__art" aria-hidden="true">
            <svg viewBox="0 0 220 170" role="presentation">
              <path className="search-art__orbit" d="M24 138c19-44 51-74 97-78 28-3 51 8 72 28" />
              <circle className="search-art__glow" cx="116" cy="75" r="53" />
              <circle className="search-art__lens" cx="105" cy="68" r="31" />
              <path className="search-art__handle" d="m128 91 34 34" />
              <path className="search-art__spark" d="M47 45v12m-6-6h12m111 62v10m-5-5h10" />
              <circle className="search-art__dot" cx="174" cy="47" r="5" />
            </svg>
          </div>
        </section>

        <form className="search-form search-form--enhanced" role="search" onSubmit={submit}>
          <label className="field search-form__query">
            <span className="field__label">Search PM SETU</span>
            <input
              className="field__input"
              type="search"
              name="q"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Try a district, cluster, industry or GO number…"
              aria-label="Search PM SETU"
            />
          </label>
          <button type="submit" className="btn btn--primary">Search portal</button>
          <button type="button" className="btn btn--ghost" onClick={clearSearch}>Clear</button>
        </form>

        <form
          className="filter-bar search-filters"
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
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="field__label">District</span>
            <input className="field__input" type="text" name="district" defaultValue={filters.district} placeholder="District name" />
          </label>
          <label className="field">
            <span className="field__label">Category</span>
            <input className="field__input" type="text" name="category" defaultValue={filters.category} placeholder="Category" />
          </label>
          <label className="field">
            <span className="field__label">Document type</span>
            <input className="field__input" type="text" name="document_type" defaultValue={filters.document_type} placeholder="GO, circular…" />
          </label>
          <label className="field">
            <span className="field__label">Year</span>
            <input className="field__input" type="text" name="year" defaultValue={filters.year} placeholder="YYYY" inputMode="numeric" />
          </label>
          <label className="field">
            <span className="field__label">Date</span>
            <input className="field__input" type="date" name="date" defaultValue={filters.date} />
          </label>
          <div className="filter-bar__actions">
            <button type="submit" className="btn btn--primary">Apply filters</button>
          </div>
        </form>

        {filters.q.trim() === '' ? (
          <section className="search-browse" aria-labelledby="search-browse-title">
            <div className="search-section-heading">
              <div>
                <h2 id="search-browse-title">Explore the portal</h2>
                <p>Go directly to a programme area, or search across all published records above.</p>
              </div>
              <Link to="/sitemap" className="search-text-link">View sitemap <span aria-hidden="true">→</span></Link>
            </div>
            <div className="search-category-grid">
              {CATEGORIES.map((category) => (
                <Link className="search-category" to={category.to} key={category.to}>
                  <span className="search-category__icon-wrap"><CategoryIcon name={category.icon} /></span>
                  <span className="search-category__content">
                    <strong>{category.title}</strong>
                    <span>{category.description}</span>
                  </span>
                  <span className="search-category__arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
            <aside className="search-tips">
              <span className="search-tips__mark" aria-hidden="true">i</span>
              <div>
                <strong>Search tips</strong>
                <p>Try a district name, industry sector, cluster name, organisation, Government Order number or a keyword from a published document. Use filters to narrow results.</p>
              </div>
            </aside>
          </section>
        ) : (
          <DataBoundary
            loading={loading}
            error={error}
            isEmpty={results.length === 0}
            onRetry={refetch}
            emptyTitle={`No results for “${filters.q}”`}
            emptyMessage="Try a different term, relax the filters, or clear your search to browse portal categories."
            skeletonRows={3}
          >
            <p className="search-count">
              {data.total} result{data.total === 1 ? '' : 's'} for <strong>{filters.q}</strong>
            </p>
            <ul className="search-results">
              {results.map((item, i) => (
                <li key={`${item.type}-${item.id}-${i}`} className="search-result">
                  <span className="badge badge--muted">{orPending(item.type)}</span>
                  <h2 className="search-result__title"><Link to={item.url}>{orPending(item.title)}</Link></h2>
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
