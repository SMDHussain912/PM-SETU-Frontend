import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useListQuery } from '../hooks/useListQuery'
import { listSips } from '../lib/endpoints'
import { formatStatus, formatCurrencyINR, formatDate } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import DataBoundary from '../components/common/DataBoundary'
import Pagination from '../components/common/Pagination'

/**
 * Strategic Investment Plans — plan §13.
 * Workflow: Draft -> Submitted -> Under Scrutiny -> Revision Requested ->
 * Recommended -> Approved -> Implementation.
 */
const SIPs = () => {
  const { page, pageSize, setPage } = useListQuery({ pageSize: 20 })

  const { data, meta, loading, error, refetch } = useApi(
    (signal) => listSips({ page, pageSize }, { signal }),
    [page, pageSize],
  )

  const sips = Array.isArray(data) ? data : []

  return (
    <>
      <PageHeader
        title="Strategic Investment Plans (SIP)"
        lead="SIPs capture proposed investment, industry and government contributions, and approval status for each cluster and Anchor Industry Partner."
        breadcrumb={[{ label: 'Strategic Investment Plans' }]}
      />

      <div className="container page-section">
        <DataBoundary
          loading={loading}
          error={error}
          isEmpty={sips.length === 0}
          onRetry={refetch}
          emptyTitle="No SIPs published yet"
          emptyMessage="Strategic Investment Plans appear here once they pass the approval workflow."
          skeletonRows={4}
        >
          <div className="card-grid">
            {sips.map((sip) => (
              <article key={sip.id} className="record-card">
                <span className="badge">{formatStatus(sip.status)}</span>
                <h2 className="record-card__title">
                  <Link to={`/sips/${sip.id}`}>SIP #{sip.id}</Link>
                </h2>
                <p className="record-card__meta">
                  {sip.cluster?.name && <span>{sip.cluster.name}</span>}
                  {sip.aip?.name && <span>{sip.aip.name}</span>}
                  {sip.submission_date && <span>{formatDate(sip.submission_date)}</span>}
                </p>
                {sip.proposed_investment != null && (
                  <p className="record-card__desc">
                    Proposed: {formatCurrencyINR(Number(sip.proposed_investment))}
                  </p>
                )}
                <Link className="record-card__link" to={`/sips/${sip.id}`}>
                  View SIP
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

export default SIPs
