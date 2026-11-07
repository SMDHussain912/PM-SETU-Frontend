import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useListQuery } from '../hooks/useListQuery'
import { listSips } from '../lib/endpoints'
import { formatStatus, formatCurrencyINR, formatDate } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import DataBoundary from '../components/common/DataBoundary'
import Pagination from '../components/common/Pagination'
import PortalSearchBox from '../components/common/PortalSearchBox'
import './SIPs.css'

/**
 * Strategic Investment Plans — plan §13.
 * Workflow: Draft -> Submitted -> Under Scrutiny -> Revision Requested ->
 * Recommended -> Approved -> Implementation.
 *
 * The visual overview is explanatory only. Financial amounts and SIP status
 * continue to come exclusively from the published API records.
 */
const WORKFLOW = [
  { label: 'Draft', description: 'Plan prepared' },
  { label: 'Submitted', description: 'Sent for review' },
  { label: 'Under scrutiny', description: 'Being examined' },
  { label: 'Revision requested', description: 'Changes required' },
  { label: 'Recommended', description: 'Recommended for approval' },
  { label: 'Approved', description: 'Approval granted' },
  { label: 'Implementation', description: 'Plan being carried out' },
]

const CONTRIBUTIONS = [
  { title: 'Infrastructure', description: 'Facilities, buildings and improvements required by the cluster.', symbol: '01' },
  { title: 'Equipment', description: 'Machinery, tools and technology for practical training.', symbol: '02' },
  { title: 'Training', description: 'Training delivery and capability development.', symbol: '03' },
  { title: 'Industry contribution', description: 'Investment and support committed by industry partners.', symbol: '04' },
  { title: 'Government contribution', description: 'Government funding and support recorded in the plan.', symbol: '05' },
]

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

      <div className="container page-section sips-page">
        <PortalSearchBox />
        <section className="sips-intro" aria-labelledby="sips-intro-title">
          <div className="sips-intro__copy">
            <span className="sips-eyebrow">PLANNING · CONTRIBUTION · IMPLEMENTATION</span>
            <h2 id="sips-intro-title">Turning cluster priorities into investment plans</h2>
            <p>Each Strategic Investment Plan brings together the proposed investment, contribution responsibilities and approval progress for a cluster and its industry partner.</p>
            <a className="sips-intro__link" href="#published-sips">Explore published plans <span aria-hidden="true">↓</span></a>
          </div>
          <div className="sips-intro__visual" aria-hidden="true">
            <svg viewBox="0 0 260 190" role="presentation">
              <path className="sips-visual__backdrop" d="M31 147 58 37h143l28 110Z" />
              <path className="sips-visual__building" d="M66 145V82l64-34 64 34v63Z" />
              <path className="sips-visual__roof" d="m54 84 76-41 76 41" />
              <path className="sips-visual__line" d="M84 96h20v49H84zm42-1h20v50h-20zm42 1h20v49h-20z" />
              <path className="sips-visual__base" d="M53 147h154m-142 9h130" />
              <circle className="sips-visual__coin" cx="205" cy="45" r="22" />
              <path className="sips-visual__coin-mark" d="M205 33v24m-7-18h10a5 5 0 0 1 0 10h-7a5 5 0 0 0 0 10h11" />
              <path className="sips-visual__spark" d="M39 45v12m-6-6h12" />
            </svg>
          </div>
        </section>

        <section className="sips-overview" aria-labelledby="sips-overview-title">
          <div className="sips-section-heading">
            <div>
              <h2 id="sips-overview-title">What does an SIP cover?</h2>
              <p>Investment planning is organised around five contribution areas.</p>
            </div>
          </div>
          <div className="sips-contribution-grid">
            {CONTRIBUTIONS.map((item) => (
              <article className="sips-contribution" key={item.title}>
                <span className="sips-contribution__number">{item.symbol}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <p className="sips-data-note">Actual amounts and commitments are shown only when they are present in a published SIP record.</p>
        </section>

        <section className="sips-workflow" aria-labelledby="sips-workflow-title">
          <div className="sips-section-heading">
            <div>
              <h2 id="sips-workflow-title">SIP approval journey</h2>
              <p>Follow the plan through its seven documented workflow stages.</p>
            </div>
          </div>
          <ol className="sips-timeline">
            {WORKFLOW.map((stage, index) => (
              <li className="sips-timeline__step" key={stage.label}>
                <span className="sips-timeline__number">{String(index + 1).padStart(2, '0')}</span>
                <span className="sips-timeline__text">
                  <strong>{stage.label}</strong>
                  <span>{stage.description}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section id="published-sips" className="sips-records" aria-labelledby="published-sips-title">
          <div className="sips-section-heading sips-section-heading--records">
            <div>
              <h2 id="published-sips-title">Published investment plans</h2>
              <p>Review available plans, their linked cluster and industry partner, and current status.</p>
            </div>
          </div>
          <DataBoundary
            loading={loading}
            error={error}
            isEmpty={sips.length === 0}
            onRetry={refetch}
            emptyTitle="No SIPs published yet"
            emptyMessage="Strategic Investment Plans will appear here once they are published through the department's approval workflow. The overview above explains the investment areas and review stages."
            skeletonRows={4}
          >
            <div className="sips-card-grid">
              {sips.map((sip) => (
                <article key={sip.id} className="sips-record-card">
                  <div className="sips-record-card__top">
                    <span className="sips-record-card__ref">SIP #{sip.id}</span>
                    <span className="badge">{formatStatus(sip.status)}</span>
                  </div>
                  <h3 className="sips-record-card__title">
                    <Link to={`/sips/${sip.id}`}>Strategic Investment Plan #{sip.id}</Link>
                  </h3>
                  <div className="sips-record-card__meta">
                    {sip.cluster?.name && <span><strong>Cluster</strong>{sip.cluster.name}</span>}
                    {sip.aip?.name && <span><strong>Industry partner</strong>{sip.aip.name}</span>}
                    {sip.submission_date && <span><strong>Submitted</strong>{formatDate(sip.submission_date)}</span>}
                  </div>
                  {sip.proposed_investment != null && (
                    <div className="sips-record-card__investment">
                      <span>Proposed investment</span>
                      <strong>{formatCurrencyINR(Number(sip.proposed_investment))}</strong>
                    </div>
                  )}
                  <Link className="sips-record-card__link" to={`/sips/${sip.id}`}>View plan details <span aria-hidden="true">→</span></Link>
                </article>
              ))}
            </div>
            <Pagination meta={meta} onPageChange={setPage} />
          </DataBoundary>
        </section>
      </div>
    </>
  )
}

export default SIPs
