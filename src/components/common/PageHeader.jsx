import { Link } from 'react-router-dom'
import { useSeo } from '../../hooks/useSeo'

/**
 * PageHeader — breadcrumb + a single page-level <h1>.
 *
 * Plan §26 requires proper heading hierarchy. Previously GovernmentHeader and
 * LeadershipBanner both rendered <h1>, so pages had two top-level headings.
 * The brand name is now a styled <p>; the <h1> lives here, once per page.
 *
 * It also drives per-page SEO, because every page's title and lead text pass
 * through here — so metadata cannot drift out of sync with the visible heading.
 */
const PageHeader = ({ title, lead, breadcrumb = [] }) => {
  useSeo({ title, description: lead })

  return (
    <div className="container page-header">
    {breadcrumb.length > 0 && (
      <nav className="page-header__breadcrumb" aria-label="Breadcrumb">
        <ol className="page-header__crumbs">
          <li>
            <Link to="/">Home</Link>
          </li>
          {breadcrumb.map((crumb, i) => {
            const last = i === breadcrumb.length - 1
            return (
              <li key={crumb.label}>
                <span className="page-header__sep" aria-hidden="true">
                  ›
                </span>
                {crumb.to && !last ? (
                  <Link to={crumb.to}>{crumb.label}</Link>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )}

    <h1 className="page-header__title">{title}</h1>
    {lead && <p className="page-header__lead">{lead}</p>}
    </div>
  )
}

export default PageHeader