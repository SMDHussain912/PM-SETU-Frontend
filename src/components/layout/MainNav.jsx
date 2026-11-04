import { NavLink } from 'react-router-dom'
import { PRIMARY_NAV } from '../../config/navigation'
import { useI18n } from '../../hooks/useI18n'
import { useAuth } from '../../context/AuthProvider'
import './MainNav.css'

const MainNav = () => {
  const { t } = useI18n()
  const { isAuthenticated, hasRole } = useAuth()
  const canOpenAdmin = hasRole(['super_admin', 'state_pmu_admin', 'det_content_admin', 'approving_authority'])

  return (
    <nav className="main-nav" aria-label="Primary">
      <ul className="main-nav__list">
        {PRIMARY_NAV.map((item) => (
          <li key={item.to} className="main-nav__item">
            <NavLink to={item.to} end={item.end}
              className={({ isActive }) => isActive ? 'main-nav__link is-active' : 'main-nav__link'}>
              {t(item.i18nKey)}
            </NavLink>
          </li>
        ))}
        {canOpenAdmin && <li className="main-nav__auth-item">
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'main-nav__auth-link is-active' : 'main-nav__auth-link'}>Administration</NavLink>
        </li>}
        <li className="main-nav__auth-item">
          <NavLink to={isAuthenticated ? '/official' : '/login'}
            className={({ isActive }) => `main-nav__auth-link${isActive ? ' is-active' : ''}`}>
            {isAuthenticated ? 'Official workspace' : 'Official login'}
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default MainNav
