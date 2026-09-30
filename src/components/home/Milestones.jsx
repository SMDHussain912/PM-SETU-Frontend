import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { listNews } from '../../lib/endpoints'
import { orPending, formatDate } from '../../lib/format'
import DataBoundary from '../common/DataBoundary'
import Section from '../common/Section'

/**
 * AP Milestones — plan §32 item 6.
 *
 * Milestones are published by the department as news items in the MILESTONE
 * category (plan §16 lists "Reviews" and "Cluster Activities" among the event
 * categories; milestones are the department's own announcement feed).
 */
const Milestones = () => {
  const { data, loading, error, refetch } = useApi(
    (signal) => listNews({ category: 'MILESTONE', pageSize: 6 }, { signal }),
    ['milestone'],
  )

  const items = Array.isArray(data) ? data : []

  return (
    <Section id="milestones" title="Andhra Pradesh Milestones" tone="tinted">
      <DataBoundary
        loading={loading}
        error={error}
        isEmpty={items.length === 0}
        onRetry={refetch}
        emptyTitle="No milestones published yet"
        emptyMessage="Milestones appear here once the department publishes them."
        skeletonRows={2}
      >
        <ol className="milestone-list">
          {items.slice(0, 6).map((item, i) => (
            <li key={item.id ?? i} className="milestone">
              <p className="milestone__date">{formatDate(item.published_date)}</p>
              <h3 className="milestone__title">
                <Link to={`/news/${item.id}`}>{orPending(item.title)}</Link>
              </h3>
              {item.summary && <p className="milestone__desc">{item.summary}</p>}
            </li>
          ))}
        </ol>
      </DataBoundary>
    </Section>
  )
}

export default Milestones
