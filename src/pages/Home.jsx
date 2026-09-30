import { Link } from 'react-router-dom'
import { useSeo } from '../hooks/useSeo'

import LeaderBanner from '../components/LeaderBanner'
import ApAtAGlance from '../components/home/ApAtAGlance'
import AboutSection from '../components/home/AboutSection'
import PmsetuWorkflow from '../components/home/PmsetuWorkflow'
import Milestones from '../components/home/Milestones'
import ClusterMapSection from '../components/home/ClusterMapSection'
import DashboardPreview from '../components/home/DashboardPreview'
import {
  AipPreview,
  SpvPreview,
  DocumentsPreview,
  NewsPreview,
  GalleryPreview,
} from '../components/home/previews'
import './Home.css'

/** Quick links — the last homepage band before the footer (plan §32). */
const QUICK_LINKS = [
  { to: '/clusters', label: 'AP Clusters' },
  { to: '/industry-partners', label: 'Industry Partners / AIPs' },
  { to: '/spvs', label: 'SPVs' },
  { to: '/sips', label: 'Strategic Investment Plans' },
  { to: '/documents', label: 'GOs & Documents' },
  { to: '/governance', label: 'Governance' },
  { to: '/search', label: 'Search the portal' },
  { to: '/contact', label: 'Contact the PM SETU Cell' },
]

/**
 * Home — the plan §32 homepage sequence, in the order the specification fixes:
 *
 *   1  Government Header          (Layout)
 *   2  Leadership Banner          PM / CM / DCM / IT Minister
 *   3  AP at a Glance             GET /home/kpis
 *   4  About PM SETU
 *   5  How PM SETU Works          9-step workflow
 *   6  AP Milestones             GET /news?category=MILESTONE
 *   7  AP Cluster Map             Phase 4 GIS placeholder, clearly labelled
 *   8  Industry Partners / AIPs   GET /aips
 *   9  SPV Status                 GET /spvs
 *   10 GOs & Documents            GET /documents
 *   11 Implementation Dashboard   GET /dashboard/state
 *   12 News & Events              GET /news/latest
 *   13 Gallery                    GET /gallery/photos
 *   14 Quick Links / Contact      (footer in Layout)
 *
 * Every dynamic band reads from the API. No number, cluster, partner,
 * document, news item or photograph is hard-coded in this file.
 */
const Home = () => {
  useSeo({
    title: 'Home',
    description:
      'PM SETU – Andhra Pradesh: transforming Government ITIs through industry partnership, modern infrastructure and employment-oriented skills.',
  })

  return (
  <>
    <LeaderBanner />
    <ApAtAGlance />
    <AboutSection />
    <PmsetuWorkflow />
    <Milestones />
    <ClusterMapSection />
    <AipPreview />
    <SpvPreview />
    <DocumentsPreview />
    <DashboardPreview />
    <NewsPreview />
    <GalleryPreview />

    <section className="section" id="quick-links">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">Quick Links</h2>
        </div>
        <ul className="quick-links">
          {QUICK_LINKS.map((link) => (
            <li key={link.to}>
              <Link className="quick-link" to={link.to}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </>
  )
}

export default Home
