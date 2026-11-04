import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import { useAuth } from '../context/AuthProvider'
import { api } from '../lib/api'
import './AdminDashboard.css'

const AUDIT_ROLES = ['super_admin', 'approving_authority']

const AdminDashboard = () => {
  const { user, hasRole } = useAuth()
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [activity, setActivity] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const canReadAudit = hasRole(AUDIT_ROLES)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setErrors({})
    const requests = [
      ['users', () => api.get('/admin/users', { page: 1, pageSize: 8 })],
      ['roles', () => api.get('/admin/roles')],
      ['permissions', () => api.get('/admin/permissions')],
    ]
    if (canReadAudit) requests.push(['activity', () => api.get('/admin/audit-logs', { page: 1, pageSize: 8 })])
    const results = await Promise.all(requests.map(async ([key, request]) => {
      try { return [key, await request(), null] }
      catch (error) { return [key, null, error.message || 'Unable to load this section.'] }
    }))
    const nextErrors = {}
    for (const [key, response, error] of results) {
      if (error) nextErrors[key] = error
      else if (key === 'users') setUsers(response.data || [])
      else if (key === 'roles') setRoles(response.data || [])
      else if (key === 'permissions') setPermissions(response.data || [])
      else if (key === 'activity') setActivity(response.data || [])
    }
    setErrors(nextErrors)
    setLoading(false)
  }, [canReadAudit])

  useEffect(() => { loadDashboard() }, [loadDashboard])

  return (
    <>
      <PageHeader title="Administration" lead="Manage official access, roles and programme operations."
        breadcrumb={[{ label: 'Administration' }]} />
      <div className="container page-section admin-dashboard">
        <section className="admin-welcome">
          <div>
            <p className="admin-kicker">PM SETU · ADMINISTRATION</p>
            <h2>Welcome, {user?.full_name || user?.username}</h2>
            <p>Signed in as {user?.roles?.map((role) => role.name).join(', ') || 'authorised official'}.</p>
          </div>
          <div className="admin-actions">
            <button className="btn btn--ghost" type="button" onClick={loadDashboard} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh data'}
            </button>
            <Link className="btn btn--primary" to="/official">Account & profile</Link>
          </div>
        </section>

        <section className="admin-stats" aria-label="Administration summary">
          <article className="admin-stat"><span>Official accounts</span><strong>{loading ? '—' : users.length}</strong><small>Latest accounts returned</small></article>
          <article className="admin-stat"><span>System roles</span><strong>{loading ? '—' : roles.length}</strong><small>Configured role definitions</small></article>
          <article className="admin-stat"><span>Permissions</span><strong>{loading ? '—' : permissions.length}</strong><small>Available permission codes</small></article>
          {canReadAudit && <article className="admin-stat"><span>Recent audit entries</span><strong>{loading ? '—' : activity.length}</strong><small>Latest records returned</small></article>}
        </section>

        <section className="admin-section">
          <div className="admin-section-heading"><div><h2>Administration modules</h2><p>Open the relevant workspace to manage the portal.</p></div></div>
          <div className="admin-module-grid">
            <Link to="/official#accounts-title" className="admin-module">
              <span className="admin-module-icon">♙</span><strong>User management</strong>
              <small>Create accounts and review assigned roles and account status.</small>
            </Link>
            <article className="admin-module">
              <span className="admin-module-icon">⬡</span><strong>Roles & permissions</strong>
              <small>{roles.length} roles and {permissions.length} permissions are available through the backend. Dedicated editor UI is the next module to build.</small>
            </article>
            {canReadAudit && <article className="admin-module">
              <span className="admin-module-icon">◷</span><strong>Audit activity</strong>
              <small>Review recorded business actions, actor IDs, affected records and request context.</small>
            </article>}
            <article className="admin-module">
              <span className="admin-module-icon">✓</span><strong>Approvals</strong>
              <small>Approval endpoints exist in the API. A complete workflow interface is not connected yet.</small>
            </article>
            <article className="admin-module">
              <span className="admin-module-icon">▤</span><strong>Content management</strong>
              <small>News, documents, gallery and banner administration APIs are available; their management screens remain to be implemented.</small>
            </article>
            <article className="admin-module">
              <span className="admin-module-icon">⌁</span><strong>API access monitoring</strong>
              <small>Request logs currently appear in backend server logs. A searchable access-log API and UI are not implemented.</small>
            </article>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading"><div><h2>Official accounts</h2><p>Latest accounts with their assigned roles.</p></div><Link to="/official">Manage accounts →</Link></div>
          {errors.users ? <p className="admin-error">{errors.users}</p> : (
            <div className="admin-table-wrap"><table className="admin-table">
              <thead><tr><th>Name</th><th>Username</th><th>Assigned roles</th><th>Status</th></tr></thead>
              <tbody>{users.map((item) => <tr key={item.id}>
                <td>{item.full_name}</td><td>{item.username}</td>
                <td>{item.roles?.map((role) => role.name).join(', ') || 'No role assigned'}</td>
                <td><span className={item.status === 'ACTIVE' ? 'admin-status is-active' : 'admin-status'}>{item.status}</span></td>
              </tr>)}
              {!loading && users.length === 0 && <tr><td colSpan="4">No accounts returned.</td></tr>}
              </tbody>
            </table></div>
          )}
        </section>

        <section className="admin-section">
          <div className="admin-section-heading"><div><h2>Roles & permissions</h2><p>Current RBAC catalogue.</p></div></div>
          {errors.roles || errors.permissions ? <p className="admin-error">{errors.roles || errors.permissions}</p> : (
            <div className="admin-role-grid">{roles.map((role) => <article className="admin-role" key={role.id}>
              <strong>{role.name}</strong><code>{role.code}</code>
              <small>{role.description || 'No description supplied'}</small>
              {role.is_system && <span className="admin-system-tag">System role</span>}
            </article>)}</div>
          )}
        </section>

        {canReadAudit && <section className="admin-section">
          <div className="admin-section-heading"><div><h2>Recent audit activity</h2><p>Business actions recorded by trusted backend services.</p></div></div>
          {errors.activity ? <p className="admin-error">{errors.activity}</p> : (
            <div className="admin-table-wrap"><table className="admin-table">
              <thead><tr><th>Time</th><th>Actor ID</th><th>Action</th><th>Entity</th><th>Record</th></tr></thead>
              <tbody>{activity.map((entry) => <tr key={entry.id}>
                <td>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '—'}</td>
                <td>{entry.user_id}</td><td>{entry.action}</td><td>{entry.entity}</td><td>{entry.entity_id}</td>
              </tr>)}
              {!loading && activity.length === 0 && <tr><td colSpan="5">No audit entries returned. Audit coverage depends on backend services writing events.</td></tr>}
              </tbody>
            </table></div>
          )}
        </section>}
      </div>
    </>
  )
}

export default AdminDashboard
