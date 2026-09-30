import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { getStateDashboard } from '../../lib/endpoints'
import DataBoundary from '../common/DataBoundary'
import Section from '../common/Section'
import StatCard from '../common/StatCard'

/**
 * Implementation Dashboard preview — plan §32 item 11.
 *
 * Reads GET /dashboard/state. Plan §20 and the portal specification both say
 * NOT to build the Phase 3 dashboard before its source systems exist, so this
 * shows only the state-level counters the API actually serves and links to the
 * full dashboard. Metrics with no data source stay as em dashes.
 */
const DashboardPreview = () => {
  const { data, loading, error, refetch } = useApi((signal) =>
    getStateDashboard({ signal }),
  )

  return (
    <Section
      id="progress"
      title="Implementation Progress"
      lead="Programme progress across the state."
      action={
        <Link className="btn btn--secondary" to="/dashboard">
          View full dashboard
        </Link>
      }
    >
      <DataBoundary
        loading={loading}
        error={error}
        onRetry={refetch}
        skeletonRows={1}
      >
        {() => (
          <div className="kpi-grid">
            <StatCard label="Clusters" value={data.clusters} />
            <StatCard label="Hub ITIs" value={data.hub_itis} />
            <StatCard label="Spoke ITIs" value={data.spoke_itis} />
            <StatCard label="AIPs" value={data.aips} />
            <StatCard label="SPVs" value={data.spvs} />
            <StatCard label="SIPs Approved" value={data.sip_approved} />
          </div>
        )}
      </DataBoundary>
    </Section>
  )
}

export default DashboardPreview
