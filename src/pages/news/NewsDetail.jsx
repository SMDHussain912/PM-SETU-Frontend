import { Link, useParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { getNews } from '../../lib/endpoints'
import { orPending, formatDate, formatBytes } from '../../lib/format'
import PageHeader from '../../components/common/PageHeader'
import RecordDetail from '../../components/common/RecordDetail'

/** News detail — plan §16. */
const NewsDetail = () => {
  const { newsId } = useParams()
  const { data, loading, error, refetch } = useApi(
    (signal) => getNews(newsId, { signal }),
    [newsId],
  )

  return (
    <>
      <PageHeader
        title={orPending(data?.title)}
        breadcrumb={[{ label: 'News & Gallery', to: '/news' }, { label: `Item #${newsId}` }]}
      />

      <div className="container page-section">
        <RecordDetail
          loading={loading}
          error={error}
          onRetry={refetch}
          notFoundTitle="News item not found"
          notFoundMessage="No news item exists for that reference."
          fields={
            data
              ? [
                  { label: 'Category', value: data.category || orPending(null) },
                  {
                    label: 'Published',
                    value: data.published_date ? formatDate(data.published_date) : orPending(null),
                  },
                  {
                    label: 'Expires',
                    value: data.expiry_date ? formatDate(data.expiry_date) : orPending(null),
                  },
                  {
                    label: 'Cluster',
                    value: data.cluster ? data.cluster.name : orPending(null),
                  },
                ]
              : []
          }
        >
          {data?.summary && <p className="article__summary">{data.summary}</p>}
          {data?.thumbnail_url && (
            <img
              className="article__image"
              src={data.thumbnail_url}
              alt={orPending(data.title)}
            />
          )}
          {data?.content && <div className="article__body">{data.content}</div>}

          {/* §16 "Attachments" */}
          {data?.attachments?.length > 0 && (
            <section className="article__attachments" aria-labelledby="attachments-heading">
              <h2 className="page-subtitle" id="attachments-heading">
                Attachments
              </h2>
              <ul className="doc-list">
                {data.attachments.map((file) => (
                  <li key={file.id ?? file.file_path} className="doc-list__item">
                    <div className="doc-list__body">
                      <p className="doc-list__title">
                        {orPending(file.file_name || file.file_path)}
                      </p>
                      <p className="doc-list__meta">
                        {file.mime_type && <span>{file.mime_type}</span>}
                        {file.file_size != null && <span>{formatBytes(file.file_size)}</span>}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </RecordDetail>

        <p className="page-note">
          <Link to="/news">Back to all news</Link>
        </p>
      </div>
    </>
  )
}

export default NewsDetail
