import { Link, useLocation } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'

/**
 * NotFound — plan §6 route table. Previously an unknown URL rendered a blank
 * <div id="root"> because no catch-all route existed.
 */
const NotFound = () => {
  const { pathname } = useLocation()

  return (
    <>
      <PageHeader title="Page not found" />
      <div className="container page-section not-found">
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <p className="not-found__message">
          We could not find{' '}
          <code className="not-found__path">{pathname}</code> on the PM SETU
          &ndash; Andhra Pradesh portal.
        </p>
        <p className="not-found__hint">
          The page may have been moved, or the address may be mistyped.
        </p>
        <div className="not-found__actions">
          <Link className="btn btn--primary" to="/">
            Back to Home
          </Link>
          <Link className="btn btn--secondary" to="/sitemap">
            View sitemap
          </Link>
          <Link className="btn btn--ghost" to="/contact">
            Report a broken link
          </Link>
        </div>
      </div>
    </>
  )
}

export default NotFound