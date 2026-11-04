import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import { useAuth } from '../context/AuthProvider'
import { api } from '../lib/api'
import './OfficialWorkspace.css'

const USER_ADMIN_ROLES = ['super_admin', 'state_pmu_admin']

const OfficialWorkspace = () => {
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const canManageUsers = hasRole(USER_ADMIN_ROLES)
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [notice, setNotice] = useState('')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ username: '', full_name: '', email: '', password: '', role_id: '' })
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '' })
  const [passwordNotice, setPasswordNotice] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const loadUsers = useCallback(async () => {
    if (!canManageUsers) return
    setLoadingUsers(true)
    setUsersError('')
    try {
      const [userResponse, roleResponse] = await Promise.all([
        api.get('/admin/users', { page: 1, pageSize: 50 }),
        api.get('/admin/roles'),
      ])
      setUsers(userResponse.data || [])
      setRoles(roleResponse.data || [])
      setForm((current) => ({ ...current, role_id: current.role_id || String(roleResponse.data?.[0]?.id || '') }))
    } catch (error) {
      setUsersError(error.message || 'Unable to load account data.')
    } finally {
      setLoadingUsers(false)
    }
  }, [canManageUsers])

  useEffect(() => { loadUsers() }, [loadUsers])

  const handleCreate = async (event) => {
    event.preventDefault()
    setNotice('')
    setUsersError('')
    setCreating(true)
    try {
      await api.post('/admin/users', {
        username: form.username.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim() || undefined,
        password: form.password,
        role_ids: [Number(form.role_id)],
      })
      setForm((current) => ({ ...current, username: '', full_name: '', email: '', password: '' }))
      setNotice('Account created successfully.')
      await loadUsers()
    } catch (error) {
      setUsersError(error.message || 'Unable to create this account.')
    } finally {
      setCreating(false)
    }
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    setPasswordNotice('')
    setPasswordError('')
    setChangingPassword(true)
    try {
      await api.post('/auth/change-password', passwordForm)
      setPasswordForm({ current_password: '', new_password: '' })
      setPasswordNotice('Password changed successfully.')
    } catch (error) {
      setPasswordError(error.message || 'Unable to change your password.')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      <PageHeader title="Official workspace" lead="Secure tools and account access for authorised PM SETU users."
        breadcrumb={[{ label: 'Official workspace' }]} />
      <div className="container page-section official-workspace">
        {searchParams.get('access') === 'denied' && (
          <p className="official-alert" role="alert">Your account does not have permission to open that section.</p>
        )}
        <section className="official-welcome">
          <div>
            <p className="official-kicker">SIGNED IN AS</p>
            <h2>{user?.full_name || user?.username}</h2>
            <p>{user?.username} · {user?.status}</p>
            <div className="official-role-list">
              {user?.roles?.map((role) => <span className="official-role" key={role.code}>{role.name}</span>)}
            </div>
          </div>
          <button className="btn btn--ghost" type="button" onClick={handleLogout}>Sign out</button>
        </section>

        <section className="official-section">
          <h2>Workspace overview</h2>
          <p className="official-muted">Your available tools depend on the roles and permissions assigned to your account.</p>
          <div className="official-tools">
            <Link to="/dashboard" className="official-tool">
              <span aria-hidden="true">▦</span><strong>Implementation dashboard</strong>
              <small>View public programme progress and indicators</small>
            </Link>
            {user?.permissions?.includes('approval.read') && (
              <div className="official-tool"><span aria-hidden="true">✓</span><strong>Approvals</strong><small>Approval access is assigned to your account; workflow screens are not yet connected.</small></div>
            )}
            {user?.permissions?.includes('audit.read') && (
              <div className="official-tool"><span aria-hidden="true">◷</span><strong>Audit logs</strong><small>Audit access is assigned to your account; log screens are not yet connected.</small></div>
            )}
          </div>
        </section>

        <section className="official-section" aria-labelledby="password-title">
          <h2 id="password-title">Change your password</h2>
          <p className="official-muted">Use your current password to set a new password of at least 8 characters.</p>
          <form className="official-password-form" onSubmit={handlePasswordChange}>
            <label className="field"><span className="field__label">Current password</span>
              <input className="field__input" type="password" autoComplete="current-password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })} required /></label>
            <label className="field"><span className="field__label">New password</span>
              <input className="field__input" type="password" minLength="8" maxLength="128" autoComplete="new-password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })} required /></label>
            <div className="official-form-actions"><button className="btn btn--primary" type="submit" disabled={changingPassword}>
              {changingPassword ? 'Updating…' : 'Update password'}
            </button></div>
          </form>
          {passwordNotice && <p className="official-success" role="status">{passwordNotice}</p>}
          {passwordError && <p className="official-alert" role="alert">{passwordError}</p>}
        </section>

        {canManageUsers && (
          <section className="official-section" aria-labelledby="accounts-title">
            <div className="official-section-heading">
              <div><h2 id="accounts-title">Account management</h2><p className="official-muted">Create and review authorised PM SETU accounts.</p></div>
              <button className="btn btn--ghost" type="button" onClick={loadUsers} disabled={loadingUsers}>Refresh</button>
            </div>

            <form className="official-create-form" onSubmit={handleCreate}>
              <h3>Create an official account</h3>
              <label className="field"><span className="field__label">Full name</span>
                <input className="field__input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label>
              <label className="field"><span className="field__label">Username</span>
                <input className="field__input" minLength="3" maxLength="50" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></label>
              <label className="field"><span className="field__label">Email (optional)</span>
                <input className="field__input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label className="field"><span className="field__label">Temporary password</span>
                <input className="field__input" type="password" minLength="8" maxLength="128" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
              <label className="field"><span className="field__label">Assigned role</span>
                <select className="field__input" value={form.role_id} onChange={(e) => setForm({ ...form, role_id: e.target.value })} required>
                  <option value="" disabled>Select a role</option>
                  {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                </select></label>
              <div className="official-form-actions"><button className="btn btn--primary" type="submit" disabled={creating || !form.role_id}>{creating ? 'Creating…' : 'Create account'}</button></div>
            </form>

            {notice && <p className="official-success" role="status">{notice}</p>}
            {usersError && <p className="official-alert" role="alert">{usersError}</p>}
            <div className="official-table-wrap">
              <table className="official-table">
                <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>
                  {loadingUsers ? <tr><td colSpan="4">Loading accounts…</td></tr> :
                    users.length ? users.map((item) => (
                      <tr key={item.id}><td>{item.full_name}</td><td>{item.username}</td>
                        <td>{item.roles?.map((role) => role.name).join(', ') || '—'}</td><td>{item.status}</td></tr>
                    )) : <tr><td colSpan="4">No accounts found.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {!canManageUsers && (
          <p className="official-muted official-help">Account creation and role administration are available only to Super Administrators and State PMU Administrators.</p>
        )}
      </div>
    </>
  )
}

export default OfficialWorkspace
