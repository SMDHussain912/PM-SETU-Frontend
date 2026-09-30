import { useApi } from '../hooks/useApi'
import {
  getStateDashboard,
  getFinanceDashboard,
  getTrainingDashboard,
  getPlacementsDashboard,
} from '../lib/endpoints'
import { formatCurrencyINR, formatCount, PENDING_HINT } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import DataBoundary from '../components/common/DataBoundary'
import StatCard from '../components/common/StatCard'
import DataAsOf from '../components/common/DataAsOf'
import './Dashboard.css'

/**
 * Implementation Monitoring Dashboard — plan §20.
 *
 * §20 requires four groups: Physical Progress, Academic Progress, Industry
 * Outcomes and Financial Progress. The API currently serves state, clusters,
 * finance, training and placements. Anything without a data source is shown as
 * an em dash, never an invented percentage — the portal specification is
 * explicit: "Do NOT build this based only on fake/static numbers" (§49).
 *
 * The State -> Cluster -> Hub ITI -> Spoke ITI drill-down is a Phase 3
 * deliverable and is deliberately absent rather than stubbed.
 */

/** Renders a labelled metric row; a null value shows the pending dash. */
const MetricRow = ({ items }) => (
  <ul className="metric-list">
    {items.map(({ label, value, format = formatCount }) => {
      const pending = value === null || value === undefined
      return (
        <li key={label} className="metric" title={pending ? PENDING_HINT : undefined}>
          <span className="metric__label">{label}</span>
          <span className="metric__value">
            {format(value)}
            {pending && <span className="metric__pending">no data source</span>}
          </span>
        </li>
      )
    })}
  </ul>
)

const Dashboard = () => {
  const state = useApi((signal) => getStateDashboard({ signal }))
  const finance = useApi((signal) => getFinanceDashboard({ signal }))
  const training = useApi((signal) => getTrainingDashboard({ signal }))
  const placements = useApi((signal) => getPlacementsDashboard({ signal }))

  return (
    <>
      <PageHeader
        title="Implementation Dashboard"
        lead="Live progress tracking for ITIs, trainees, placements, and anchor industry partnerships across Andhra Pradesh."
        breadcrumb={[{ label: 'Dashboard' }]}
      />

      <div className="container page-section">
        <DataAsOf />

        <p className="dash-disclaimer">
          Values are read from the PM SETU database. A dash means the source
          system for that measure is not yet connected &mdash; it does not mean zero.
        </p>

        <section className="dash-group">
          <h2 className="page-subtitle">State overview</h2>
          <DataBoundary
            loading={state.loading}
            error={state.error}
            onRetry={state.refetch}
            skeletonRows={1}
          >
            {() => (
            <div className="kpi-grid">
              <StatCard label="Clusters" value={state.data.clusters} />
              <StatCard label="Hub ITIs" value={state.data.hub_itis} />
              <StatCard label="Spoke ITIs" value={state.data.spoke_itis} />
              <StatCard label="AIPs" value={state.data.aips} />
              <StatCard label="SPVs" value={state.data.spvs} />
              <StatCard label="SIPs Approved" value={state.data.sip_approved} />
            </div>
            )}
          </DataBoundary>
        </section>

        <section className="dash-group">
          <h2 className="page-subtitle">Financial progress</h2>
          <DataBoundary
            loading={finance.loading}
            error={finance.error}
            onRetry={finance.refetch}
            skeletonRows={1}
          >
            {() => <MetricRow
              items={[
                { label: 'Total investment mobilised', value: finance.data.total_investment, format: formatCurrencyINR },
                { label: 'Total SIP proposed', value: finance.data.total_sip_proposed, format: formatCurrencyINR },
              ]}
            />}
          </DataBoundary>
        </section>

        <section className="dash-group">
          <h2 className="page-subtitle">Academic progress</h2>
          <DataBoundary
            loading={training.loading}
            error={training.error}
            onRetry={training.refetch}
            skeletonRows={1}
          >
            {() => (
              <MetricRow
                items={[{ label: 'Total student capacity', value: training.data.total_student_capacity }]}
              />
            )}
          </DataBoundary>
        </section>

        <section className="dash-group">
          <h2 className="page-subtitle">Industry outcomes</h2>
          <DataBoundary
            loading={placements.loading}
            error={placements.error}
            onRetry={placements.refetch}
            skeletonRows={1}
          >
            {() => <p className="page-note">{placements.data?.message}</p>}
          </DataBoundary>
        </section>

        <section className="dash-group">
          <h2 className="page-subtitle">Physical progress</h2>
          <MetricRow
            items={[
              { label: 'Civil works %', value: null },
              { label: 'Equipment procurement %', value: null },
              { label: 'Equipment installation %', value: null },
              { label: 'Labs established', value: null },
              { label: 'Smart classrooms', value: null },
            ]}
          />
        </section>
      </div>
    </>
  )
}

export default Dashboard
