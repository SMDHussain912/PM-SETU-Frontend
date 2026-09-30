import { Link, useParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { getSip } from '../../lib/endpoints'
import { orPending, formatStatus, formatCurrencyINR, formatDate } from '../../lib/format'
import PageHeader from '../../components/common/PageHeader'
import RecordDetail from '../../components/common/RecordDetail'

/**
 * SIP detail — plan §13.
 * Workflow: Draft -> Submitted -> Under Scrutiny -> Revision Requested ->
 * Recommended -> Approved -> Implementation.
 */
const SipDetail = () => {
  const { sipId } = useParams()
  const { data, loading, error, refetch } = useApi(
    (signal) => getSip(sipId, { signal }),
    [sipId],
  )

  const money = (v) => (v == null ? orPending(null) : formatCurrencyINR(Number(v)))

  return (
    <>
      <PageHeader
        title={`Strategic Investment Plan #${sipId}`}
        lead="Proposed investment, industry and government contributions, and approval status."
        breadcrumb={[
          { label: 'Strategic Investment Plans', to: '/sips' },
          { label: `SIP #${sipId}` },
        ]}
      />

      <div className="container page-section">
        <RecordDetail
          loading={loading}
          error={error}
          onRetry={refetch}
          notFoundTitle="SIP not found"
          notFoundMessage="No Strategic Investment Plan exists for that reference."
          fields={
            data
              ? [
                  { label: 'Status', value: formatStatus(data.status) },
                  { label: 'Cluster', value: data.cluster ? data.cluster.name : orPending(null) },
                  { label: 'Industry partner', value: data.aip ? data.aip.name : orPending(null) },
                  {
                    label: 'Submission date',
                    value: data.submission_date ? formatDate(data.submission_date) : orPending(null),
                  },
                  { label: 'Version', value: data.version ?? orPending(null) },
                  { label: 'Proposed investment', value: money(data.proposed_investment) },
                  { label: 'Infrastructure', value: money(data.infrastructure_contribution) },
                  { label: 'Equipment', value: money(data.equipment_contribution) },
                  { label: 'Training', value: money(data.training_contribution) },
                  { label: 'Industry contribution', value: money(data.industry_contribution) },
                  { label: 'Government contribution', value: money(data.government_contribution) },
                  {
                    label: 'Approval date',
                    value: data.approval_date ? formatDate(data.approval_date) : orPending(null),
                  },
                  { label: 'Remarks', value: data.remarks || orPending(null) },
                ]
              : []
          }
        />
        <p className="page-note">
          <Link to="/sips">Back to all SIPs</Link>
        </p>
      </div>
    </>
  )
}

export default SipDetail
