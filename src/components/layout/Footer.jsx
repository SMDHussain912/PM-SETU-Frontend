import { Link } from 'react-router-dom'
import Emblem from '../common/Emblem'
import { useI18n } from '../../hooks/useI18n'
import './Footer.css'

/**
 * Footer — plan §26 requires Copyright, Hyperlink and Privacy policies, and
 * §32 puts "Quick Links / Contact / Footer" last in the homepage sequence.
 * The previous build had .footer CSS but rendered no footer anywhere.
 */
const QUICK_LINKS = [
  { to: '/about', label: 'About PM SETU' },
  { to: '/clusters', label: 'AP Clusters' },
  { to: '/industry-partners', label: 'Industry Partners / AIPs' },
  { to: '/spvs', label: 'SPVs' },
  { to: '/sips', label: 'Strategic Investment Plans' },
  { to: '/documents', label: 'GOs & Documents' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/search', label: 'Search' },
]

const POLICY_LINKS = [
  { to: '/policy/accessibility', label: 'Accessibility Statement' },
  { to: '/policy/privacy', label: 'Privacy Policy' },
  { to: '/policy/terms', label: 'Terms of Use' },
  { to: '/policy/copyright', label: 'Copyright Policy' },
  { to: '/policy/hyperlink', label: 'Hyperlink Policy' },
  { to: '/policy/content', label: 'Content Contribution / Review Policy' },
]

const Footer = () => {
  const { t } = useI18n()

  return (
  <footer className="site-footer">
    <div className="container site-footer__grid">
      <div className="site-footer__brand">
        <Emblem which="goi" alt="" className="site-footer__emblem" />
        <p className="site-footer__name">PM SETU &ndash; Andhra Pradesh</p>
        <p className="site-footer__tagline">{t('footer.tagline')}</p>
      </div>

      <nav className="site-footer__col" aria-label="Quick links">
        <h2 className="site-footer__heading">{t('footer.quickLinks')}</h2>
        <ul className="site-footer__list">
          {QUICK_LINKS.map((l) => (
            <li key={l.to}>
              <Link className="site-footer__link" to={l.to}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="site-footer__col" aria-label="Policies">
        <h2 className="site-footer__heading">{t('footer.policies')}</h2>
        <ul className="site-footer__list">
          {POLICY_LINKS.map((l) => (
            <li key={l.to}>
              <Link className="site-footer__link" to={l.to}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="site-footer__col">
        <h2 className="site-footer__heading">{t('footer.contact')}</h2>
        <address className="site-footer__address">
          PM SETU Cell
          <br />
          Dept. of Skill Development, IT &amp; Innovation
          <br />
          Government of Andhra Pradesh
        </address>
        <Link className="site-footer__link" to="/contact">
          Contact us
        </Link>
      </div>
    </div>

    <div className="site-footer__bottom">
      <div className="container site-footer__bottom-inner">
        <p>
          &copy; {new Date().getFullYear()} Government of Andhra Pradesh.{' '}
          {t('footer.rights')}
        </p>
        <Link className="site-footer__link" to="/sitemap">
          Sitemap
        </Link>
      </div>
    </div>
  </footer>
  )
}

export default Footer