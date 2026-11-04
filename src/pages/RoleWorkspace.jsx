import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import { useAuth } from '../context/AuthProvider'
import { api } from '../lib/api'
import './RoleWorkspace.css'

const ROLE_INFO = {
  super_admin: ['System administration', 'Platform-wide access governance and oversight.'],
  state_pmu_admin: ['State PMU workspace', 'Coordinate state operations, authorised accounts and programme reporting.'],
  det_content_admin: ['Content administration', 'Maintain programme content through the publishing workflow.'],
  approving_authority: ['Approving authority workspace', 'Review assigned approval work and decision history.'],
  cluster_admin: ['Cluster administration', 'Manage only the clusters assigned to your account.'],
  hub_iti_user: ['Hub ITI workspace', 'Access the Hub ITI records assigned to your account.'],
  spoke_iti_user: ['Spoke ITI workspace', 'Access the Spoke ITI records assigned to your account.'],
  aip_user: ['Industry partner workspace', 'Access the AIP records assigned to your account.'],
  spv_user: ['SPV workspace', 'Access the SPV records assigned to your account.'],
  dashboard_viewer: ['Programme reporting workspace', 'Read-only programme indicators and public reference information.'],
}
const SCOPE_LINKS = { AIP: '/industry-partners', SPV: '/spvs' }
const ROLE_LINKS = {
  super_admin: [['Administration centre', '/admin']],
  state_pmu_admin: [['State administration', '/admin'], ['Programme dashboard', '/dashboard']],
  det_content_admin: [['Content administration', '/admin'], ['Documents', '/documents'], ['News', '/news'], ['Gallery', '/gallery']],
  approving_authority: [['Approval & audit centre', '/admin'], ['Programme dashboard', '/dashboard']],
  cluster_admin: [['My cluster workspace', '/workspace'], ['Cluster directory', '/clusters'], ['Programme dashboard', '/dashboard']],
  hub_iti_user: [['ITI directory', '/clusters'], ['Programme dashboard', '/dashboard']],
  spoke_iti_user: [['ITI directory', '/clusters'], ['Programme dashboard', '/dashboard']],
  aip_user: [['Industry partners', '/industry-partners'], ['Programme dashboard', '/dashboard']],
  spv_user: [['SPV directory', '/spvs'], ['SIP directory', '/sips'], ['Programme dashboard', '/dashboard']],
  dashboard_viewer: [['Programme dashboard', '/dashboard'], ['Documents', '/documents']],
}

export default function RoleWorkspace() {
  const { user } = useAuth()
  const [scopes, setScopes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const roles = (user?.roles || []).map((role) => role.code)
  const primary = roles.find((role) => ROLE_INFO[role])
  const [title, description] = ROLE_INFO[primary] || ['Official workspace', 'Your authorised PM SETU tools.']

  useEffect(() => {
    let active = true
    api.get('/auth/me/scopes')
      .then((response) => { if (active) setScopes(response.data || []) })
      .catch((e) => { if (active) setError(e.message || 'Unable to load assigned organisation access.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const links = [...new Map(roles.flatMap((role) => ROLE_LINKS[role] || []).map((item) => [item[0], item])).values()]
  const scopedRoles = roles.some((role) => ['cluster_admin', 'hub_iti_user', 'spoke_iti_user', 'aip_user', 'spv_user'].includes(role))

  return <>
    <PageHeader title={title} lead={description} breadcrumb={[{ label: 'My workspace' }]} />
    <div className="container page-section role-workspace">
      <section className="role-workspace__identity">
        <div><span className="role-workspace__eyebrow">SIGNED IN AS</span><h2>{user?.full_name || user?.username}</h2><p>{user?.username}</p></div>
        <div className="role-workspace__roles">{(user?.roles || []).map((role) => <span key={role.code}>{role.name}</span>)}</div>
      </section>
      {scopedRoles && <section className="role-workspace__section">
        <div className="role-workspace__heading"><div><h2>Your assigned organisations</h2><p>These assignments define the organisation-level scope available to your account.</p></div></div>
        {loading ? <p>Loading assignments…</p> : error ? <p className="role-workspace__error" role="alert">{error}</p> : scopes.length ? <div className="role-workspace__grid">
          {scopes.map((scope) => <article className="role-workspace__card" key={scope.id}>
            <div><span className="role-workspace__type">{scope.scope_type}</span><h3>{scope.scope_name}</h3><p>Assigned organisation record · ID {scope.scope_id}</p></div>
            <Link to={scope.scope_type === 'ITI' ? '/workspace/itis/' + scope.scope_id : scope.scope_type === 'CLUSTER' ? '/workspace/clusters/' + scope.scope_id : (SCOPE_LINKS[scope.scope_type] || '/dashboard')}>{scope.scope_type === 'ITI' ? 'Manage institute' : scope.scope_type === 'CLUSTER' ? 'Manage cluster' : 'Open directory'} <span aria-hidden="true">→</span></Link>
          </article>)}
        </div> : <p className="role-workspace__error">No organisation scopes are assigned yet. Please contact your State PMU administrator.</p>}
      </section>}
      <section className="role-workspace__section">
        <div className="role-workspace__heading"><div><h2>Available modules</h2><p>Shortcuts based on your assigned roles.</p></div></div>
        <div className="role-workspace__grid">
          {links.map(([name, href]) => <article className="role-workspace__card" key={name}><div><h3>{name}</h3><p>Open the currently available PM SETU module.</p></div><Link to={href}>Open module <span aria-hidden="true">→</span></Link></article>)}
        </div>
      </section>
      <p className="role-workspace__notice"><strong>Access control:</strong> Operational actions are checked against your assigned organisation on the server. If an assignment is incorrect or missing, contact your State PMU administrator.</p>
    </div>
  </>
}
