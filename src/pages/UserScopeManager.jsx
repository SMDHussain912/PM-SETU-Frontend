import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

const SCOPE_SOURCES = [
  { type: 'CLUSTER', label: 'Cluster', endpoint: '/clusters', role: 'cluster_admin', name: (x) => x.name },
  { type: 'ITI', label: 'ITI', endpoint: '/itis', roles: ['hub_iti_user', 'spoke_iti_user'], name: (x) => `${x.iti_name} · ${x.type}` },
  { type: 'AIP', label: 'AIP', endpoint: '/aips', role: 'aip_user', name: (x) => x.name },
  { type: 'SPV', label: 'SPV', endpoint: '/spvs', role: 'spv_user', name: (x) => x.name },
]

export default function UserScopeManager({ user, onClose, onSaved }) {
  const [options, setOptions] = useState({})
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const roleKey = (user.roles || []).map((role) => role.code).join('|')
  const roleCodes = roleKey.split('|')
  const sources = useMemo(() => SCOPE_SOURCES.filter((source) =>
    source.roles ? source.roles.some((role) => roleCodes.includes(role)) : roleCodes.includes(source.role)
  ), [roleKey])

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const [current, ...lists] = await Promise.all([
        api.get(`/admin/users/${user.id}/scopes`),
        ...sources.map((source) => api.get(source.endpoint, { page: 1, pageSize: 500 })),
      ])
      const nextOptions = {}
      sources.forEach((source, index) => { nextOptions[source.type] = lists[index].data || [] })
      setOptions(nextOptions)
      setSelected((current.data || []).map((scope) => ({ scope_type: scope.scope_type, scope_id: scope.scope_id })))
    } catch (e) { setError(e.message || 'Unable to load scope assignments.') }
    finally { setLoading(false) }
  }, [user.id, sources])

  useEffect(() => { load() }, [load])

  const toggle = (scopeType, scopeId, checked) => {
    setSelected((current) => checked
      ? [...current, { scope_type: scopeType, scope_id: scopeId }]
      : current.filter((item) => !(item.scope_type === scopeType && item.scope_id === scopeId)))
  }

  const save = async () => {
    setSaving(true); setError(''); setNotice('')
    try {
      await api.put(`/admin/users/${user.id}/scopes`, { scopes: selected })
      setNotice('Organisation scope assignments saved.')
      onSaved?.()
    } catch (e) { setError(e.message || 'Unable to save scope assignments.') }
    finally { setSaving(false) }
  }

  return <section className="admin-section admin-scope-manager">
    <div className="admin-section-heading">
      <div><h3>Organisation access: {user.full_name || user.username}</h3><p>Choose the exact clusters, institutes, partners or SPVs this account may manage.</p></div>
      <button className="btn btn--ghost" type="button" onClick={onClose}>Close</button>
    </div>
    {error && <p className="admin-error" role="alert">{error}</p>}
    {notice && <p className="admin-notice" role="status">{notice}</p>}
    {loading ? <p>Loading scope options…</p> : sources.length ? sources.map((source) => {
      const items = options[source.type] || []
      return <fieldset className="admin-permissions" key={source.type}>
        <legend>{source.label} assignments ({selected.filter((x) => x.scope_type === source.type).length})</legend>
        {items.length ? items.map((item) => {
          const id = item.id
          const checked = selected.some((x) => x.scope_type === source.type && x.scope_id === id)
          return <label key={id}><input type="checkbox" checked={checked} onChange={(e) => toggle(source.type, id, e.target.checked)} />{source.name(item)}</label>
        }) : <p>No {source.label} records are available to assign.</p>}
      </fieldset>
    }) : <p>This account has no scope-based role. Global roles do not require organisation assignments.</p>}
    <div className="admin-actions"><button className="btn btn--primary" type="button" onClick={save} disabled={loading || saving}>{saving ? 'Saving…' : 'Save organisation access'}</button></div>
  </section>
}
