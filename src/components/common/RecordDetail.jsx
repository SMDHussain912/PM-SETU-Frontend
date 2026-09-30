import DataBoundary from './DataBoundary'

/**
 * RecordDetail — the shared shell for a single-record page
 * (cluster, AIP, SPV, SIP, news item).
 *
 * Handles the three states a detail page can be in, which differ per entity:
 *   · loading
 *   · not found — the API returns 404 RECORD_NOT_FOUND for a missing id
 *   · loaded
 *
 * `fields` is an array of { label, value } so each entity controls its own
 * presentation without duplicating the boundary logic.
 */
const RecordDetail = ({
  loading,
  error,
  fields,
  children,
  notFoundTitle,
  notFoundMessage,
  onRetry,
}) => {
  const notFound = error?.code === 'RECORD_NOT_FOUND' || error?.status === 404

  return (
    <DataBoundary
      loading={loading}
      error={error}
      onRetry={onRetry}
      emptyTitle={notFound ? notFoundTitle : undefined}
      emptyMessage={notFound ? notFoundMessage : undefined}
      isEmpty={notFound}
    >
      {fields?.length > 0 && (
        <dl className="detail-list">
          {fields.map(({ label, value }) => (
            <div key={label} className="detail-list__row">
              <dt className="detail-list__label">{label}</dt>
              <dd className="detail-list__value">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {children}
    </DataBoundary>
  )
}

export default RecordDetail
