import { Link, useParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { getCluster, getClusterItis } from '../../lib/endpoints'
import { orPending } from '../../lib/format'
import PageHeader from '../../components/common/PageHeader'
import RecordDetail from '../../components/common/RecordDetail'
import DataBoundary from '../../components/common/DataBoundary'

/**
 * Cluster detail — plan §9.
 *
 * §9 specifies the tab strip: Overview | ITIs | AIP | SPV | SIP |
 * Infrastructure | Courses | Progress | Documents | Gallery.
 *
 * The API currently serves only /:id and /:id/itis; the backend defers
 * /:id/summary, /:id/aip, /:id/spv, /:id/sip and /map because their grouping
 * mechanism is unspecified. The full strip is therefore rendered with the tabs
 * that have no data source marked as pending, rather than silently dropped —
 * a visitor can see what the specification requires and what is not yet live.
 */
const TABS = [
  { id: 'overview', label: 'Overview', available: true },
  { id: 'itis', label: 'ITIs', available: true },
  { id: 'aip', label: 'AIP', available: false },
  { id: 'spv', label: 'SPV', available: false },
  { id: 'sip', label: 'SIP', available: false },
  { id: 'infrastructure', label: 'Infrastructure', available: false },
  { id: 'courses', label: 'Courses', available: false },
  { id: 'progress', label: 'Progress', available: false },
  { id: 'documents', label: 'Documents', available: false },
  { id: 'gallery', label: 'Gallery', available: false },
]
const ClusterDetail = () => {
  const { clusterId } = useParams()

  const cluster = useApi((signal) => getCluster(clusterId, { signal }), [clusterId])
  const itis = useApi((signal) => getClusterItis(clusterId, { signal }), [clusterId])

  const list = Array.isArray(itis.data) ? itis.data : []

  return (
    <>
      <PageHeader
        title={orPending(cluster.data?.name)}
        lead="Cluster profile — hub ITI, spoke ITIs, district, sector focus, AIP, SPV, SIP status and investment."
        breadcrumb={[
          { label: 'AP Clusters', to: '/clusters' },
          { label: `Cluster #${clusterId}` },
        ]}
      />

      <div className="container page-section">
        <RecordDetail
          loading={cluster.loading}
          error={cluster.error}
          onRetry={cluster.refetch}
          notFoundTitle="Cluster not found"
          notFoundMessage="No cluster record exists for that reference."
          fields={
            cluster.data
              ? [
                  { label: 'Cluster number', value: cluster.data.id },
                  { label: 'Name', value: orPending(cluster.data.name) },
                  { label: 'District', value: orPending(cluster.data.district) },
                  { label: 'Sector focus', value: orPending(cluster.data.sector) },
                ]
              : []
          }
        />

        <div className="tabs" role="tablist" aria-label="Cluster sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className={tab.available ? 'tab is-active' : 'tab tab--pending'}
              aria-selected={tab.available}
              disabled={!tab.available}
              title={tab.available ? undefined : 'Pending — this section is not yet connected to a data source'}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <h2 className="page-subtitle">Hub &amp; Spoke ITIs</h2>
        <DataBoundary
          loading={itis.loading}
          error={itis.error}
          isEmpty={list.length === 0}
          onRetry={itis.refetch}
          emptyTitle="No ITIs published for this cluster"
          emptyMessage="Hub and spoke ITI records are published by the department."
          skeletonRows={3}
        >
          <ul className="iti-list">
            {list.map((iti) => (
              <li key={iti.id} className="iti-list__item">
                <span className="badge">{iti.type}</span>
                <span className="iti-list__name">{orPending(iti.iti_name)}</span>
                <span className="iti-list__code">{orPending(iti.iti_code)}</span>
                <span className="iti-list__district">{orPending(iti.district)}</span>
              </li>
            ))}
          </ul>
        </DataBoundary>

        <p className="page-note">
          <Link to="/clusters">Back to all clusters</Link>
        </p>
      </div>
    </>
  )
}

export default ClusterDetail
