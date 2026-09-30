import { Link } from 'react-router-dom'
import RecordPreview from './RecordPreview'
import { listAips, listSpvs, listDocuments, getLatestNews, listGalleryPhotos } from '../../lib/endpoints'
import { formatStatus, orPending, formatDate, formatBytes } from '../../lib/format'

/* Homepage preview bands for plan §32 items 8-13. Each one is a RecordPreview
   pointed at its own endpoint, so the loading/error/empty rules are shared. */

export const AipPreview = () => (
  <RecordPreview
    id="industry-partners"
    title="Industry Partners / AIPs"
    lead="Anchor Industry Partners co-design curricula and commit to apprenticeships and placements."
    fetcher={(signal) => listAips({ pageSize: 6 }, { signal })}
    viewAllTo="/industry-partners"
    emptyMessage="Anchor Industry Partner records are published by the department."
    renderCard={(aip) => (
      <>
        <span className="badge">{formatStatus(aip.status)}</span>
        <h3 className="record-card__title">{orPending(aip.name)}</h3>
        <p className="record-card__meta">
          <span>{orPending(aip.sector)}</span>
          {aip.cluster?.name && <span>{aip.cluster.name}</span>}
        </p>
        <Link className="record-card__link" to={`/industry-partners/${aip.id}`}>
          View partner
        </Link>
      </>
    )}
  />
)

export const SpvPreview = () => (
  <RecordPreview
    id="spv-status"
    title="SPV Status"
    lead="Special Purpose Vehicles move from Proposed through to Operational."
    fetcher={(signal) => listSpvs({ pageSize: 6 }, { signal })}
    viewAllTo="/spvs"
    emptyMessage="SPV lifecycle records are published by the department."
    renderCard={(spv) => (
      <>
        <span className="badge">{formatStatus(spv.status)}</span>
        <h3 className="record-card__title">{orPending(spv.name)}</h3>
        <p className="record-card__meta">
          {spv.cluster?.name && <span>{spv.cluster.name}</span>}
          {spv.aip?.name && <span>{spv.aip.name}</span>}
        </p>
        <Link className="record-card__link" to={`/spvs/${spv.id}`}>
          View SPV
        </Link>
      </>
    )}
  />
)

export const DocumentsPreview = () => (
  <RecordPreview
    id="documents"
    title="Government Orders & Documents"
    lead="Recent Government Orders, guidelines and circulars."
    fetcher={(signal) => listDocuments({ pageSize: 6 }, { signal })}
    viewAllTo="/documents"
    emptyMessage="Documents appear here once the department uploads them."
    renderCard={(doc) => (
      <>
        {doc.type && <span className="badge badge--muted">{orPending(doc.type)}</span>}
        <h3 className="record-card__title">{orPending(doc.title)}</h3>
        <p className="record-card__meta">
          {doc.document_number && <span>{doc.document_number}</span>}
          {doc.issue_date && <span>{formatDate(doc.issue_date)}</span>}
          {doc.file_size != null && <span>{formatBytes(doc.file_size)}</span>}
        </p>
        <Link className="record-card__link" to="/documents">
          View document
        </Link>
      </>
    )}
  />
)

export const NewsPreview = () => (
  <RecordPreview
    id="news"
    title="News & Events"
    lead="Latest updates from PM SETU hubs and partner industries."
    fetcher={(signal) => getLatestNews({ limit: 6 }, { signal })}
    viewAllTo="/news"
    emptyMessage="News items are published after departmental review and approval."
    deps={['latest']}
    renderCard={(item) => (
      <>
        {item.category && <span className="badge badge--muted">{orPending(item.category)}</span>}
        <h3 className="record-card__title">{orPending(item.title)}</h3>
        {item.summary && <p className="record-card__desc">{item.summary}</p>}
        {item.published_date && (
          <p className="record-card__meta">
            <span>{formatDate(item.published_date)}</span>
          </p>
        )}
        <Link className="record-card__link" to={`/news/${item.id}`}>
          Read more
        </Link>
      </>
    )}
  />
)

export const GalleryPreview = () => (
  <RecordPreview
    id="gallery"
    title="Gallery"
    lead="Photographs from PM SETU events, inaugurations and training programmes."
    fetcher={(signal) => listGalleryPhotos({ pageSize: 6 }, { signal })}
    viewAllTo="/gallery"
    emptyMessage="Photographs appear here once uploaded by the department."
    renderCard={(item) => (
      <>
        <h3 className="record-card__title">{orPending(item.title)}</h3>
        {item.media_url && (
          <img className="gallery-thumb" src={item.media_url} alt={orPending(item.title)} loading="lazy" />
        )}
        {item.published_date && (
          <p className="record-card__meta">
            <span>{formatDate(item.published_date)}</span>
          </p>
        )}
        <Link className="record-card__link" to="/gallery">
          View gallery
        </Link>
      </>
    )}
  />
)
