import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { getRouteAccess } from '../../lib/route-access'

const ProtectedRoute = ({ roles, permissions }) => {
  const { loading, isAuthenticated, user } = useAuth()
  const location = useLocation()
  const access = getRouteAccess({
    loading,
    isAuthenticated,
    user,
    roles,
    permissions,
  })

  if (access === 'loading') {
    return <div className="container page-section" role="status">Checking your official session…</div>
  }

  if (access === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (access === 'forbidden') {
    return <Navigate to="/official?access=denied" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
