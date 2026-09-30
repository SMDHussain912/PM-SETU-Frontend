import { Link } from 'react-router-dom'
import { PRIMARY_NAV } from '../config/navigation'
import { useSeo } from '../hooks/useSeo'

/**
 * Sitemap — required by plan §4 as a utility function, and it is the honest
 * way to list every public route: the detail routes (:id) are data-dependent
 * and are listed as patterns rather than as invented links.
 */
const DETAIL_ROUTES = [
  { path: '/clusters/{clusterId}', label: 'Cluster detail' },
  { path: '/industry-partners/{aipId}', label: 'Anchor Industry Partner detail' },
  { path: '/spvs/{spvId}', label: 'SPV detail' },
  { path: '/sips/{sipId}', label: 'SIP detail' },
  { path: '/news/{newsId}', label: 'News detail' },
]

const Sitemap = () => {
  useSeo({ title: 'Sitemap', description: 'All public sections of the PM SETU – Andhra Pradesh portal.' })

  return (
  <div className="container page-section">
    <h1>Sitemap</h1>
    <p className="page-note">
      All public sections of the PM SETU &ndash; Andhra Pradesh portal.
    </p>

    <h2>Main sections</h2>
    <ul className="sitemap-list">
      {PRIMARY_NAV.map((item) => (
        <li key={item.to}>
          <Link to={item.to}>{item.label}</Link>
        </li>
      ))}
      <li>
        <Link to="/gallery">Gallery</Link>
      </li>
      <li>
        <Link to="/sips">Strategic Investment Plans (SIP)</Link>
      </li>
      <li>
        <Link to="/search">Search</Link>
      </li>
    </ul>

    <h2>Record pages</h2>
    <p className="page-note">
      These pages are generated from published records and are reached from the
      listings above.
    </p>
    <ul className="sitemap-list sitemap-list--plain">
      {DETAIL_ROUTES.map((item) => (
        <li key={item.path}>
          <code>{item.path}</code> &mdash; {item.label}
        </li>
      ))}
    </ul>

    <h2>Policies</h2>
    <ul className="sitemap-list">
      <li>
        <Link to="/policy/accessibility">Accessibility Statement</Link>
      </li>
      <li>
        <Link to="/policy/privacy">Privacy Policy</Link>
      </li>
      <li>
        <Link to="/policy/terms">Terms of Use</Link>
      </li>
      <li>
        <Link to="/policy/copyright">Copyright Policy</Link>
      </li>
      <li>
        <Link to="/policy/hyperlink">Hyperlink Policy</Link>
      </li>
      <li>
        <Link to="/policy/content">Content Contribution / Review Policy</Link>
      </li>
    </ul>
  </div>
  )
}

export default Sitemap