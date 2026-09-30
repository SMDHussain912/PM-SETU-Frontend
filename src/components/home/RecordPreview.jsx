import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import DataBoundary from '../common/DataBoundary'
import Section from '../common/Section'

/**
 * RecordPreview — the repeated "latest N records + View all" band used by the
 * homepage sections for AIPs, SPVs, documents, news and gallery (plan §32
 * items 8, 9, 10, 12, 13).
 *
 * One component, five data sources: each section differs only in the fetcher
 * and how a record renders, so a separate component per section would be five
 * copies of the same loading/error/empty logic.
 */
const RecordPreview = ({
  id,
  title,
  lead,
  fetcher,
  renderCard,
  viewAllTo,
  viewAllLabel = 'View all',
  emptyTitle = 'No records published yet',
  emptyMessage,
  pageSize = 6,
  deps = [],
  tone,
}) => {
  const { data, loading, error, refetch } = useApi(fetcher, [...deps, pageSize])

  const records = Array.isArray(data) ? data : []

  return (
    <Section id={id} title={title} lead={lead} tone={tone}>
      <DataBoundary
        loading={loading}
        error={error}
        isEmpty={records.length === 0}
        onRetry={refetch}
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        skeletonRows={2}
      >
        <div className="card-grid">
          {records.slice(0, pageSize).map((record, i) => (
            <div key={record?.id ?? i} className="record-card">
              {renderCard(record)}
            </div>
          ))}
        </div>

        <p className="preview-more">
          <Link className="btn btn--secondary" to={viewAllTo}>
            {viewAllLabel}
          </Link>
        </p>
      </DataBoundary>
    </Section>
  )
}

export default RecordPreview
