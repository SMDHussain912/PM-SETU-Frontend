import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useListQuery } from '../hooks/useListQuery'
import { listDocuments } from '../lib/endpoints'
import { orPending, formatDate, formatBytes } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import DataBoundary from '../components/common/DataBoundary'
import Pagination from '../components/common/Pagination'

/**
 * GOs & Documents — plan §15, a Document Repository / DMS.
 *
 * Front-end filters the specification names: Document Type, Cluster, Year,
 * Department, Keyword, Date Range. The endpoint supports
 * ?type= ?department= ?from= ?to= ?year= ?cluster_id=
 * (Backend/sql/documents/document_queries.sql).
 */
const Documents = () => {
  // §15 names: Document Type, Cluster, Year, Department, Keyword, Date Range.
  // The endpoint's keyword param is singular: `keyword` (document.schema.ts).
  const { page, pageSize, filters, setFilters, setPage, reset } = useListQuery({
    type: '',
    cluster_id: '',
    year: '',
    department: '',
    keyword: '',
    from: '',
    to: '',
  })

  const { data, meta, loading, error, refetch } = useApi(
    (signal) => listDocuments({ ...filters, page, pageSize }, { signal }),
    [
      page,
      pageSize,
      filters.type,
      filters.cluster_id,
      filters.department,
      filters.year,
      filters.keyword,
      filters.from,
      filters.to,
    ],
  )

  const documents = Array.isArray(data) ? data : []

  return (
    <>
      <PageHeader
        title="Government Orders & Documents"
        lead="Government Orders, guidelines, and policy documents issued for the PM SETU programme in Andhra Pradesh."
        breadcrumb={[{ label: 'GOs & Documents' }]}
      />

      <div className="container page-section">
        <form
          className="filter-bar"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            setFilters({
              type: fd.get('type'),
              cluster_id: fd.get('cluster_id'),
              department: fd.get('department'),
              year: fd.get('year'),
              keyword: fd.get('keyword'),
              from: fd.get('from'),
              to: fd.get('to'),
            })
          }}
        >
          <label className="field">
            <span className="field__label">Document type</span>
            <input className="field__input" type="text" name="type" defaultValue={filters.type} placeholder="e.g. Government Order" />
          </label>
          <label className="field">
            <span className="field__label">Cluster ID</span>
            <input
              className="field__input"
              type="number"
              min="1"
              name="cluster_id"
              defaultValue={filters.cluster_id}
              placeholder="e.g. 1"
            />
          </label>
          <label className="field">
            <span className="field__label">Department</span>
            <input className="field__input" type="text" name="department" defaultValue={filters.department} />
          </label>
          <label className="field">
            <span className="field__label">Keyword</span>
            <input
              className="field__input"
              type="text"
              name="keyword"
              defaultValue={filters.keyword}
              placeholder="Search in title, number, keywords"
            />
          </label>
          <label className="field">
            <span className="field__label">Year</span>
            <input className="field__input" type="text" name="year" defaultValue={filters.year} placeholder="e.g. 2026" />
          </label>
          <label className="field">
            <span className="field__label">Issued from</span>
            <input className="field__input" type="date" name="from" defaultValue={filters.from} />
          </label>
          <label className="field">
            <span className="field__label">Issued to</span>
            <input className="field__input" type="date" name="to" defaultValue={filters.to} />
          </label>
          <div className="filter-bar__actions">
            <button type="submit" className="btn btn--primary">Apply</button>
            <button type="button" className="btn btn--ghost" onClick={reset}>Clear</button>
          </div>
        </form>

        <DataBoundary
          loading={loading}
          error={error}
          isEmpty={documents.length === 0}
          onRetry={refetch}
          emptyTitle="No documents published yet"
          emptyMessage="Government Orders and guidelines appear here once uploaded by the department."
          skeletonRows={4}
        >
          <ul className="doc-list">
            {documents.map((doc) => (
              <li key={doc.id} className="doc-list__item">
                <div className="doc-list__body">
                  <h2 className="doc-list__title">{orPending(doc.title)}</h2>
                  <p className="doc-list__meta">
                    {doc.type && <span className="badge badge--muted">{orPending(doc.type)}</span>}
                    {doc.document_number && <span>{doc.document_number}</span>}
                    {doc.department && <span>{doc.department}</span>}
                    {doc.issue_date && <span>{formatDate(doc.issue_date)}</span>}
                    {doc.file_size != null && <span>{formatBytes(doc.file_size)}</span>}
                  </p>
                </div>
                <Link className="btn btn--ghost doc-list__action" to="/documents">
                  Details
                </Link>
              </li>
            ))}
          </ul>
          <Pagination meta={meta} onPageChange={setPage} />
        </DataBoundary>
      </div>
    </>
  )
}

export default Documents
