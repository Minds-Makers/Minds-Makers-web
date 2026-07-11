import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import logo from '../assets/logo-64.png'

// ── Toast ──────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState(null)
  const show = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }
  return { toast, show }
}

function Toast({ toast }) {
  if (!toast) return null
  return <div className={`toast${toast.type === 'error' ? ' error' : ''}`}>{toast.msg}</div>
}

// ── Panels ─────────────────────────────────────

// Site Info
function SitePanel({ data, update, show }) {
  const s = { ...data.site }
  const set = (k, v) => update({ ...data, site: { ...data.site, [k]: v } })
  const setLoc = (lang, v) => update({ ...data, site: { ...data.site, location: { ...data.site.location, [lang]: v } } })

  return (
    <div>
      <p className="dash-section-sub">Basic site info shown in the footer and metadata.</p>
      <div className="dash-card">
        <div className="dash-card-header"><span className="dash-card-title">Site Settings</span></div>
        {[
          { label: 'Site Name', key: 'name' },
          { label: 'Tagline', key: 'tagline' },
          { label: 'Email', key: 'email' },
          { label: 'LinkedIn URL', key: 'linkedin' },
        ].map(f => (
          <div className="dash-field" key={f.key}>
            <label className="dash-label">{f.label}</label>
            <input className="dash-input" value={s[f.key]} onChange={e => set(f.key, e.target.value)} />
          </div>
        ))}
        <div className="dash-field">
          <label className="dash-label">Description (EN)</label>
          <textarea className="dash-textarea" value={typeof s.description === 'object' ? s.description.en : s.description}
            onChange={e => set('description', { en: e.target.value, ar: typeof s.description === 'object' ? s.description.ar : '' })} />
        </div>
        <div className="dash-field">
          <label className="dash-label">Description (AR)</label>
          <textarea className="dash-textarea" dir="rtl"
            value={typeof s.description === 'object' ? s.description.ar : ''}
            onChange={e => set('description', { en: typeof s.description === 'object' ? s.description.en : s.description, ar: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="dash-field">
            <label className="dash-label">Location (EN)</label>
            <input className="dash-input" value={s.location?.en || ''} onChange={e => setLoc('en', e.target.value)} />
          </div>
          <div className="dash-field">
            <label className="dash-label">Location (AR)</label>
            <input className="dash-input" dir="rtl" value={s.location?.ar || ''} onChange={e => setLoc('ar', e.target.value)} />
          </div>
        </div>
        <div className="dash-btn-row" style={{ marginTop: 8 }}>
          <button className="btn btn-primary btn-sm" onClick={() => show('Site info saved!')}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

// Services
function ServicesPanel({ data, update, show }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(null)
  const [lang, setLang] = useState('en')

  const services = data.services

  const startEdit = (svc) => {
    setEditing(svc.id)
    setForm(JSON.parse(JSON.stringify(svc)))
  }

  const startAdd = () => {
    const newSvc = {
      id: 'svc_' + Date.now(),
      tag: { en: 'Service', ar: 'خدمة' },
      name: { en: 'New Service', ar: 'خدمة جديدة' },
      desc: { en: '', ar: '' },
      features: []
    }
    setEditing('__new__')
    setForm(newSvc)
  }

  const saveEdit = () => {
    let newServices
    if (editing === '__new__') {
      newServices = [...services, form]
    } else {
      newServices = services.map(s => s.id === editing ? form : s)
    }
    update({ ...data, services: newServices })
    setEditing(null)
    setForm(null)
    show('Service saved!')
  }

  const deleteService = (id) => {
    if (!confirm('Delete this service?')) return
    update({ ...data, services: services.filter(s => s.id !== id) })
    show('Service deleted.')
  }

  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const setFLang = (key, lang, val) => setForm(f => ({ ...f, [key]: { ...(typeof f[key] === 'object' ? f[key] : { en: f[key], ar: '' }), [lang]: val } }))

  const addFeature = () => setForm(f => ({ ...f, features: [...f.features, { en: '', ar: '' }] }))
  const setFeature = (i, lang, val) => setForm(f => {
    const features = [...f.features]
    features[i] = { ...features[i], [lang]: val }
    return { ...f, features }
  })
  const removeFeature = (i) => setForm(f => ({ ...f, features: f.features.filter((_, j) => j !== i) }))

  if (editing && form) {
    return (
      <div>
        <div className="dash-card-header" style={{ marginBottom: 20 }}>
          <span className="dash-card-title">{editing === '__new__' ? 'Add Service' : 'Edit Service'}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(null); setForm(null) }}>← Back</button>
        </div>
        <div className="dash-tab-row">
          <button className={`dash-tab${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>English</button>
          <button className={`dash-tab${lang === 'ar' ? ' active' : ''}`} onClick={() => setLang('ar')}>العربية</button>
        </div>
        <div className="dash-card">
          <div className="dash-field">
            <label className="dash-label">Tag ({lang.toUpperCase()})</label>
            <input className="dash-input" value={typeof form.tag === 'object' ? form.tag[lang] || '' : form.tag}
              onChange={e => setFLang('tag', lang, e.target.value)} dir={lang === 'ar' ? 'rtl' : 'ltr'} />
          </div>
          <div className="dash-field">
            <label className="dash-label">Name ({lang.toUpperCase()})</label>
            <input className="dash-input" value={typeof form.name === 'object' ? form.name[lang] || '' : form.name}
              onChange={e => setFLang('name', lang, e.target.value)} dir={lang === 'ar' ? 'rtl' : 'ltr'} />
          </div>
          <div className="dash-field">
            <label className="dash-label">Description ({lang.toUpperCase()})</label>
            <textarea className="dash-textarea" value={form.desc?.[lang] || ''}
              onChange={e => setFLang('desc', lang, e.target.value)} dir={lang === 'ar' ? 'rtl' : 'ltr'} />
          </div>
          <div className="dash-field">
            <label className="dash-label">Features ({lang.toUpperCase()})</label>
            {form.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input className="dash-input" value={f[lang] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  onChange={e => setFeature(i, lang, e.target.value)} placeholder={`Feature ${i + 1}`} />
                <button className="btn btn-ghost btn-sm" style={{ color: '#f87171', flexShrink: 0 }} onClick={() => removeFeature(i)}>✕</button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 4 }} onClick={addFeature}>+ Add Feature</button>
          </div>
        </div>
        <div className="dash-btn-row">
          <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save Service</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(null); setForm(null) }}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="dash-section-sub">Manage all services shown on the Services page and Home page.</p>
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">All Services ({services.length})</span>
          <button className="btn btn-primary btn-sm" onClick={startAdd}>+ Add Service</button>
        </div>
        {services.map((svc, i) => (
          <div className="dash-list-item" key={svc.id}>
            <div>
              <div className="dash-list-name">{typeof svc.name === 'object' ? svc.name.en : svc.name}</div>
              <div className="dash-list-sub">{svc.features?.length || 0} features</div>
            </div>
            <div className="dash-list-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => startEdit(svc)}>Edit</button>
              <button className="btn btn-ghost btn-sm" style={{ color: '#f87171' }} onClick={() => deleteService(svc.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Team
function TeamPanel({ data, update, show }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(null)
  const team = data.about.team

  const startEdit = (i) => { setEditing(i); setForm(JSON.parse(JSON.stringify(team[i]))) }
  const startAdd = () => { setEditing('__new__'); setForm({ name: '', role: { en: '', ar: '' } }) }

  const save = () => {
    let newTeam
    if (editing === '__new__') newTeam = [...team, form]
    else { newTeam = [...team]; newTeam[editing] = form }
    update({ ...data, about: { ...data.about, team: newTeam } })
    setEditing(null); setForm(null)
    show('Team updated!')
  }

  const remove = (i) => {
    if (!confirm('Remove this team member?')) return
    const newTeam = team.filter((_, j) => j !== i)
    update({ ...data, about: { ...data.about, team: newTeam } })
    show('Team member removed.')
  }

  if (editing !== null && form) {
    return (
      <div>
        <div className="dash-card-header" style={{ marginBottom: 20 }}>
          <span className="dash-card-title">{editing === '__new__' ? 'Add Member' : 'Edit Member'}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(null); setForm(null) }}>← Back</button>
        </div>
        <div className="dash-card">
          <div className="dash-field">
            <label className="dash-label">Full Name</label>
            <input className="dash-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="dash-field">
            <label className="dash-label">Role (EN)</label>
            <input className="dash-input" value={form.role?.en || ''} onChange={e => setForm(f => ({ ...f, role: { ...f.role, en: e.target.value } }))} />
          </div>
          <div className="dash-field">
            <label className="dash-label">Role (AR)</label>
            <input className="dash-input" dir="rtl" value={form.role?.ar || ''} onChange={e => setForm(f => ({ ...f, role: { ...f.role, ar: e.target.value } }))} />
          </div>
        </div>
        <div className="dash-btn-row">
          <button className="btn btn-primary btn-sm" onClick={save}>Save Member</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(null); setForm(null) }}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="dash-section-sub">Manage team members shown on the About page.</p>
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Team Members ({team.length})</span>
          <button className="btn btn-primary btn-sm" onClick={startAdd}>+ Add Member</button>
        </div>
        {team.map((m, i) => (
          <div className="dash-list-item" key={i}>
            <div>
              <div className="dash-list-name">{m.name}</div>
              <div className="dash-list-sub">{typeof m.role === 'object' ? m.role.en : m.role}</div>
            </div>
            <div className="dash-list-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => startEdit(i)}>Edit</button>
              <button className="btn btn-ghost btn-sm" style={{ color: '#f87171' }} onClick={() => remove(i)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Work/Projects
function WorkPanel({ data, update, show }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(null)
  const [tag, setTag] = useState('')
  const projects = data.work.projects

  const startEdit = (i) => { setEditing(i); setForm(JSON.parse(JSON.stringify(projects[i]))) }
  const startAdd = () => {
    setEditing('__new__')
    setForm({ id: 'proj_' + Date.now(), label: 'PROJECT', title: { en: '', ar: '' }, desc: { en: '', ar: '' }, tags: [] })
  }

  const save = () => {
    let newProj
    if (editing === '__new__') newProj = [...projects, form]
    else { newProj = [...projects]; newProj[editing] = form }
    update({ ...data, work: { ...data.work, projects: newProj } })
    setEditing(null); setForm(null)
    show('Project saved!')
  }

  const remove = (i) => {
    if (!confirm('Delete this project?')) return
    update({ ...data, work: { ...data.work, projects: projects.filter((_, j) => j !== i) } })
    show('Project deleted.')
  }

  const addTag = () => {
    if (!tag.trim()) return
    setForm(f => ({ ...f, tags: [...f.tags, tag.trim()] }))
    setTag('')
  }
  const removeTag = (i) => setForm(f => ({ ...f, tags: f.tags.filter((_, j) => j !== i) }))

  if (editing !== null && form) {
    return (
      <div>
        <div className="dash-card-header" style={{ marginBottom: 20 }}>
          <span className="dash-card-title">{editing === '__new__' ? 'Add Project' : 'Edit Project'}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(null); setForm(null) }}>← Back</button>
        </div>
        <div className="dash-card">
          <div className="dash-field">
            <label className="dash-label">Label (e.g. PROJECT ALPHA)</label>
            <input className="dash-input" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
          </div>
          <div className="dash-field">
            <label className="dash-label">Title (EN)</label>
            <input className="dash-input" value={form.title?.en || ''} onChange={e => setForm(f => ({ ...f, title: { ...f.title, en: e.target.value } }))} />
          </div>
          <div className="dash-field">
            <label className="dash-label">Title (AR)</label>
            <input className="dash-input" dir="rtl" value={form.title?.ar || ''} onChange={e => setForm(f => ({ ...f, title: { ...f.title, ar: e.target.value } }))} />
          </div>
          <div className="dash-field">
            <label className="dash-label">Description (EN)</label>
            <textarea className="dash-textarea" value={form.desc?.en || ''} onChange={e => setForm(f => ({ ...f, desc: { ...f.desc, en: e.target.value } }))} />
          </div>
          <div className="dash-field">
            <label className="dash-label">Description (AR)</label>
            <textarea className="dash-textarea" dir="rtl" value={form.desc?.ar || ''} onChange={e => setForm(f => ({ ...f, desc: { ...f.desc, ar: e.target.value } }))} />
          </div>
          <div className="dash-field">
            <label className="dash-label">Tags</label>
            <div className="dash-tag-row">
              {form.tags.map((t, i) => (
                <span className="dash-tag" key={i}>{t} <button onClick={() => removeTag(i)}>×</button></span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input className="dash-input" value={tag} onChange={e => setTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add tag & press Enter" style={{ flex: 1 }} />
              <button className="btn btn-ghost btn-sm" onClick={addTag}>Add</button>
            </div>
          </div>
        </div>
        <div className="dash-btn-row">
          <button className="btn btn-primary btn-sm" onClick={save}>Save Project</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(null); setForm(null) }}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="dash-section-sub">Manage projects and case studies shown on the Work page.</p>
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Projects ({projects.length})</span>
          <button className="btn btn-primary btn-sm" onClick={startAdd}>+ Add Project</button>
        </div>
        {projects.map((p, i) => (
          <div className="dash-list-item" key={p.id}>
            <div>
              <div className="dash-list-name">{typeof p.title === 'object' ? p.title.en : p.title}</div>
              <div className="dash-list-sub">{p.label} · {p.tags?.join(', ')}</div>
            </div>
            <div className="dash-list-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => startEdit(i)}>Edit</button>
              <button className="btn btn-ghost btn-sm" style={{ color: '#f87171' }} onClick={() => remove(i)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// About
function AboutPanel({ data, update, show }) {
  const a = data.about
  const [lang, setLang] = useState('en')

  const setAbout = (key, subkey, val) => {
    const newAbout = JSON.parse(JSON.stringify(a))
    if (subkey) newAbout[key][subkey] = val
    else newAbout[key] = val
    update({ ...data, about: newAbout })
  }

  const setPrinciple = (i, field, lang, val) => {
    const principles = JSON.parse(JSON.stringify(a.principles))
    if (field === 'mark') principles[i].mark = val
    else principles[i][field][lang] = val
    update({ ...data, about: { ...a, principles } })
  }

  return (
    <div>
      <p className="dash-section-sub">Edit the About page content — vision, mission, and principles.</p>
      <div className="dash-tab-row">
        <button className={`dash-tab${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>English</button>
        <button className={`dash-tab${lang === 'ar' ? ' active' : ''}`} onClick={() => setLang('ar')}>العربية</button>
      </div>

      <div className="dash-card">
        <div className="dash-card-header"><span className="dash-card-title">Hero</span></div>
        <div className="dash-field">
          <label className="dash-label">Eyebrow</label>
          <input className="dash-input" value={a.hero.eyebrow?.[lang] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'}
            onChange={e => setAbout('hero', null, { ...a.hero, eyebrow: { ...a.hero.eyebrow, [lang]: e.target.value } })} />
        </div>
        <div className="dash-field">
          <label className="dash-label">Quote</label>
          <textarea className="dash-textarea" value={a.hero.quote?.[lang] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'}
            onChange={e => setAbout('hero', null, { ...a.hero, quote: { ...a.hero.quote, [lang]: e.target.value } })} />
        </div>
        <div className="dash-btn-row"><button className="btn btn-primary btn-sm" onClick={() => show('Saved!')}>Save</button></div>
      </div>

      <div className="dash-card">
        <div className="dash-card-header"><span className="dash-card-title">Vision & Mission</span></div>
        {['vision', 'mission'].map(section => (
          <div key={section} style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8 }}>{section}</div>
            <div className="dash-field">
              <label className="dash-label">Title</label>
              <input className="dash-input" value={a[section].title?.[lang] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'}
                onChange={e => setAbout(section, null, { ...a[section], title: { ...a[section].title, [lang]: e.target.value } })} />
            </div>
            <div className="dash-field">
              <label className="dash-label">Description</label>
              <textarea className="dash-textarea" value={a[section].desc?.[lang] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'}
                onChange={e => setAbout(section, null, { ...a[section], desc: { ...a[section].desc, [lang]: e.target.value } })} />
            </div>
          </div>
        ))}
        <div className="dash-btn-row"><button className="btn btn-primary btn-sm" onClick={() => show('Saved!')}>Save</button></div>
      </div>

      <div className="dash-card">
        <div className="dash-card-header"><span className="dash-card-title">Principles</span></div>
        {a.principles.map((p, i) => (
          <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
            <div className="dash-field">
              <label className="dash-label">Mark (badge text)</label>
              <input className="dash-input" value={p.mark} onChange={e => setPrinciple(i, 'mark', null, e.target.value)} />
            </div>
            <div className="dash-field">
              <label className="dash-label">Title</label>
              <input className="dash-input" value={p.title?.[lang] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'}
                onChange={e => setPrinciple(i, 'title', lang, e.target.value)} />
            </div>
            <div className="dash-field">
              <label className="dash-label">Description</label>
              <textarea className="dash-textarea" value={p.desc?.[lang] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'}
                onChange={e => setPrinciple(i, 'desc', lang, e.target.value)} />
            </div>
          </div>
        ))}
        <div className="dash-btn-row"><button className="btn btn-primary btn-sm" onClick={() => show('Saved!')}>Save</button></div>
      </div>
    </div>
  )
}

// Home Content
function HomePanel({ data, update, show }) {
  const h = data.home
  const [lang, setLang] = useState('en')

  const setHome = (key, val) => update({ ...data, home: { ...h, [key]: val } })

  const setStep = (i, field, val) => {
    const steps = JSON.parse(JSON.stringify(h.process.steps))
    if (field === 'num') steps[i].num = val
    else steps[i][field][lang] = val
    setHome('process', { ...h.process, steps })
  }

  return (
    <div>
      <p className="dash-section-sub">Edit the Home page hero, process steps, and CTA.</p>
      <div className="dash-tab-row">
        <button className={`dash-tab${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>English</button>
        <button className={`dash-tab${lang === 'ar' ? ' active' : ''}`} onClick={() => setLang('ar')}>العربية</button>
      </div>

      <div className="dash-card">
        <div className="dash-card-header"><span className="dash-card-title">Hero Section</span></div>
        {[
          { label: 'Eyebrow text', path: 'eyebrow' },
          { label: 'Title', path: 'title' },
          { label: 'Lead paragraph', path: 'lead' },
        ].map(f => (
          <div className="dash-field" key={f.path}>
            <label className="dash-label">{f.label}</label>
            <textarea className="dash-textarea" value={h.hero[f.path]?.[lang] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'}
              onChange={e => setHome('hero', { ...h.hero, [f.path]: { ...h.hero[f.path], [lang]: e.target.value } })} />
          </div>
        ))}
        <div className="dash-btn-row"><button className="btn btn-primary btn-sm" onClick={() => show('Hero saved!')}>Save</button></div>
      </div>

      <div className="dash-card">
        <div className="dash-card-header"><span className="dash-card-title">Process Steps</span></div>
        {h.process.steps.map((step, i) => (
          <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--acc)', marginBottom: 8 }}>Step {step.num}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 8 }}>
              <div className="dash-field">
                <label className="dash-label">Number</label>
                <input className="dash-input" value={step.num} onChange={e => setStep(i, 'num', e.target.value)} />
              </div>
              <div className="dash-field">
                <label className="dash-label">Title</label>
                <input className="dash-input" value={step.title?.[lang] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  onChange={e => setStep(i, 'title', e.target.value)} />
              </div>
            </div>
            <div className="dash-field">
              <label className="dash-label">Description</label>
              <textarea className="dash-textarea" value={step.desc?.[lang] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'}
                onChange={e => setStep(i, 'desc', e.target.value)} />
            </div>
          </div>
        ))}
        <div className="dash-btn-row"><button className="btn btn-primary btn-sm" onClick={() => show('Process saved!')}>Save</button></div>
      </div>

      <div className="dash-card">
        <div className="dash-card-header"><span className="dash-card-title">CTA Band</span></div>
        <div className="dash-field">
          <label className="dash-label">Title</label>
          <textarea className="dash-textarea" value={h.cta.title?.[lang] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'}
            onChange={e => setHome('cta', { ...h.cta, title: { ...h.cta.title, [lang]: e.target.value } })} />
        </div>
        <div className="dash-field">
          <label className="dash-label">Button Text</label>
          <input className="dash-input" value={h.cta.btn?.[lang] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'}
            onChange={e => setHome('cta', { ...h.cta, btn: { ...h.cta.btn, [lang]: e.target.value } })} />
        </div>
        <div className="dash-btn-row"><button className="btn btn-primary btn-sm" onClick={() => show('CTA saved!')}>Save</button></div>
      </div>
    </div>
  )
}

// Admins panel
function AdminsPanel({ show }) {
  const { user, getAdmins, removeAdmin } = useAuth()
  const [admins, setAdmins] = useState(() => getAdmins())

  const remove = (email) => {
    try {
      removeAdmin(email)
      setAdmins(getAdmins())
      show('Admin removed.')
    } catch (e) { show(e.message, 'error') }
  }

  return (
    <div>
      <p className="dash-section-sub">Admin accounts with dashboard access. To add a new admin, share the invite code <strong style={{ color: 'var(--acc)' }}>MM-ADMIN-2024</strong> and have them sign up.</p>
      <div className="dash-card">
        <div className="dash-card-header"><span className="dash-card-title">Admin Accounts ({admins.length})</span></div>
        {admins.map((a) => (
          <div className="dash-list-item" key={a.email}>
            <div>
              <div className="dash-list-name">{a.name} {a.email === user?.email && <span style={{ fontSize: 11, color: 'var(--acc)', marginLeft: 6 }}>(you)</span>}</div>
              <div className="dash-list-sub">{a.email} · {new Date(a.createdAt).toLocaleDateString()}</div>
            </div>
            {a.email !== user?.email && (
              <button className="btn btn-ghost btn-sm" style={{ color: '#f87171' }} onClick={() => remove(a.email)}>Remove</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────
const PANELS = [
  { id: 'home', label: 'Home Content', icon: '🏠' },
  { id: 'services', label: 'Services', icon: '⚙️' },
  { id: 'about', label: 'About Page', icon: 'ℹ️' },
  { id: 'team', label: 'Team Members', icon: '👥' },
  { id: 'work', label: 'Work / Projects', icon: '💼' },
  { id: 'site', label: 'Site Settings', icon: '🌐' },
  { id: 'admins', label: 'Admin Accounts', icon: '🔑' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { data, update } = useData()
  const [active, setActive] = useState('home')
  const { toast, show } = useToast()

  const panelProps = { data, update, show }

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-top">
          <img src={logo} alt="logo" />
          <span className="dash-sidebar-title">Dashboard</span>
        </div>
        <nav className="dash-nav">
          {PANELS.map(p => (
            <button key={p.id} className={`dash-nav-item${active === p.id ? ' active' : ''}`} onClick={() => setActive(p.id)}>
              <span>{p.icon}</span> {p.label}
            </button>
          ))}
        </nav>
        <button className="signout-btn" onClick={logout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          Sign out
        </button>
      </aside>

      <div className="dash-main">
        <div className="dash-topbar">
          <span className="dash-topbar-title">{PANELS.find(p => p.id === active)?.label}</span>
          <div className="dash-user">
            <div className="dash-avatar">{(user?.name || user?.email || 'A')[0].toUpperCase()}</div>
            <span className="dash-username">{user?.name || user?.email}</span>
          </div>
        </div>

        <div className="dash-content">
          <div className="dash-section-title">{PANELS.find(p => p.id === active)?.label}</div>
          {active === 'home' && <HomePanel {...panelProps} />}
          {active === 'services' && <ServicesPanel {...panelProps} />}
          {active === 'about' && <AboutPanel {...panelProps} />}
          {active === 'team' && <TeamPanel {...panelProps} />}
          {active === 'work' && <WorkPanel {...panelProps} />}
          {active === 'site' && <SitePanel {...panelProps} />}
          {active === 'admins' && <AdminsPanel show={show} />}
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  )
}
