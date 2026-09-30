/**
 * Pagination — renders the `meta` envelope from Backend/src/utils/pagination.ts:
 *   { page, pageSize, total, totalPages, hasNextPage, hasPreviousPage }
 *
 * Rendered only when there is more than one page, so single-page lists stay
 * uncluttered.
 */
const Pagination = ({ meta, onPageChange }) => {
  if (!meta || !meta.totalPages || meta.totalPages <= 1) return null

  const { page, totalPages, total, pageSize } = meta
  const first = (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <nav className="pagination" aria-label="Pagination">
      <p className="pagination__summary">
        Showing <strong>{first}</strong>&ndash;<strong>{last}</strong> of{' '}
        <strong>{total}</strong>
      </p>
      <div className="pagination__controls">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => onPageChange(page - 1)}
          disabled={!meta.hasPreviousPage}
        >
          Previous
        </button>
        <span className="pagination__page">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => onPageChange(page + 1)}
          disabled={!meta.hasNextPage}
        >
          Next
        </button>
      </div>
    </nav>
  )
}

export default Pagination
