import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import { useAuth } from '../context/AuthProvider'
import { api } from '../lib/api'
import './ItiOperationalWorkspace.css'

const REPORT_TYPES = [
  ['PERSONNEL', 'Personnel'],
  ['TRAINING', 'Training'],
  ['INFRASTRUCTURE', 'Infrastructure'],
  ['STUDENT_PROGRESS', 'Student progress'],
  ['MONTHLY_PROGRESS', 'Monthly progress'],
  ['OTHER', 'Other'],
]
const EMPTY_PROFILE = { address: '', principal: '', contact: '', email: '', student_strength: '', infrastructure: '', lab_details: '', existing_trades: '', proposed_trades: '' }
const EMPTY_REPORT = { report_type: 'MONTHLY_PROGRESS', title: '', payloadText: '{\n  "period": "",\n  "summary": "",\n  "activities": []\n}' }

export default function ItiOperationalWorkspace() {
  const { itiId } = useParams()
  const { user } = useAuth()
  const [institute, setInstitute] = useState(null)
  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [reports, setReports] = useState([])
  const [report, setReport] = useState(EMPTY_REPORT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [tab, setTab] = useState('profile')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const [iti, submissions] = await Promise.all([
        api.get(`/itis/${itiId}`),
        api.get(`/itis/${itiId}/submissions`),
      ])
      setInstitute(iti.data)
      const item = iti.data
      setProfile({
        address: item.address || '', principal: item.principal || '', contact: item.contact || '',
        email: item.email || '', student_strength: item.student_strength ?? '',
        infrastructure: item.infrastructure || '', lab_details: item.lab_details || '',
        existing_trades: (item.existing_trades || []).join('\n'),
        proposed_trades: (item.proposed_trades || []).join('\n'),
      })
      setReports(submissions.data || [])
    } catch (e) { setError(e.message || 'Unable to load institute workspace.') }
    finally { setLoading(false) }
  }, [itiId])

  useEffect(() => { void Promise.resolve().then(load) }, [load])

  const saveProfile = async (event) => {
    event.preventDefault(); setSaving(true); setError(''); setNotice('')
    const body = {
      address: profile.address || null, principal: profile.principal || null,
      contact: profile.contact || null, email: profile.email || null,
      student_strength: profile.student_strength === '' ? null : Number(profile.student_strength),
      infrastructure: profile.infrastructure || null, lab_details: profile.lab_details || null,
      existing_trades: profile.existing_trades.split('\n').map(x => x.trim()).filter(Boolean),
      proposed_trades: profile.proposed_trades.split('\n').map(x => x.trim()).filter(Boolean),
    }
    try {
      await api.patch(`/itis/${itiId}/profile`, body)
      setNotice('Institute profile saved successfully.')
      await load()
    } catch (e) { setError(e.message || 'Unable to save profile.') }
    finally { setSaving(false) }
  }

  const createReport = async (event) => {
    event.preventDefault(); setSaving(true); setError(''); setNotice('')
    try {
      const payload = JSON.parse(report.payloadText)
      await api.post(`/itis/${itiId}/submissions`, { report_type: report.report_type, title: report.title, payload })
      setReport(EMPTY_REPORT); setNotice('Report draft created.')
      await load(); setTab('reports')
    } catch (e) { setError(e instanceof SyntaxError ? 'Report data must be valid JSON.' : (e.message || 'Unable to create report.')) }
    finally { setSaving(false) }
  }

  const submitReport = async (id) => {
    setSaving(true); setError(''); setNotice('')
    try { await api.post(`/itis/${itiId}/submissions/${id}/submit`, {}); setNotice('Report submitted for review.'); await load() }
    catch (e) { setError(e.message || 'Unable to submit report.') }
    finally { setSaving(false) }
  }

  const reviewReport = async (id, decision) => {
    const remarks = window.prompt(decision === 'APPROVED' ? 'Add review remarks:' : 'Explain what needs attention:')
    if (!remarks || remarks.trim().length < 3) return
    setSaving(true); setError(''); setNotice('')
    try { await api.post(`/itis/${itiId}/submissions/${id}/review`, { decision, remarks }); setNotice(`Report marked ${decision.toLowerCase().replace('_', ' ')}.`); await load() }
    catch (e) { setError(e.message || 'Unable to review report.') }
    finally { setSaving(false) }
  }

  const roles = user?.roles || []
  const canReview = roles.some(r => ['cluster_admin','state_pmu_admin','super_admin'].includes(r.code))
  if (loading) return <div className="container page-section">Loading institute workspace…</div>

  return <>
    <PageHeader title={institute?.iti_name || 'ITI workspace'} lead="Maintain your assigned institute information and submit progress for review." breadcrumb={[{label:'My workspace',to:'/workspace'},{label:'ITI management'}]} />
    <div className="container page-section iti-workspace">
      <div className="iti-workspace__summary">
        <div><span className="iti-workspace__eyebrow">{institute?.type} INSTITUTE · ITI ID {institute?.id}</span><h2>{institute?.iti_name}</h2><p>{institute?.district} · {institute?.cluster?.name || 'No cluster assigned'}</p></div>
        <span className="iti-workspace__status">{institute?.status}</span>
      </div>
      {error && <p className="iti-workspace__alert" role="alert">{error}</p>}
      {notice && <p className="iti-workspace__success" role="status">{notice}</p>}
      <nav className="iti-workspace__tabs" aria-label="Institute management sections">
        <button className={tab==='profile'?'active':''} onClick={()=>setTab('profile')}>Institute profile</button>
        <button className={tab==='reports'?'active':''} onClick={()=>setTab('reports')}>Reports & submissions ({reports.length})</button>
        <button className={tab==='new'?'active':''} onClick={()=>setTab('new')}>Create report</button>
      </nav>
      {tab==='profile' && <form className="iti-workspace__panel" onSubmit={saveProfile}>
        <h2>Institute information</h2><p>Update contact, trade, student and facility information for this assigned institute.</p>
        <div className="iti-workspace__form-grid">
          <label>Principal / head<input value={profile.principal} onChange={e=>setProfile({...profile,principal:e.target.value})}/></label>
          <label>Contact number<input value={profile.contact} onChange={e=>setProfile({...profile,contact:e.target.value})}/></label>
          <label>Email<input type="email" value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})}/></label>
          <label>Student strength<input type="number" min="0" value={profile.student_strength} onChange={e=>setProfile({...profile,student_strength:e.target.value})}/></label>
          <label className="wide">Address<textarea rows="2" value={profile.address} onChange={e=>setProfile({...profile,address:e.target.value})}/></label>
          <label>Existing trades <span>One trade per line</span><textarea rows="4" value={profile.existing_trades} onChange={e=>setProfile({...profile,existing_trades:e.target.value})}/></label>
          <label>Proposed trades <span>One trade per line</span><textarea rows="4" value={profile.proposed_trades} onChange={e=>setProfile({...profile,proposed_trades:e.target.value})}/></label>
          <label>Infrastructure<textarea rows="4" value={profile.infrastructure} onChange={e=>setProfile({...profile,infrastructure:e.target.value})}/></label>
          <label>Lab details<textarea rows="4" value={profile.lab_details} onChange={e=>setProfile({...profile,lab_details:e.target.value})}/></label>
        </div>
        <button className="iti-workspace__primary" disabled={saving}>{saving?'Saving…':'Save institute profile'}</button>
      </form>}
      {tab==='new' && <form className="iti-workspace__panel" onSubmit={createReport}>
        <h2>Create a report</h2><p>Save a draft first. You can submit it for Cluster / State review when it is ready.</p>
        <div className="iti-workspace__form-grid">
          <label>Report category<select value={report.report_type} onChange={e=>setReport({...report,report_type:e.target.value})}>{REPORT_TYPES.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
          <label>Report title<input required minLength="3" maxLength="180" value={report.title} onChange={e=>setReport({...report,title:e.target.value})}/></label>
          <label className="wide">Report data (JSON)<textarea className="iti-workspace__json" rows="9" value={report.payloadText} onChange={e=>setReport({...report,payloadText:e.target.value})}/><span>Use structured information relevant to this report. Do not include passwords or sensitive credentials.</span></label>
        </div>
        <button className="iti-workspace__primary" disabled={saving}>{saving?'Saving…':'Save report draft'}</button>
      </form>}
      {tab==='reports' && <section className="iti-workspace__panel">
        <div className="iti-workspace__panel-heading"><div><h2>Reports & submissions</h2><p>Track drafts, submitted reports and reviewer feedback.</p></div><button onClick={()=>setTab('new')}>+ New report</button></div>
        {reports.length===0 ? <div className="iti-workspace__empty">No reports yet. Create your first progress report.</div> : <div className="iti-workspace__reports">{reports.map(item=><article key={item.id}>
          <div className="iti-workspace__report-heading"><div><span className="iti-workspace__eyebrow">{item.report_type.replaceAll('_',' ')}</span><h3>{item.title}</h3><p>Updated {new Date(item.updated_at).toLocaleString()}</p></div><span className={`iti-workspace__badge status-${item.status.toLowerCase()}`}>{item.status.replaceAll('_',' ')}</span></div>
          {item.review_remarks && <p className="iti-workspace__feedback"><strong>Reviewer feedback:</strong> {item.review_remarks}</p>}
          <div className="iti-workspace__actions">
            {['DRAFT','REVISION_REQUESTED'].includes(item.status) && <button disabled={saving} onClick={()=>submitReport(item.id)}>Submit for review</button>}
            {canReview && item.status==='SUBMITTED' && <><button disabled={saving} onClick={()=>reviewReport(item.id,'APPROVED')}>Approve</button><button disabled={saving} onClick={()=>reviewReport(item.id,'REVISION_REQUESTED')}>Request revision</button><button disabled={saving} onClick={()=>reviewReport(item.id,'REJECTED')}>Reject</button></>}
          </div>
        </article>)}</div>}
      </section>}
      <p className="iti-workspace__footnote"><Link to="/workspace">← Back to my workspace</Link> · Changes are restricted by your assigned organisation access and recorded in the audit trail.</p>
    </div>
  </>
}
