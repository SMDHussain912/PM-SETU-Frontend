import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useListQuery } from '../hooks/useListQuery'
import { listSpvs } from '../lib/endpoints'
import { orPending, formatStatus } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import DataBoundary from '../components/common/DataBoundary'
import Pagination from '../components/common/Pagination'

/**
 * SPVs — plan §12. Lifecycle: Proposed -> Under Formation -> Incorporated ->
 * Operational, so each card reports a status rather than showing blanks.
 * No list filters are specified for this endpoint (sql/spvs/spv_queries.sql).
 */
const SPVs = () => {
  const { page, pageSize, setPage } = useListQuery({ pageSize: 20 })

  const { data, meta, loading, error, refetch } = useApi(
    (signal) => listSpvs({ page, pageSize }, { signal }),
    [page, pageSize],
  )

  const spvs = Array.isArray(data) ? data : []

  return (
    <>
      <PageHeader
        title="Special Purpose Vehicles (SPVs)"
        lead="Special Purpose Vehicles that drive the Hub-and-Spoke model and anchor industry participation across clusters."
        breadcrumb={[{ label: 'SPVs' }]}
      />

      <div className="container page-section">
        <DataBoundary
          loading={loading}
          error={error}
          isEmpty={spvs.length === 0}
          onRetry={refetch}
          emptyTitle="No SPVs published yet"
          emptyMessage="SPV records are published by the department as they move through their lifecycle."
          skeletonRows={4}
        >
          <div className="card-grid">
            {spvs.map((spv) => (
              <article key={spv.id} className="record-card">
                <span className="badge">{formatStatus(spv.status)}</span>
                <h2 className="record-card__title">
                  <Link to={`/spvs/${spv.id}`}>{orPending(spv.name)}</Link>
                </h2>
                <p className="record-card__meta">
                  {spv.cluster?.name && <span>{spv.cluster.name}</span>}
                  {spv.aip?.name && <span>{spv.aip.name}</span>}
                </p>
                <Link className="record-card__link" to={`/spvs/${spv.id}`}>
                  View SPV
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

export default SPVs
