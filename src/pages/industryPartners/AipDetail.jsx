import { Link, useParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { getAip } from '../../lib/endpoints'
import { orPending, formatStatus, formatCurrencyINR } from '../../lib/format'
import PageHeader from '../../components/common/PageHeader'
import RecordDetail from '../../components/common/RecordDetail'

/** AIP detail — plan §11. */
const AipDetail = () => {
  const { aipId } = useParams()
  const { data, loading, error, refetch } = useApi(
    (signal) => getAip(aipId, { signal }),
    [aipId],
  )

  return (
    <>
      <PageHeader
        title={orPending(data?.name)}
        lead="Company profile — sector, assigned cluster, partnership status, proposed investment and focus areas."
        breadcrumb={[
          { label: 'Industry Partners / AIPs', to: '/industry-partners' },
          { label: `Partner #${aipId}` },
        ]}
      />

      <div className="container page-section">
        <RecordDetail
          loading={loading}
          error={error}
          onRetry={refetch}
          notFoundTitle="Partner not found"
          notFoundMessage="No industry partner record exists for that reference."
          fields={
            data
              ? [
                  { label: 'Company', value: orPending(data.name) },
                  { label: 'Sector', value: orPending(data.sector) },
                  { label: 'Partnership status', value: formatStatus(data.status) },
                  { label: 'Cluster', value: data.cluster ? data.cluster.name : orPending(null) },
                  {
                    label: 'Academic / technology partner',
                    value: data.academic_partner ? 'Yes' : 'No',
                  },
                  {
                    label: 'Proposed investment',
                    value:
                      data.investment_amount == null
                        ? orPending(null)
                        : formatCurrencyINR(Number(data.investment_amount)),
                  },
                  { label: 'Website', value: data.website || orPending(null) },
                ]
              : []
          }
        />
        <p className="page-note">
          <Link to="/industry-partners">Back to all partners</Link>
        </p>
      </div>
    </>
  )
}

export default AipDetail
