import { useApi } from '../../hooks/useApi'
import { getHomeKpis } from '../../lib/endpoints'
import { formatCurrencyINR } from '../../lib/format'
import DataBoundary from '../common/DataBoundary'
import Section from '../common/Section'
import StatCard from '../common/StatCard'
import DataAsOf from '../common/DataAsOf'
import './ApAtAGlance.css'

/**
 * AP at a Glance — plan §6, immediately after the leadership banner.
 *
 * Every counter comes from GET /home/kpis. Nothing is hard-coded: §6 states
 * "Do not hard-code numbers into the UI. All counters should be
 * API/database driven", and the backend types `trainees` and
 * `industries_engaged` as nullable because §25 defines no source for them.
 * Those render as an em dash with "no data source yet" (see StatCard).
 */
const ApAtAGlance = () => {
  const { data, loading, error, refetch } = useApi((signal) =>
    getHomeKpis({ signal }),
  )

  return (
    <Section
      id="at-a-glance"
      title="AP at a Glance"
      lead="Live programme counters, read from the PM SETU database."
      tone="tinted"
    >
      <DataBoundary
        loading={loading}
        error={error}
        onRetry={refetch}
        skeletonRows={2}
      >
        {() => (
          <>
            <div className="kpi-grid">
              <StatCard label="PM SETU Clusters" value={data.clusters} emphasis />
              <StatCard label="Hub ITIs" value={data.hub_itis} />
              <StatCard label="Spoke ITIs" value={data.spoke_itis} />
              <StatCard label="AIPs Onboarded" value={data.aips} />
              <StatCard label="SPVs Formed" value={data.spvs} />
              <StatCard label="SIPs Submitted" value={data.sip_submitted} />
              <StatCard label="SIPs Approved" value={data.sip_approved} />
              <StatCard
                label="Proposed Investment"
                value={data.investment}
                format={formatCurrencyINR}
              />
              <StatCard label="Trainees / Students" value={data.trainees} />
              <StatCard label="Industries Engaged" value={data.industries_engaged} />
            </div>

            <DataAsOf />

            <p className="kpi-note">
              Counters update when departmental records are published. A dash
              means the data source is not yet established &mdash; it does not
              mean zero.
            </p>
          </>
        )}
      </DataBoundary>
    </Section>
  )
}

export default ApAtAGlance
