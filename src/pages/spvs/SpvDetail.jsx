import { Link, useParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { getSpv } from '../../lib/endpoints'
import { orPending, formatStatus } from '../../lib/format'
import PageHeader from '../../components/common/PageHeader'
import RecordDetail from '../../components/common/RecordDetail'

/** SPV detail — plan §12. */
const SpvDetail = () => {
  const { spvId } = useParams()
  const { data, loading, error, refetch } = useApi(
    (signal) => getSpv(spvId, { signal }),
    [spvId],
  )

  return (
    <>
      <PageHeader
        title={orPending(data?.name)}
        lead="Special Purpose Vehicle — lifecycle status, cluster and Anchor Industry Partner."
        breadcrumb={[{ label: 'SPVs', to: '/spvs' }, { label: `SPV #${spvId}` }]}
      />

      <div className="container page-section">
        <RecordDetail
          loading={loading}
          error={error}
          onRetry={refetch}
          notFoundTitle="SPV not found"
          notFoundMessage="No SPV record exists for that reference."
          fields={
            data
              ? [
                  { label: 'SPV name', value: orPending(data.name) },
                  { label: 'Lifecycle status', value: formatStatus(data.status) },
                  { label: 'Cluster', value: data.cluster ? data.cluster.name : orPending(null) },
                  { label: 'Industry partner', value: data.aip ? data.aip.name : orPending(null) },
                ]
              : []
          }
        />
        <p className="page-note">
          <Link to="/spvs">Back to all SPVs</Link>
        </p>
      </div>
    </>
  )
}

export default SpvDetail
