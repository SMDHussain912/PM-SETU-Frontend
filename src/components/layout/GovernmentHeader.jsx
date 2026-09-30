import Emblem from '../common/Emblem'
import UtilityBar from './UtilityBar'
import MainNav from './MainNav'
import { useI18n } from '../../hooks/useI18n'
import './GovernmentHeader.css'

/**
 * GovernmentHeader — plan §4 "Header / Government Identity".
 *
 * Three bands: utility bar, brand bar (GoI | PM SETU | GoAP), primary nav.
 * The only <h1> on the page lives in the page body, not here — the brand name
 * is a plain styled element so each route keeps a single page-level heading.
 */
const GovernmentHeader = () => {
  const { t } = useI18n()

  return (
    <header className="gov-header">
      <UtilityBar />

      <div className="gov-header__brand">
        <div className="gov-header__identity">
          <Emblem which="goi" alt="National Emblem of India" />
          <div className="gov-header__identity-text">
            <p className="gov-header__gov-name">{t('util.govIndia')}</p>
            <p className="gov-header__ministry">{t('header.ministry')}</p>
          </div>
        </div>

        <div className="gov-header__title">
          <p className="gov-header__scheme">{t('header.scheme')}</p>
          <p className="gov-header__scheme-full">{t('header.schemeFull')}</p>
        </div>

        <div className="gov-header__identity gov-header__identity--state">
          <div className="gov-header__identity-text">
            <p className="gov-header__gov-name">{t('util.govAp')}</p>
            <p className="gov-header__ministry">{t('header.ministryAp')}</p>
          </div>
          <Emblem which="ap" alt="Andhra Pradesh Government Emblem" />
        </div>
      </div>

      <MainNav />
    </header>
  )
}

export default GovernmentHeader
