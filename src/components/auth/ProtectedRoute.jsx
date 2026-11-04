import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'

const ProtectedRoute = ({ roles, permissions }) => {
  const { loading, isAuthenticated, hasRole, hasPermission } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="container page-section" role="status">Checking your official session…</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles?.length && !hasRole(roles)) {
    return <Navigate to="/official?access=denied" replace />
  }

  if (permissions?.length && !permissions.every(hasPermission)) {
    return <Navigate to="/official?access=denied" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
