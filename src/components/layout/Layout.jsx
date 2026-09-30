import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import GovernmentHeader from './GovernmentHeader'
import Footer from './Footer'
import './Layout.css'

/**
 * Layout — the single shell every route renders inside.
 *
 * Previously each page imported <Header /> itself, which meant:
 *   · /about forgot to, so it rendered with no navigation at all
 *   · the header was remounted on every navigation
 * A layout route fixes both and gives every page the footer for free.
 */

/** Jumps to the top on navigation, but preserves in-page #anchors. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

const Layout = () => (
  <div className="app-shell">
    <ScrollToTop />
    <GovernmentHeader />
    <main id="main-content" className="app-main" tabIndex={-1}>
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default Layout