import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'

const MODULES = [
  ['documents', 'Documents'],
  ['news', 'News'],
  ['gallery', 'Gallery'],
  ['banners', 'Banners'],
  ['contact', 'Contact messages'],
]
const emptyForms = {
  documents: { title: '', document_number: '', type: '', department: '', issue_date: '', financial_year: '', keywords: '', language: '' },
  news: { title: '', summary: '', content: '', category: '', published_date: '', expiry_date: '', thumbnail_url: '' },
  gallery: { title: '', description: '', type: 'PHOTO', media_url: '', thumbnail_url: '', published_date: '', category: '', display_order: 0 },
  banners: { title: '', desktop_image_url: '', mobile_image_url: '', cta_text: '', cta_url: '', display_order: 0, start_date: '', end_date: '' },
}
const endpoint = { documents: '/documents', news: '/news', gallery: '/gallery', banners: '/banners' }

function AdminContentWorkspace({ canManageContact = false }) {
  const [module, setModule] = useState('documents')
  const [records, setRecords] = useState([])
  const [messages, setMessages] = useState([])
  const [form, setForm] = useState(emptyForms.documents)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      if (module === 'contact') {
        const result = await api.get('/admin/contact/messages', { page: 1, pageSize: 100 })
        setMessages(result.data || [])
      } else {
        const result = await api.get(endpoint[module], { page: 1, pageSize: 100 })
        setRecords(result.data || [])
      }
    } catch (e) { setError(e.message || 'Could not load this workspace.') }
    finally { setLoading(false) }
  }, [module])

  useEffect(() => {
    setEditing(null)
    setForm(emptyForms[module] || {})
    load()
  }, [module, load])

  const perform = async (callback, message) => {
    setError(''); setNotice('')
    try { await callback(); setNotice(message); setEditing(null); setForm(emptyForms[module] || {}); await load() }
    catch (e) { setError(e.message || 'The requested operation failed.') }
  }

  const edit = (item) => {
    setEditing(item)
    const source = { ...item }
    if (module === 'documents') delete source.cluster
    if (module === 'news') delete source.cluster
    if (module === 'banners') {
      source.start_date = source.start_date ? source.start_date.slice(0, 16) : ''
      source.end_date = source.end_date ? source.end_date.slice(0, 16) : ''
    }
    setForm({ ...emptyForms[module], ...source })
  }

  const save = async (event) => {
    event.preventDefault()
    const payload = { ...form }
    if (module === 'documents') {
      for (const key of ['title','document_number','type','department','issue_date','financial_year','keywords','language']) payload[key] = payload[key] || null
    }
    if (module === 'news') {
      for (const key of ['summary','content','category','published_date','expiry_date','thumbnail_url']) payload[key] = payload[key] || null
    }
    if (module === 'gallery') {
      for (const key of ['description','media_url','thumbnail_url','published_date','category']) payload[key] = payload[key] || null
      payload.display_order = Number(payload.display_order || 0)
    }
    if (module === 'banners') {
      for (const key of ['desktop_image_url','mobile_image_url','cta_text','cta_url','start_date','end_date']) payload[key] = payload[key] || null
      payload.display_order = Number(payload.display_order || 0)
    }
    const path = module === 'documents' ? '/admin/documents' : module === 'news' ? '/admin/news' : module === 'gallery' ? '/admin/gallery' : '/admin/banners'
    await perform(async () => {
      if (editing) await api.patch(`${path}/${editing.id}`, payload)
      else await api.post(path, payload)
    }, editing ? 'Content updated.' : 'Content created as draft.')
  }

  const action = async (item, verb) => {
    const base = module === 'documents' ? '/admin/documents' : module === 'news' ? '/admin/news' : module === 'gallery' ? '/admin/gallery' : '/admin/banners'
    const labels = { publish: 'published', archive: 'archived', delete: 'deleted', version: 'version snapshot created' }
    if (verb === 'delete' && !window.confirm(`Permanently delete “${item.title || item.id}”?`)) return
    await perform(async () => {
      if (verb === 'delete') await api.delete(`${base}/${item.id}`)
      else await api.post(`${base}/${item.id}/${verb}`, {})
    }, `Record ${labels[verb]}.`)
  }

  const statusAction = async (item, status) => {
    await perform(() => api.patch(`/admin/contact/messages/${item.id}`, { status }), `Message marked ${status.toLowerCase()}.`)
  }

  const fields = {
    documents: [['title','Title'],['document_number','Document number'],['type','Document type'],['department','Department'],['issue_date','Issue date','date'],['financial_year','Financial year'],['keywords','Keywords'],['language','Language']],
    news: [['title','Title'],['summary','Summary'],['content','Full content','textarea'],['category','Category'],['published_date','Published date','date'],['expiry_date','Expiry date','date'],['thumbnail_url','Thumbnail URL']],
    gallery: [['title','Title'],['description','Description'],['type','Media type'],['media_url','Media URL'],['thumbnail_url','Thumbnail URL'],['published_date','Published date','date'],['category','Category'],['display_order','Display order','number']],
    banners: [['title','Title'],['desktop_image_url','Desktop image URL'],['mobile_image_url','Mobile image URL'],['cta_text','Button text'],['cta_url','Button URL'],['display_order','Display order','number'],['start_date','Start date','datetime-local'],['end_date','End date','datetime-local']],
  }

  const canPublish = ['documents','news','banners'].includes(module)
  return <section className="admin-section">
    <div className="admin-section-heading"><div><h2>Content & communications</h2><p>Manage programme documents, news, gallery media, banners and incoming public enquiries.</p></div><button className="btn btn--ghost" type="button" onClick={load} disabled={loading}>Refresh</button></div>
    <nav className="admin-content-tabs" aria-label="Content management sections">{MODULES.filter(([id]) => id !== 'contact' || canManageContact).map(([id,label]) => <button type="button" key={id} className={module === id ? 'is-active' : ''} onClick={() => setModule(id)}>{label}</button>)}</nav>
    {error && <p className="admin-error" role="alert">{error}</p>}
    {notice && <p className="admin-notice" role="status">{notice}</p>}
    {module === 'contact' ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Received</th><th>Name</th><th>Contact</th><th>Subject / message</th><th>Status</th><th>Update status</th></tr></thead><tbody>
      {messages.map((item) => <tr key={item.id}><td>{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</td><td>{item.name}</td><td>{item.email}<br/>{item.phone || ''}</td><td><strong>{item.subject || 'Enquiry'}</strong><p>{item.message}</p></td><td>{item.status}</td><td className="admin-row-actions">{['NEW','READ','REPLIED','ARCHIVED'].filter((s) => s !== item.status).map((s) => <button key={s} type="button" onClick={() => statusAction(item,s)}>{s}</button>)}</td></tr>)}
      {!messages.length && <tr><td colSpan="6">{loading ? 'Loading messages…' : 'No messages found.'}</td></tr>}
    </tbody></table></div> : <>
      <form className="admin-form" onSubmit={save}><h3>{editing ? `Edit ${module.slice(0,-1)} #${editing.id}` : `Create ${module.slice(0,-1)}`}</h3>
        {(fields[module] || []).map(([key,label,type]) => <label className="admin-field" key={key}><span>{label}</span>{type === 'textarea' ? <textarea rows="4" value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })}/> : <input type={type || 'text'} value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={key === 'title' || key === 'type'}/>}</label>)}
        <div className="admin-actions"><button className="btn btn--primary" type="submit">{editing ? 'Save changes' : 'Create draft'}</button>{editing && <button className="btn btn--ghost" type="button" onClick={() => {setEditing(null);setForm(emptyForms[module])}}>Cancel</button>}</div>
      </form>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>
        {records.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.title || item.original_name || 'Untitled'}</td><td>{item.publish_status || (item.is_archived ? 'ARCHIVED' : item.is_published ? 'PUBLISHED' : 'DRAFT')}</td><td>{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '—'}</td><td className="admin-row-actions"><button type="button" onClick={() => edit(item)}>Edit</button>{canPublish && <>{(item.publish_status !== 'PUBLISHED' && item.is_published !== true) && <button type="button" onClick={() => action(item,'publish')}>Publish</button>}<button type="button" onClick={() => action(item,'archive')}>Archive</button></>}{module === 'documents' && <button type="button" onClick={() => action(item,'version')}>New version</button>}<button type="button" onClick={() => action(item,'delete')}>Delete</button></td></tr>)}
        {!records.length && <tr><td colSpan="5">{loading ? 'Loading records…' : 'No records found.'}</td></tr>}
      </tbody></table></div>
      {module === 'banners' && <p className="admin-inline-help">The current backend public banner list returns published, non-archived banners only. Drafts can be created and managed by ID, but a complete all-status banner queue requires an admin list endpoint.</p>}
    </>}
  </section>
}
export default AdminContentWorkspace
