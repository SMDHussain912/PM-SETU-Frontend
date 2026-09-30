import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useListQuery } from '../hooks/useListQuery'
import { listClusters } from '../lib/endpoints'
import { orPending } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import DataBoundary from '../components/common/DataBoundary'
import Pagination from '../components/common/Pagination'

/**
 * AP Clusters — plan §9, "one of the core modules of the portal".
 *
 * §9 requires Map / List / District / Sector views. The map is Phase 4 (no
 * approved GIS service), so this is the list view with the district and sector
 * filters the endpoint actually supports
 * (Backend/sql/clusters/cluster_queries.sql: ?district= ?sector= ?search=).
 */
const Clusters = () => {
  const { page, pageSize, filters, setFilters, setPage, reset } = useListQuery({
    district: '',
    sector: '',
    search: '',
  })

  const { data, meta, loading, error, refetch } = useApi(
    (signal) => listClusters({ ...filters, page, pageSize }, { signal }),
    [page, pageSize, filters.district, filters.sector, filters.search],
  )

  const clusters = Array.isArray(data) ? data : []

  return (
    <>
      <PageHeader
        title="Andhra Pradesh Clusters"
        lead="Hub-and-Spoke ITI clusters across Andhra Pradesh, mapping every district with industry-relevant skill programmes."
        breadcrumb={[{ label: 'AP Clusters' }]}
      />

      <div className="container page-section">
        <form
          className="filter-bar"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            setFilters({
              district: data.get('district'),
              sector: data.get('sector'),
              search: data.get('search'),
            })
          }}
        >
          <label className="field">
            <span className="field__label">Search</span>
            <input
              className="field__input"
              type="search"
              name="search"
              defaultValue={filters.search}
              placeholder="Cluster name"
            />
          </label>

          <label className="field">
            <span className="field__label">District</span>
            <input
              className="field__input"
              type="text"
              name="district"
              defaultValue={filters.district}
              placeholder="e.g. Guntur"
            />
          </label>

          <label className="field">
            <span className="field__label">Sector</span>
            <input
              className="field__input"
              type="text"
              name="sector"
              defaultValue={filters.sector}
              placeholder="e.g. Electronics"
            />
          </label>

          <div className="filter-bar__actions">
            <button type="submit" className="btn btn--primary">
              Apply
            </button>
            <button type="button" className="btn btn--ghost" onClick={reset}>
              Clear
            </button>
          </div>
        </form>

        <DataBoundary
          loading={loading}
          error={error}
          isEmpty={clusters.length === 0}
          onRetry={refetch}
          emptyTitle="No clusters published yet"
          emptyMessage="Cluster records are published by the department. Try clearing the filters."
          skeletonRows={4}
        >
          <div className="card-grid">
            {clusters.map((cluster) => (
              <article key={cluster.id} className="record-card">
                <span className="badge">Cluster {cluster.id}</span>
                <h2 className="record-card__title">
                  <Link to={`/clusters/${cluster.id}`}>{orPending(cluster.name)}</Link>
                </h2>
                <p className="record-card__meta">
                  <span>{orPending(cluster.district)}</span>
                  <span>{orPending(cluster.sector)}</span>
                </p>
                <Link className="record-card__link" to={`/clusters/${cluster.id}`}>
                  View cluster
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

export default Clusters
