import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useListQuery } from '../hooks/useListQuery'
import { listNews } from '../lib/endpoints'
import { orPending, formatDate } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import DataBoundary from '../components/common/DataBoundary'
import Pagination from '../components/common/Pagination'
import './News.css'

/**
 * News & Gallery — plan §16.
 * Event categories §16 lists: PM SETU Meetings, Industry Consultations,
 * Workshops, MoUs, Training Programmes, Inaugurations, Reviews, Cluster
 * Activities. The category vocabulary is still to be confirmed by the
 * department, so it is a free-text filter rather than a hard-coded dropdown.
 */
const News = () => {
  const { page, pageSize, filters, setFilters, setPage, reset } = useListQuery({
    category: '',
  })

  const { data, meta, loading, error, refetch } = useApi(
    (signal) => listNews({ ...filters, page, pageSize }, { signal }),
    [page, pageSize, filters.category],
  )

  const items = Array.isArray(data) ? data : []

  return (
    <>
      <PageHeader
        title="News & Gallery"
        lead="Latest updates, events, and media from PM SETU hubs and partner industries."
        breadcrumb={[{ label: 'News & Gallery' }]}
      />

      <div className="container page-section">
        <p className="page-toolbar">
          <Link className="btn btn--secondary" to="/gallery">
            Browse the media gallery
          </Link>
        </p>

        <form
          className="filter-bar"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            setFilters({ category: new FormData(e.currentTarget).get('category') })
          }}
        >
          <label className="field">
            <span className="field__label">Category</span>
            <input
              className="field__input"
              type="text"
              name="category"
              defaultValue={filters.category}
              placeholder="e.g. Inaugurations"
            />
          </label>
          <div className="filter-bar__actions">
            <button type="submit" className="btn btn--primary">Apply</button>
            <button type="button" className="btn btn--ghost" onClick={reset}>Clear</button>
          </div>
        </form>

        <DataBoundary
          loading={loading}
          error={error}
          isEmpty={items.length === 0}
          onRetry={refetch}
          emptyTitle="No news published yet"
          emptyMessage="News items appear here after departmental review and approval."
          skeletonRows={4}
        >
          <div className="card-grid">
            {items.map((item) => (
              <article key={item.id} className="record-card">
                {item.thumbnail_url && (
                  <img
                    className="news-thumb"
                    src={item.thumbnail_url}
                    alt={orPending(item.title)}
                    loading="lazy"
                  />
                )}
                {item.category && (
                  <span className="badge badge--muted">{orPending(item.category)}</span>
                )}
                <h2 className="record-card__title">
                  <Link to={`/news/${item.id}`}>{orPending(item.title)}</Link>
                </h2>
                {item.summary && <p className="record-card__desc">{item.summary}</p>}
                {item.published_date && (
                  <p className="record-card__meta">
                    <span>{formatDate(item.published_date)}</span>
                  </p>
                )}
                <Link className="record-card__link" to={`/news/${item.id}`}>
                  Read more
                </Link>
              </article>
            ))}
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </DataBoundary>
      </div>
    </>
  )
}

export default News
