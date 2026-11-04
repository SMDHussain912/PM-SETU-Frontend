export function getRouteAccess({
  loading,
  isAuthenticated,
  user,
  roles,
  permissions,
}) {
  if (loading) return 'loading'
  if (!isAuthenticated) return 'unauthenticated'

  if (roles?.length) {
    const userRoles = user?.roles?.map((role) => role.code) ?? []
    if (!roles.some((role) => userRoles.includes(role))) return 'forbidden'
  }

  if (permissions?.length) {
    const userPermissions = user?.permissions ?? []
    if (!permissions.every((permission) => userPermissions.includes(permission))) {
      return 'forbidden'
    }
  }

  return 'allowed'
}
