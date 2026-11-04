import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import { useAuth } from '../context/AuthProvider'
import './RoleWorkspace.css'

const WORKSPACES = {
  super_admin: {
    title: 'System administration',
    description: 'Platform-wide administration, access governance and operational oversight.',
    modules: [
      ['Administration centre', 'Manage official accounts, role grants, content, approvals and audit records.', '/admin', 'Manage'],
      ['Programme dashboard', 'Review state-wide implementation indicators.', '/dashboard', 'View'],
      ['Governance directory', 'Review programme governance and responsible officers.', '/governance', 'View'],
    ],
  },
  state_pmu_admin: {
    title: 'State PMU workspace',
    description: 'Coordinate programme operations, official accounts and state-level reporting.',
    modules: [
      ['Administration centre', 'Manage permitted official accounts, content and contact enquiries.', '/admin', 'Open'],
      ['State dashboard', 'Monitor programme indicators and implementation progress.', '/dashboard', 'View'],
      ['Governance directory', 'Review governance structures and officers.', '/governance', 'View'],
      ['Programme documents', 'Review published government orders and programme documents.', '/documents', 'View'],
    ],
  },
  det_content_admin: {
    title: 'Content administration',
    description: 'Maintain programme information and content through the authorised publishing workflow.',
    modules: [
      ['Content & communications', 'Create and maintain documents, news, gallery media and banners.', '/admin', 'Manage'],
      ['Published documents', 'Review programme documents visible to the public.', '/documents', 'View'],
      ['News & announcements', 'Review published programme updates.', '/news', 'View'],
      ['Media gallery', 'Review published gallery items.', '/gallery', 'View'],
    ],
  },
  approving_authority: {
    title: 'Approving authority workspace',
    description: 'Review assigned approval work and inspect the authorised audit trail.',
    modules: [
      ['Approval & audit centre', 'Review approval records, perform permitted transitions and inspect audit history.', '/admin', 'Open'],
      ['Programme dashboard', 'Review programme-level implementation indicators.', '/dashboard', 'View'],
      ['Governance directory', 'Reference programme governance and responsible officers.', '/governance', 'View'],
    ],
  },
  cluster_admin: {
    title: 'Cluster administration',
    description: 'Cluster-level reference and reporting workspace. Cluster-scoped editing and assignment workflows require additional backend endpoints.',
    modules: [
      ['Cluster directory', 'Find your cluster and review its public profile.', '/clusters', 'View'],
      ['Implementation dashboard', 'Review available programme and cluster indicators.', '/dashboard', 'View'],
      ['ITI directory', 'Find ITIs and review their published information.', '/clusters', 'View'],
      ['Programme documents', 'Reference published programme orders and documents.', '/documents', 'View'],
    ],
  },
  hub_iti_user: {
    title: 'Hub ITI workspace',
    description: 'ITI reference and programme reporting workspace. Protected ITI submissions and record editing are not yet exposed by the current backend.',
    modules: [
      ['Cluster & ITI directory', 'Reference cluster and institute information.', '/clusters', 'View'],
      ['Programme dashboard', 'Review available implementation indicators.', '/dashboard', 'View'],
      ['Programme documents', 'Access published instructions and government orders.', '/documents', 'View'],
    ],
  },
  spoke_iti_user: {
    title: 'Spoke ITI workspace',
    description: 'ITI reference and programme reporting workspace. Protected ITI submissions and record editing are not yet exposed by the current backend.',
    modules: [
      ['Cluster & ITI directory', 'Reference cluster and institute information.', '/clusters', 'View'],
      ['Programme dashboard', 'Review available implementation indicators.', '/dashboard', 'View'],
      ['Programme documents', 'Access published instructions and government orders.', '/documents', 'View'],
    ],
  },
  aip_user: {
    title: 'Industry partner workspace',
    description: 'Industry partner directory and programme reference information.',
    modules: [
      ['Industry partners', 'Browse AIP profiles and published partner information.', '/industry-partners', 'View'],
      ['Programme dashboard', 'Review public implementation indicators.', '/dashboard', 'View'],
      ['Programme documents', 'Reference published programme documents.', '/documents', 'View'],
    ],
  },
  spv_user: {
    title: 'SPV workspace',
    description: 'SPV and SIP programme reference information.',
    modules: [
      ['SPV directory', 'Browse SPV profiles and published information.', '/spvs', 'View'],
      ['SIP directory', 'Review published SIP records.', '/sips', 'View'],
      ['Programme dashboard', 'Review public programme indicators.', '/dashboard', 'View'],
    ],
  },
  dashboard_viewer: {
    title: 'Programme reporting workspace',
    description: 'Read-only access to programme dashboards and public reference information.',
    modules: [
      ['Implementation dashboard', 'Review programme indicators and available reports.', '/dashboard', 'View'],
      ['Cluster directory', 'Browse cluster information.', '/clusters', 'View'],
      ['Programme documents', 'Reference published programme documents.', '/documents', 'View'],
    ],
  },
}

const RoleWorkspace = () => {
  const { user } = useAuth()
  const roles = user?.roles || []
  const active = roles.map((role) => WORKSPACES[role.code]).filter(Boolean)
  const modules = [...new Map(active.flatMap((workspace) => workspace.modules).map((item) => [item[0], item])).values()]
  const title = active.length === 1 ? active[0].title : 'My PM SETU workspace'
  const description = active.length === 1 ? active[0].description : 'Your workspace combines the tools available to your assigned roles.'
  return <>
    <PageHeader title={title} lead={description} breadcrumb={[{ label: 'My workspace' }]} />
    <div className="container page-section role-workspace">
      <section className="role-workspace__identity">
        <div><span className="role-workspace__eyebrow">SIGNED IN AS</span><h2>{user?.full_name || user?.username}</h2><p>{user?.username}</p></div>
        <div className="role-workspace__roles">{roles.map((role) => <span key={role.code}>{role.name}</span>)}</div>
      </section>
      <section className="role-workspace__section">
        <div className="role-workspace__heading"><div><h2>Your workspaces</h2><p>Tools are shown according to the roles currently assigned to your account.</p></div></div>
        <div className="role-workspace__grid">
          {modules.map(([name, detail, href, action]) => <article className="role-workspace__card" key={name}>
            <div><h3>{name}</h3><p>{detail}</p></div>
            <Link to={href}>{action} <span aria-hidden="true">→</span></Link>
          </article>)}
        </div>
      </section>
      <p className="role-workspace__notice"><strong>Access boundary:</strong> A workspace link does not grant additional permissions. The backend checks every protected operation. Some institute- and cluster-scoped submission/editing workflows are not yet implemented in the current API and are intentionally not presented as active controls.</p>
    </div>
  </>
}
export default RoleWorkspace
