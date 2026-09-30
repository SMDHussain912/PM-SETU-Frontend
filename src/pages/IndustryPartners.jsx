import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useListQuery } from '../hooks/useListQuery'
import { listAips } from '../lib/endpoints'
import { orPending, formatStatus } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import DataBoundary from '../components/common/DataBoundary'
import Pagination from '../components/common/Pagination'

/**
 * Industry Partners / AIPs — plan §11. Public card fields: AIP name, logo,
 * cluster, sector, partnership status, academic/technology partner, SIP status.
 * Filters supported by Backend/sql/aips/aip_queries.sql: ?search= ?sector=
 * ?status= ?cluster_id=
 */
const IndustryPartners = () => {
  const { page, pageSize, filters, setFilters, setPage, reset } = useListQuery({
    search: '',
    sector: '',
    status: '',
  })

  const { data, meta, loading, error, refetch } = useApi(
    (signal) => listAips({ ...filters, page, pageSize }, { signal }),
    [page, pageSize, filters.search, filters.sector, filters.status],
  )

  const partners = Array.isArray(data) ? data : []

  return (
    <>
      <PageHeader
        title="Industry Partners / AIPs"
        lead="Anchor Industry Partners co-design curricula, provide faculty, machines, and employment pathways for PM SETU trainees."
        breadcrumb={[{ label: 'Industry Partners / AIPs' }]}
      />

      <div className="container page-section">
        <form
          className="filter-bar"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            setFilters({
              search: fd.get('search'),
              sector: fd.get('sector'),
              status: fd.get('status'),
            })
          }}
        >
          <label className="field">
            <span className="field__label">Search</span>
            <input className="field__input" type="search" name="search" defaultValue={filters.search} placeholder="Partner name" />
          </label>
          <label className="field">
            <span className="field__label">Sector</span>
            <input className="field__input" type="text" name="sector" defaultValue={filters.sector} placeholder="e.g. Automotive" />
          </label>
          <label className="field">
            <span className="field__label">Status</span>
            <input className="field__input" type="text" name="status" defaultValue={filters.status} placeholder="e.g. Active" />
          </label>
          <div className="filter-bar__actions">
            <button type="submit" className="btn btn--primary">Apply</button>
            <button type="button" className="btn btn--ghost" onClick={reset}>Clear</button>
          </div>
        </form>

        <DataBoundary
          loading={loading}
          error={error}
          isEmpty={partners.length === 0}
          onRetry={refetch}
          emptyTitle="No industry partners published yet"
          emptyMessage="Anchor Industry Partner records are published by the department."
          skeletonRows={4}
        >
          <div className="card-grid">
            {partners.map((aip) => (
              <article key={aip.id} className="record-card">
                <span className="badge">{formatStatus(aip.status)}</span>
                <h2 className="record-card__title">
                  <Link to={`/industry-partners/${aip.id}`}>{orPending(aip.name)}</Link>
                </h2>
                <p className="record-card__meta">
                  <span>{orPending(aip.sector)}</span>
                  {aip.cluster?.name && <span>{aip.cluster.name}</span>}
                </p>
                {aip.academic_partner && <span className="badge badge--muted">Academic Partner</span>}
                <Link className="record-card__link" to={`/industry-partners/${aip.id}`}>
                  View partner
                </Link>
              </article>
            ))}
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </DataBoundary>
      </div>
    </>
  )
}

export default IndustryPartners
