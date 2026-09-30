import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { useListQuery } from '../hooks/useListQuery'
import { listGalleryPhotos, listGalleryVideos } from '../lib/endpoints'
import { formatDate } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import DataBoundary from '../components/common/DataBoundary'
import Pagination from '../components/common/Pagination'

/**
 * Media Gallery — plan §16: Photo Gallery, Video Gallery, Press Releases.
 * Two endpoints back the two tabs (GET /gallery/photos and /gallery/videos);
 * press releases live in the news module and are linked from /news.
 */
const Gallery = () => {
  const [tab, setTab] = useState('PHOTO')
  const { page, pageSize, setPage } = useListQuery({ pageSize: 24 })

  const { data, meta, loading, error, refetch } = useApi(
    (signal) =>
      tab === 'PHOTO'
        ? listGalleryPhotos({ page, pageSize }, { signal })
        : listGalleryVideos({ page, pageSize }, { signal }),
    [tab, page, pageSize],
  )

  const items = Array.isArray(data) ? data : []

  return (
    <>
      <PageHeader
        title="Media Gallery"
        lead="Photographs and videos from PM SETU hubs, partner industries and training programmes."
        breadcrumb={[{ label: 'News & Gallery', to: '/news' }, { label: 'Gallery' }]}
      />

      <div className="container page-section">
        <div className="tabs" role="tablist" aria-label="Gallery type">
          {[
            { key: 'PHOTO', label: 'Photo Gallery' },
            { key: 'VIDEO', label: 'Video Gallery' },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={tab === t.key ? 'tab is-active' : 'tab'}
              onClick={() => {
                setTab(t.key)
                setPage(1)
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <DataBoundary
          loading={loading}
          error={error}
          isEmpty={items.length === 0}
          onRetry={refetch}
          emptyTitle={`No ${tab === 'PHOTO' ? 'photographs' : 'videos'} published yet`}
          emptyMessage="Media items appear here once uploaded by the department."
          skeletonRows={4}
        >
          <ul className="gallery-grid">
            {items.map((item) => (
              <li key={item.id} className="gallery-item">
                {item.media_url && tab === 'PHOTO' ? (
                  <img src={item.media_url} alt={item.title ?? "Gallery item"} loading="lazy" />
                ) : item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title ?? "Gallery item"} loading="lazy" />
                ) : (
                  <span className="gallery-item__placeholder">No preview</span>
                )}
                <p className="gallery-item__caption">{item.title ?? "Untitled item"}</p>
                {item.published_date && (
                  <p className="gallery-item__date">{formatDate(item.published_date)}</p>
                )}
              </li>
            ))}
          </ul>
          <Pagination meta={meta} onPageChange={setPage} />
        </DataBoundary>
      </div>
    </>
  )
}

export default Gallery
