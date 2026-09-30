import { LoadingState, ErrorState, EmptyState } from '../states'

/**
 * DataBoundary — the single place the four states from plan §7.3 are decided.
 *
 * Every data-driven block in the portal renders through this, so the rules
 * cannot be forgotten per page:
 *   · loading  -> skeleton, never stale content
 *   · error    -> message + retry, never fallback numbers
 *   · empty    -> "nothing published yet", never invented placeholder rows
 *   · success  -> the children
 *
 * `isEmpty` must be derived from the payload (usually `data?.length === 0`).
 * An empty array is a valid success, not an error, and not a loading state.
 *
 * IMPORTANT: pass children as a FUNCTION when they read the payload.
 *
 *   <DataBoundary loading={loading} error={error} isEmpty={!data}>
 *     {(d) => <StatCard value={d.clusters} />}      correct
 *   </DataBoundary>
 *
 * Plain JSX children are evaluated during the PARENT's render, when `data` is
 * still null on the first pass — so `data.clusters` throws before this
 * component can render its loading state. The function form defers evaluation
 * until the request has actually succeeded.
 */
const DataBoundary = ({
  loading,
  error,
  isEmpty = false,
  onRetry,
  emptyTitle = 'No records available',
  emptyMessage,
  skeletonRows = 3,
  children,
}) => {
  if (loading) return <LoadingState rows={skeletonRows} />
  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (isEmpty) return <EmptyState title={emptyTitle} message={emptyMessage} />

  return typeof children === 'function' ? children() : children
}

export default DataBoundary
