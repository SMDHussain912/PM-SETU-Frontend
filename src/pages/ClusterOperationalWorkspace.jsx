import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthProvider'
import './ClusterOperationalWorkspace.css'

const EMPTY = { title: '', report_period: '', payloadText: '{\n  "summary": "",\n  "key_activities": [],\n  "risks": [],\n  "support_required": []\n}' }
export default function ClusterOperationalWorkspace() {
  const { clusterId } = useParams()
  const { user } = useAuth()
  const [overview,setOverview]=useState(null)
  const [itiReports,setItiReports]=useState([])
  const [reports,setReports]=useState([])
  const [draft,setDraft]=useState(EMPTY)
  const [tab,setTab]=useState('overview')
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState('')
  const [notice,setNotice]=useState('')
  const roles=(user?.roles||[]).map(r=>r.code)
  const canReviewCluster=roles.some(r=>['state_pmu_admin','super_admin'].includes(r))
  const load=async()=>{
    setLoading(true);setError('')
    try{
      const [o,i,r]=await Promise.all([
        api.get(`/clusters/${clusterId}/overview`),
        api.get(`/clusters/${clusterId}/iti-reports`),
        api.get(`/clusters/${clusterId}/submissions`),
      ])
      setOverview(o.data);setItiReports(i.data||[]);setReports(r.data||[])
    }catch(e){setError(e.message||'Unable to load cluster workspace.')}
    finally{setLoading(false)}
  }
  useEffect(()=>{load()},[clusterId])
  const reviewIti=async(item,decision)=>{
    const remarks=window.prompt('Add review remarks (required):')
    if(!remarks||remarks.trim().length<3)return
    setSaving(true);setError('');setNotice('')
    try{await api.post(`/itis/${item.iti_id}/submissions/${item.id}/review`,{decision,remarks});setNotice('Institute report review saved.');await load()}
    catch(e){setError(e.message||'Unable to review institute report.')}finally{setSaving(false)}
  }
  const create=async(e)=>{
    e.preventDefault();setSaving(true);setError('');setNotice('')
    try{const payload=JSON.parse(draft.payloadText);await api.post(`/clusters/${clusterId}/submissions`,{title:draft.title,report_period:draft.report_period,payload});setDraft(EMPTY);setNotice('Cluster report draft created.');await load();setTab('reports')}
    catch(e){setError(e instanceof SyntaxError?'Report data must be valid JSON.':(e.message||'Unable to create report.'))}finally{setSaving(false)}
  }
  const submit=async(id)=>{
    setSaving(true);setError('');setNotice('')
    try{await api.post(`/clusters/${clusterId}/submissions/${id}/submit`,{});setNotice('Cluster report submitted to State PMU.');await load()}
    catch(e){setError(e.message||'Unable to submit cluster report.')}finally{setSaving(false)}
  }
  const reviewCluster=async(id,decision)=>{
    const remarks=window.prompt('Add decision remarks (required):')
    if(!remarks||remarks.trim().length<3)return
    setSaving(true);setError('');setNotice('')
    try{await api.post(`/clusters/${clusterId}/submissions/${id}/review`,{decision,remarks});setNotice('Cluster report decision saved.');await load()}
    catch(e){setError(e.message||'Unable to review cluster report.')}finally{setSaving(false)}
  }
  if(loading)return <div className="container page-section">Loading cluster workspace…</div>
  return <>
    <PageHeader title={overview?.name||'Cluster workspace'} lead="Coordinate assigned institutes, review institute reports and submit cluster progress." breadcrumb={[{label:'My workspace',to:'/workspace'},{label:'Cluster management'}]}/>
    <div className="container page-section cluster-workspace">
      <section className="cluster-workspace__hero"><div><span>ASSIGNED CLUSTER · {overview?.district}</span><h2>{overview?.name}</h2><p>{overview?.sector}</p></div><span className="cluster-workspace__id">Cluster #{overview?.id}</span></section>
      {error&&<p className="cluster-workspace__error" role="alert">{error}</p>}{notice&&<p className="cluster-workspace__success" role="status">{notice}</p>}
      <div className="cluster-workspace__stats">
        {[['Total ITIs',overview?.total_itis],['Hub ITIs',overview?.hub_itis],['Spoke ITIs',overview?.spoke_itis],['Active ITIs',overview?.active_itis],['Pending ITI reports',overview?.pending_iti_reports],['Pending cluster reports',overview?.pending_cluster_reports]].map(([label,value])=><article key={label}><span>{label}</span><strong>{value??0}</strong></article>)}
      </div>
      <nav className="cluster-workspace__tabs" aria-label="Cluster workspace sections">
        <button className={tab==='overview'?'active':''} onClick={()=>setTab('overview')}>Institute reports ({itiReports.length})</button>
        <button className={tab==='reports'?'active':''} onClick={()=>setTab('reports')}>Cluster reports ({reports.length})</button>
        <button className={tab==='new'?'active':''} onClick={()=>setTab('new')}>Create cluster report</button>
      </nav>
      {tab==='overview'&&<section className="cluster-workspace__panel"><h2>Institute submissions</h2><p>Review reports from institutes belonging to this assigned cluster.</p>
        {!itiReports.length?<div className="cluster-workspace__empty">No institute reports have been submitted yet.</div>:<div className="cluster-workspace__list">{itiReports.map(item=><article key={item.id}><div><span className="cluster-workspace__eyebrow">{item.iti_name} · {item.type} · {item.report_type.replaceAll('_',' ')}</span><h3>{item.title}</h3><p>Submitted {item.submitted_at?new Date(item.submitted_at).toLocaleString():'—'} · {item.creator_name||'Institute user'}</p>{item.review_remarks&&<p className="cluster-workspace__remarks">Feedback: {item.review_remarks}</p>}</div><div className="cluster-workspace__actions"><span className={'cluster-workspace__status status-'+item.status.toLowerCase()}>{item.status.replaceAll('_',' ')}</span>{item.status==='SUBMITTED'&&<><button disabled={saving} onClick={()=>reviewIti(item,'APPROVED')}>Approve</button><button disabled={saving} onClick={()=>reviewIti(item,'REVISION_REQUESTED')}>Request revision</button><button disabled={saving} onClick={()=>reviewIti(item,'REJECTED')}>Reject</button></>}</div></article>)}</div>}
      </section>}
      {tab==='new'&&<form className="cluster-workspace__panel" onSubmit={create}><h2>Prepare cluster progress report</h2><p>Summarise institute progress, activities, risks and support requirements for the reporting period.</p><div className="cluster-workspace__form"><label>Report title<input required minLength="3" maxLength="180" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/></label><label>Reporting period<input required placeholder="e.g. November 2026" value={draft.report_period} onChange={e=>setDraft({...draft,report_period:e.target.value})}/></label><label className="wide">Report details (JSON)<textarea rows="10" value={draft.payloadText} onChange={e=>setDraft({...draft,payloadText:e.target.value})}/></label></div><button className="cluster-workspace__primary" disabled={saving}>{saving?'Saving…':'Save cluster report draft'}</button></form>}
      {tab==='reports'&&<section className="cluster-workspace__panel"><h2>Cluster reports</h2><p>Submit drafts to State PMU and track review decisions.</p>{!reports.length?<div className="cluster-workspace__empty">No cluster reports yet. Create your first report.</div>:<div className="cluster-workspace__list">{reports.map(item=><article key={item.id}><div><span className="cluster-workspace__eyebrow">{item.report_period}</span><h3>{item.title}</h3><p>Updated {new Date(item.updated_at).toLocaleString()}</p>{item.review_remarks&&<p className="cluster-workspace__remarks">Decision: {item.review_remarks}</p>}</div><div className="cluster-workspace__actions"><span className={'cluster-workspace__status status-'+item.status.toLowerCase()}>{item.status.replaceAll('_',' ')}</span>{['DRAFT','REVISION_REQUESTED'].includes(item.status)&&<button disabled={saving} onClick={()=>submit(item.id)}>Submit to State PMU</button>}{canReviewCluster&&item.status==='SUBMITTED'&&<><button disabled={saving} onClick={()=>reviewCluster(item.id,'APPROVED')}>Accept</button><button disabled={saving} onClick={()=>reviewCluster(item.id,'REVISION_REQUESTED')}>Request revision</button><button disabled={saving} onClick={()=>reviewCluster(item.id,'REJECTED')}>Reject</button></>}</div></article>)}</div>}</section>}
      <p className="cluster-workspace__footnote"><Link to="/workspace">← Back to my workspace</Link> · You can only access records in your assigned cluster.</p>
    </div>
  </>
}
