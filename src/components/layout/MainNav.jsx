import { NavLink } from 'react-router-dom'
import { PRIMARY_NAV } from '../../config/navigation'
import { useI18n } from '../../hooks/useI18n'
import './MainNav.css'

/**
 * MainNav — primary navigation (plan §2).
 * Active state comes from NavLink. The previous Header hard-coded
 * `className="nav-item active"` on Home, so the highlight never moved.
 */
const MainNav = () => {
  const { t } = useI18n()

  return (
    <nav className="main-nav" aria-label="Primary">
      <ul className="main-nav__list">
        {PRIMARY_NAV.map((item) => (
          <li key={item.to} className="main-nav__item">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'main-nav__link is-active' : 'main-nav__link'
              }
            >
              {t(item.i18nKey)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MainNav
