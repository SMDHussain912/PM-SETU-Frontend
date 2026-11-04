import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import { useAuth } from '../context/AuthProvider'
import { api } from '../lib/api'
import AdminContentWorkspace from './AdminContentWorkspace'
import UserScopeManager from './UserScopeManager'
import './AdminDashboard.css'

const TABS = [
  ['overview', 'Overview'],
  ['users', 'User management'],
  ['roles', 'Roles & permissions'],
  ['approvals', 'Approvals'],
  ['audit', 'Audit logs'],
  ['content', 'Content & communications'],
]
const TRANSITIONS = {
  SUBMITTED: ['review'],
  UNDER_REVIEW: ['approve', 'reject', 'request-revision'],
  RECOMMENDED: ['approve', 'reject'],
  PENDING: ['submit'],
  REVISION_REQUESTED: ['submit'],
}
const ACTION_LABELS = { review: 'Start review', approve: 'Approve', reject: 'Reject', 'request-revision': 'Request revision', submit: 'Submit' }

const emptyUser = { username: '', full_name: '', email: '', password: '', role_ids: [] }
const emptyRole = { code: '', name: '', description: '', permission_ids: [] }

function ErrorMessage({ children }) {
  return children ? <p className="admin-error" role="alert">{children}</p> : null
}
function Notice({ children }) {
  return children ? <p className="admin-notice" role="status">{children}</p> : null
}
function Field({ label, children }) {
  return <label className="admin-field"><span>{label}</span>{children}</label>
}

const AdminDashboard = () => {
  const { user, hasRole } = useAuth()
  const [tab, setTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [approvals, setApprovals] = useState([])
  const [audit, setAudit] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [userForm, setUserForm] = useState(emptyUser)
  const [editingUser, setEditingUser] = useState(null)
  const [scopeUser, setScopeUser] = useState(null)
  const [roleForm, setRoleForm] = useState(emptyRole)
  const [editingRole, setEditingRole] = useState(null)
  const [remarks, setRemarks] = useState({})
  const [filters, setFilters] = useState({ status: '', search: '', approvalStatus: '', auditAction: '', auditEntity: '' })
  const isSuperAdmin = hasRole(['super_admin'])
  const canReadAudit = hasRole(['super_admin', 'approving_authority'])
  const canReadApprovals = hasRole(['super_admin', 'state_pmu_admin', 'approving_authority'])
  const canManageUsers = hasRole(['super_admin', 'state_pmu_admin'])
  const canManageRoles = isSuperAdmin
  const canManageContent = hasRole(['super_admin', 'state_pmu_admin', 'det_content_admin'])
  const canManageContact = hasRole(['super_admin', 'state_pmu_admin'])
  const canWriteApprovals = hasRole(['super_admin', 'state_pmu_admin', 'det_content_admin', 'approving_authority'])

  const loadUsers = useCallback(async () => {
    const response = await api.get('/admin/users', { page: 1, pageSize: 100, ...(filters.status ? { status: filters.status } : {}), ...(filters.search ? { search: filters.search } : {}) })
    setUsers(response.data || [])
  }, [filters.status, filters.search])
  const loadRoles = useCallback(async () => {
    const [roleResponse, permissionResponse] = await Promise.all([api.get('/admin/roles'), api.get('/admin/permissions')])
    setRoles(roleResponse.data || [])
    setPermissions(permissionResponse.data || [])
  }, [])
  const loadApprovals = useCallback(async () => {
    const response = await api.get('/admin/approvals', { page: 1, pageSize: 100, ...(filters.approvalStatus ? { status: filters.approvalStatus } : {}) })
    setApprovals(response.data || [])
  }, [filters.approvalStatus])
  const loadAudit = useCallback(async () => {
    const response = await api.get('/admin/audit-logs', { page: 1, pageSize: 100, ...(filters.auditAction ? { action: filters.auditAction } : {}), ...(filters.auditEntity ? { entity: filters.auditEntity } : {}) })
    setAudit(response.data || [])
  }, [filters.auditAction, filters.auditEntity])

  const refresh = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const jobs = []
      if (canManageUsers) jobs.push(loadUsers())
      if (canManageRoles) jobs.push(loadRoles())
      if (canReadApprovals) jobs.push(loadApprovals())
      if (canReadAudit) jobs.push(loadAudit())
      await Promise.all(jobs)
    } catch (e) { setError(e.message || 'Unable to load administration data.') }
    finally { setLoading(false) }
  }, [canManageUsers, canManageRoles, canReadApprovals, canReadAudit, loadUsers, loadRoles, loadApprovals, loadAudit])

  useEffect(() => { refresh() }, [refresh])

  const stats = useMemo(() => [
    ['Official accounts', users.length],
    ['System roles', roles.length],
    ['Permissions', permissions.length],
    ['Open approvals', approvals.filter((item) => !['APPROVED', 'REJECTED'].includes(item.status)).length],
  ], [users, roles, permissions, approvals])

  const runAction = async (action, successMessage) => {
    setError(''); setNotice('')
    try { await action(); setNotice(successMessage); await refresh() }
    catch (e) { setError(e.message || 'The action could not be completed.') }
  }

  const saveUser = async (event) => {
    event.preventDefault()
    const payload = { full_name: userForm.full_name.trim(), email: userForm.email.trim() || '' }
    if (editingUser) {
      await runAction(async () => {
        await api.patch(`/admin/users/${editingUser.id}`, payload)
        await api.patch(`/admin/users/${editingUser.id}/roles`, { role_ids: userForm.role_ids })
        setEditingUser(null); setUserForm(emptyUser)
      }, 'User account updated.')
    } else {
      await runAction(async () => {
        await api.post('/admin/users', { ...userForm, username: userForm.username.trim(), full_name: payload.full_name, email: payload.email, role_ids: userForm.role_ids })
        setUserForm(emptyUser)
      }, 'Official account created.')
    }
  }

  const startEditUser = (item) => {
    setEditingUser(item)
    setUserForm({ username: item.username, full_name: item.full_name || '', email: item.email || '', password: '', role_ids: (item.roles || []).map((role) => role.id) })
    setTab('users')
  }

  const saveRole = async (event) => {
    event.preventDefault()
    await runAction(async () => {
      const payload = { name: roleForm.name.trim(), description: roleForm.description, permission_ids: roleForm.permission_ids }
      if (editingRole) await api.patch(`/admin/roles/${editingRole.id}`, payload)
      else await api.post('/admin/roles', { ...payload, code: roleForm.code.trim() })
      setEditingRole(null); setRoleForm(emptyRole)
    }, editingRole ? 'Role updated.' : 'Role created.')
  }

  const editRole = async (role) => {
    setError('')
    try {
      const response = await api.get(`/admin/roles/${role.id}`)
      const fullRole = response.data
      setEditingRole(fullRole)
      setRoleForm({ code: fullRole.code, name: fullRole.name, description: fullRole.description || '', permission_ids: permissions.filter((p) => (fullRole.permissions || []).includes(p.code)).map((p) => p.id) })
    } catch (e) { setError(e.message || 'Unable to load role details.') }
  }

  const transitionApproval = async (item, action) => {
    await runAction(async () => {
      await api.post(`/admin/approvals/${item.id}/${action}`, { ...(remarks[item.id]?.trim() ? { remarks: remarks[item.id].trim() } : {}) })
      setRemarks((current) => ({ ...current, [item.id]: '' }))
    }, `Approval #${item.id}: ${ACTION_LABELS[action]} completed.`)
  }

  return (
    <>
      <PageHeader title="Administration" lead="Manage PM SETU accounts, access, approvals and operational records." breadcrumb={[{ label: 'Administration' }]} />
      <div className="container page-section admin-dashboard">
        <section className="admin-welcome">
          <div><p className="admin-kicker">PM SETU · ADMINISTRATION CENTRE</p><h2>Welcome, {user?.full_name || user?.username}</h2><p>Signed in with {(user?.roles || []).map((role) => role.name).join(', ') || 'an authorised role'}.</p></div>
          <div className="admin-actions"><button className="btn btn--ghost" type="button" onClick={refresh} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh data'}</button><Link className="btn btn--ghost" to="/official">Account & profile</Link></div>
        </section>
        <ErrorMessage>{error}</ErrorMessage><Notice>{notice}</Notice>
        <nav className="admin-tabs" aria-label="Administration sections">
          {TABS.filter(([id]) => id === 'overview' || (id === 'users' && canManageUsers) || (id === 'roles' && canManageRoles) || (id === 'approvals' && canReadApprovals) || (id === 'audit' && canReadAudit) || (id === 'content' && (canManageContent || canManageContact))).map(([id, label]) => <button key={id} type="button" className={tab === id ? 'is-active' : ''} onClick={() => setTab(id)}>{label}</button>)}
        </nav>

        {tab === 'overview' && <>
          <section className="admin-stats">{stats.map(([label, value]) => <article className="admin-stat" key={label}><span>{label}</span><strong>{loading ? '—' : value}</strong><small>Current accessible records</small></article>)}</section>
          <section className="admin-section"><h2>Administration workspaces</h2><div className="admin-module-grid">
            {canManageUsers && <button className="admin-module" onClick={() => setTab('users')}><strong>User management</strong><small>Create accounts, edit profiles, assign roles and activate/deactivate accounts.</small></button>}
            {canManageRoles && <button className="admin-module" onClick={() => setTab('roles')}><strong>Roles & permissions</strong><small>Create custom roles and manage permission assignments. System roles remain protected.</small></button>}
            {canReadApprovals && <button className="admin-module" onClick={() => setTab('approvals')}><strong>Approval workflow</strong><small>Review submissions, approve, reject or request revisions.</small></button>}
            {canReadAudit && <button className="admin-module" onClick={() => setTab('audit')}><strong>Audit trail</strong><small>Search recorded administrative and workflow actions.</small></button>}
            {(canManageContent || canManageContact) && <button className="admin-module" onClick={() => setTab('content')}><strong>Content & communications</strong><small>Manage documents, news, gallery, banners and public enquiries.</small></button>}
          </div></section>
        </>}

        {tab === 'users' && canManageUsers && <section className="admin-section">
          <div className="admin-section-heading"><div><h2>User management</h2><p>Create, edit, assign access and deactivate official accounts.</p></div></div>
          <form className="admin-form" onSubmit={saveUser}>
            <h3>{editingUser ? `Edit account: ${editingUser.username}` : 'Create official account'}</h3>
            {!editingUser && <Field label="Username"><input required minLength="3" maxLength="50" value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} /></Field>}
            <Field label="Full name"><input required maxLength="200" value={userForm.full_name} onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })} /></Field>
            <Field label="Email"><input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} /></Field>
            {!editingUser && <Field label="Temporary password"><input type="password" required minLength="8" maxLength="128" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} /></Field>}
            <fieldset className="admin-permissions"><legend>Assign roles</legend>{roles.map((role) => <label key={role.id}><input type="checkbox" checked={userForm.role_ids.includes(role.id)} onChange={(e) => setUserForm((current) => ({ ...current, role_ids: e.target.checked ? [...current.role_ids, role.id] : current.role_ids.filter((id) => id !== role.id) }))} />{role.name}</label>)}</fieldset>
            <div className="admin-actions"><button className="btn btn--primary" type="submit" disabled={!userForm.role_ids.length}>{editingUser ? 'Save account' : 'Create account'}</button>{editingUser && <button className="btn btn--ghost" type="button" onClick={() => { setEditingUser(null); setUserForm(emptyUser) }}>Cancel</button>}</div>
          </form>
          <div className="admin-filter-row"><input aria-label="Search users" placeholder="Search name or username" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /><select aria-label="Filter user status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Roles</th><th>Status</th><th>Actions</th></tr></thead><tbody>{users.map((item) => <tr key={item.id}><td>{item.full_name}</td><td>{item.username}</td><td>{item.email || '—'}</td><td>{(item.roles || []).map((r) => r.name).join(', ') || '—'}</td><td>{item.status}</td><td className="admin-row-actions"><button type="button" onClick={() => startEditUser(item)}>Edit</button><button type="button" onClick={() => setScopeUser(item)}>Organisation access</button><button type="button" onClick={() => runAction(() => api.patch(`/admin/users/${item.id}/status`, { status: item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }), `Account ${item.status === 'ACTIVE' ? 'deactivated' : 'activated'}.`)}>{item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</button></td></tr>)}{!users.length && <tr><td colSpan="6">No accounts found.</td></tr>}</tbody></table></div>
          {scopeUser && <UserScopeManager user={scopeUser} onClose={() => setScopeUser(null)} onSaved={refresh} />}
        </section>}

        {tab === 'roles' && canManageRoles && <section className="admin-section">
          <div className="admin-section-heading"><div><h2>Roles & permissions</h2><p>Manage custom roles and permission grants. Built-in system roles cannot be deleted.</p></div></div>
          <form className="admin-form" onSubmit={saveRole}><h3>{editingRole ? `Edit role: ${editingRole.name}` : 'Create custom role'}</h3>
            {!editingRole && <Field label="Role code (lowercase_snake_case)"><input required pattern="[a-z][a-z0-9_]+" minLength="3" maxLength="50" value={roleForm.code} onChange={(e) => setRoleForm({ ...roleForm, code: e.target.value })} /></Field>}
            <Field label="Role name"><input required maxLength="100" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} /></Field>
            <Field label="Description"><input maxLength="500" value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} /></Field>
            <fieldset className="admin-permissions"><legend>Permissions</legend>{permissions.map((permission) => <label key={permission.id}><input type="checkbox" checked={roleForm.permission_ids.includes(permission.id)} onChange={(e) => setRoleForm((current) => ({ ...current, permission_ids: e.target.checked ? [...current.permission_ids, permission.id] : current.permission_ids.filter((id) => id !== permission.id) }))} />{permission.code}</label>)}</fieldset>
            <div className="admin-actions"><button className="btn btn--primary" type="submit">{editingRole ? 'Save role' : 'Create role'}</button>{editingRole && <button className="btn btn--ghost" type="button" onClick={() => { setEditingRole(null); setRoleForm(emptyRole) }}>Cancel</button>}</div>
          </form>
          <div className="admin-role-grid">{roles.map((role) => <article className="admin-role" key={role.id}><strong>{role.name}</strong><code>{role.code}</code><small>{role.description || 'No description supplied'}</small><small>{role.is_system ? 'System role · protected' : 'Custom role'}</small><div className="admin-actions"><button type="button" onClick={() => editRole(role)}>Edit</button>{!role.is_system && <button type="button" onClick={() => window.confirm(`Delete role ${role.name}?`) && runAction(() => api.delete(`/admin/roles/${role.id}`), 'Role deleted.')}>Delete</button>}</div></article>)}</div>
        </section>}

        {tab === 'approvals' && canReadApprovals && <section className="admin-section"><div className="admin-section-heading"><div><h2>Approval workflow</h2><p>Process approval records using the backend's permitted state transitions.</p></div></div>
          <div className="admin-filter-row"><select value={filters.approvalStatus} onChange={(e) => setFilters({ ...filters, approvalStatus: e.target.value })}><option value="">All statuses</option>{['PENDING','SUBMITTED','UNDER_REVIEW','REVISION_REQUESTED','RECOMMENDED','APPROVED','REJECTED'].map((s) => <option key={s}>{s}</option>)}</select></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Entity</th><th>Status</th><th>Submitted by</th><th>Remarks</th><th>Actions</th></tr></thead><tbody>{approvals.map((item) => <tr key={item.id}><td>#{item.id}</td><td>{item.entity_type} #{item.entity_id}</td><td>{item.status}</td><td>{item.submitted_by?.name || item.submitted_by?.id || '—'}</td><td><input aria-label={`Remarks for approval ${item.id}`} value={remarks[item.id] || ''} onChange={(e) => setRemarks((current) => ({ ...current, [item.id]: e.target.value }))} placeholder="Optional remarks" /></td><td className="admin-row-actions">{canWriteApprovals ? (TRANSITIONS[item.status] || []).map((action) => <button type="button" key={action} onClick={() => transitionApproval(item, action)}>{ACTION_LABELS[action]}</button>) : 'Read only'}</td></tr>)}{!approvals.length && <tr><td colSpan="6">No approval records found.</td></tr>}</tbody></table></div>
        </section>}

        {tab === 'content' && (canManageContent || canManageContact) && <AdminContentWorkspace canManageContact={canManageContact} />}

        {tab === 'audit' && canReadAudit && <section className="admin-section"><div className="admin-section-heading"><div><h2>Audit logs</h2><p>Append-only operational history. Audit records cannot be edited or deleted.</p></div></div>
          <div className="admin-filter-row"><input placeholder="Filter action (e.g. UPDATE)" value={filters.auditAction} onChange={(e) => setFilters({ ...filters, auditAction: e.target.value })} /><input placeholder="Filter entity (e.g. USER)" value={filters.auditEntity} onChange={(e) => setFilters({ ...filters, auditEntity: e.target.value })} /></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Entity</th><th>Record</th><th>Path</th></tr></thead><tbody>{audit.map((entry) => <tr key={entry.id}><td>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '—'}</td><td>{entry.user_id}</td><td>{entry.action}</td><td>{entry.entity}</td><td>{entry.entity_id}</td><td>{entry.path || '—'}</td></tr>)}{!audit.length && <tr><td colSpan="6">No audit records found.</td></tr>}</tbody></table></div>
        </section>}
      </div>
    </>
  )
}

export default AdminDashboard
