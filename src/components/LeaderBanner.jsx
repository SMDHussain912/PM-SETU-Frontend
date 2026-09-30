import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getActiveBanner } from '../lib/endpoints'
import './LeaderBanner.css'
import cm from '../assets/cm.jpg'
import dcm from '../assets/dcm.jpg'
import pm from '../assets/pm.jpg'
import itMinister from '../assets/naralokesh.avif'

/* ── Official Leadership Banner ── plan §5 ──
   §5 requires this banner to be CMS-driven rather than hard-coded, so the
   headline and CTA are read from GET /banners/active (scheduled publish window,
   is_published, is_archived are all evaluated server-side).

   Protocol order is fixed by the department: Hon'ble PM → Hon'ble CM (AP) →
   Hon'ble DCM (AP) → Hon'ble IT Minister (AP). All photographs, names and
   designations must be department-approved before publication; the four below
   are the approved set and act as the fallback until the CMS publishes. */
const APPROVED_LEADERS = [
  { name: 'Narendra Modi', role: "Hon'ble Prime Minister of India", photo: pm },
  { name: 'Chandrababu Naidu', role: "Hon'ble Chief Minister, Andhra Pradesh", photo: cm },
  { name: 'Pawan Kalyan', role: "Hon'ble Deputy Chief Minister, Andhra Pradesh", photo: dcm },
  { name: 'Nara Lokesh', role: "Hon'ble Minister for IT, Andhra Pradesh", photo: itMinister },
]

/* §5 headline + CTA wording, used when no CMS banner is published. */
const DEFAULTS = {
  title: 'PM SETU – Andhra Pradesh',
  lead: 'Transforming Government ITIs through Industry Partnership, Modern Infrastructure and Employment-Oriented Skills',
  support:
    'Building industry-responsive ITIs through the Hub-and-Spoke model, Anchor Industry Partnerships, modern training infrastructure and future-ready skilling.',
  cta: null,
  url: null,
}

const LeaderBanner = () => {
  // CMS banner is optional: a failure here must NOT hide the leadership
  // banner, so errors fall back to the approved defaults silently.
  const { data: banner } = useApi((signal) => getActiveBanner({ signal }))

  const copy = {
    title: banner?.title || DEFAULTS.title,
    lead: DEFAULTS.lead,
    support: DEFAULTS.support,
    cta: banner?.cta_text,
    url: banner?.cta_url,
  }

  return (
    <section className="leader-banner" id="leadership">
      <div className="container leader-banner__inner">
        <div className="leader-banner__head">
          <h1 className="leader-banner__title">{copy.title}</h1>
          <p className="leader-banner__lead">{copy.lead}</p>
          <p className="leader-banner__support">{copy.support}</p>
        </div>

        {/* Leadership — protocol order, left → right */}
        <div className="leader-banner__grid">
          {APPROVED_LEADERS.map((leader) => (
            <figure className="leader-card" key={leader.name}>
              <div className="leader-card__photo">
                <img src={leader.photo} alt={leader.name} loading="lazy" />
              </div>
              <figcaption className="leader-card__caption">
                <span className="leader-card__name">{leader.name}</span>
                <span className="leader-card__role">{leader.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* CTA — §5 names these four; a published banner may add/replace one */}
        <div className="leader-banner__actions">
          {copy.cta && copy.url && (
            <Link className="btn btn--primary" to={copy.url}>
              {copy.cta}
            </Link>
          )}
          <Link className="btn btn--primary" to="/clusters">
            Explore AP Clusters
          </Link>
          <Link className="btn btn--secondary" to="/industry-partners">
            Industry Partnership / AIP
          </Link>
          <Link className="btn btn--secondary" to="/documents">
            View PM SETU Documents
          </Link>
          <Link className="btn btn--ghost" to="/dashboard">
            View Progress
          </Link>
        </div>

        <p className="leader-banner__disclaimer">
          Leadership photographs, names, designations and protocol order are
          published with departmental approval and may change without notice.
        </p>
      </div>
    </section>
  )
}

export default LeaderBanner
