/**
 * The four async UI states from plan §7.3. Every data-driven block must render
 * exactly one of them, and must never substitute fabricated content for
 * "loading", "error" or "empty".
 *
 * `DataBoundary` decides between these for a whole section; the individual
 * states are exported for components that need them directly.
 */

export const LoadingState = ({ label = 'Loading…', rows = 3 }) => (
  <div className="state state--loading" role="status" aria-live="polite">
    <span className="visually-hidden">{label}</span>
    <div className="state__skeletons" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="state__skeleton" />
      ))}
    </div>
  </div>
)

export const ErrorState = ({ error, onRetry }) => {
  const message =
    error?.message ||
    'We could not reach the PM SETU service. Please try again shortly.'

  return (
    <div className="state state--error" role="alert">
      <p className="state__title">Unable to load this information</p>
      <p className="state__message">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export const EmptyState = ({ title = 'No records available', message }) => (
  <div className="state state--empty">
    <p className="state__title">{title}</p>
    {message && <p className="state__message">{message}</p>}
  </div>
)