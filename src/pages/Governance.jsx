import { useApi } from '../hooks/useApi'
import { useListQuery } from '../hooks/useListQuery'
import { listGovernanceMembers } from '../lib/endpoints'
import { orPending, formatDate } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import DataBoundary from '../components/common/DataBoundary'
import Pagination from '../components/common/Pagination'
import './Governance.css'

/**
 * Governance — plan §14.
 *
 * §14 says the public site "should present the governance hierarchy instead of
 * only photographs". The approved hierarchy is:
 *
 *   State Steering Committee -> Department -> PM SETU State PMU ->
 *   Cluster / SPV -> Hub ITI -> Spoke ITIs
 *
 * The API exposes the flat member directory; the six group-specific endpoints
 * §14 lists are deferred on the backend because the grouping mechanism is
 * unspecified, so the hierarchy is shown as the specification defines it and
 * the directory is rendered from live records.
 */
const HIERARCHY = [
  'State Steering Committee',
  'Department of Skill Development, IT & Innovation',
  'PM SETU State PMU',
  'Cluster / SPV',
  'Hub ITI',
  'Spoke ITIs',
]

/**
 * §14 names six governance pages. The API exposes one flat member directory
 * with a free-text `role`, so each section groups the members whose `role`
 * matches. A section with no matching members is reported as unpublished
 * rather than filled with invented officials.
 */
const GOVERNANCE_SECTIONS = [
  { id: 'steering-committee', title: 'State Steering Committee', match: /steering/i },
  { id: 'state-pmu', title: 'State PMU', match: /\bpmu\b|project management/i },
  { id: 'department-officers', title: 'Department Officers', match: /department|officer/i },
  { id: 'cluster-officers', title: 'Cluster Officers', match: /cluster/i },
  { id: 'spv-governance', title: 'SPV Governance', match: /\bspv\b|special purpose/i },
  { id: 'contact-directory', title: 'Contact Directory', match: /contact|directory|communication/i },
]

const Governance = () => {
  const { page, pageSize, setPage } = useListQuery({ pageSize: 25 })

  const { data, meta, loading, error, refetch } = useApi(
    (signal) => listGovernanceMembers({ page, pageSize }, { signal }),
    [page, pageSize],
  )

  const members = Array.isArray(data) ? data : []

  return (
    <>
      <PageHeader
        title="Governance"
        lead="Governance structure of PM SETU — steering committees, implementation agencies, and monitoring framework."
        breadcrumb={[{ label: 'Governance' }]}
      />

      <div className="container page-section">
        <h2 className="page-subtitle">Governance flow</h2>
        <ol className="gov-flow">
          {HIERARCHY.map((node) => (
            <li key={node} className="gov-flow__node">
              {node}
            </li>
          ))}
        </ol>

        <h2 className="page-subtitle">Governance directory</h2>
        <DataBoundary
          loading={loading}
          error={error}
          isEmpty={members.length === 0}
          onRetry={refetch}
          emptyTitle="Governance directory awaiting departmental confirmation"
          emptyMessage="Member records are published once the department confirms the directory."
          skeletonRows={4}
        >
          {GOVERNANCE_SECTIONS.map((section) => {
            const sectionMembers = members.filter(
              (m) => m.role && section.match.test(m.role),
            )
            return (
              <section
                key={section.id}
                id={section.id}
                className="gov-section"
                aria-labelledby={`${section.id}-heading`}
              >
                <h3 className="gov-section__title" id={`${section.id}-heading`}>
                  {section.title}
                </h3>

                {sectionMembers.length === 0 ? (
                  <p className="gov-section__empty">
                    No members published under this heading yet. Entries appear here
                    once the department publishes the corresponding records.
                  </p>
                ) : (
                  <div className="card-grid">
                    {sectionMembers.map((member) => (
                      <article key={member.id} className="record-card gov-card">
                        {member.photograph && (
                          <img
                            className="gov-card__photo"
                            src={member.photograph}
                            alt={orPending(member.name)}
                            loading="lazy"
                          />
                        )}
                        <h4 className="record-card__title">{orPending(member.name)}</h4>
                        <p className="record-card__meta">
                          {member.designation && <span>{orPending(member.designation)}</span>}
                        </p>
                        {member.organisation && (
                          <p className="record-card__desc">{orPending(member.organisation)}</p>
                        )}
                        {member.role && (
                          <span className="badge badge--muted">{orPending(member.role)}</span>
                        )}
                        {member.effective_date && (
                          <p className="record-card__meta">
                            <span>From {formatDate(member.effective_date)}</span>
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )
          })}

          <Pagination meta={meta} onPageChange={setPage} />
        </DataBoundary>
      </div>
    </>
  )
}

export default Governance
