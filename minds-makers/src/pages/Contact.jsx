import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { useData } from '../context/DataContext'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export default function Contact() {
  const { t } = useLang()
  const { data } = useData()
  const s = data.site
  const c = data.contact
  const [tab, setTab] = useState('request')

  return (
    <>
      <section className="hero" style={{ padding: '80px 0 50px' }}>
        <div className="container">
          <span className="eyebrow">{t(c.hero.eyebrow)}</span>
          <h1 style={{ marginTop: 18, fontSize: 'clamp(30px,4vw,46px)', color: '#fff', maxWidth: '18ch' }}>
            {t(c.hero.title)}
          </h1>
          <p className="lead" style={{ marginTop: 20 }}>{t(c.hero.lead)}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* ── Tabs ── */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 40, borderBottom: '1px solid var(--line)' }}>
            {[
              { id: 'request', label: c.tabs.request },
              { id: 'contact', label: c.tabs.general },
            ].map(tb => (
              <button key={tb.id} onClick={() => setTab(tb.id)} style={{
                padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                border: 'none', background: 'none', marginBottom: -1,
                borderBottom: tab === tb.id ? '2px solid var(--acc)' : '2px solid transparent',
                color: tab === tb.id ? 'var(--acc)' : 'var(--text-faint)', transition: 'all .15s'
              }}>
                {t(tb.label)}
              </button>
            ))}
          </div>

          <div className="contact-grid">
            <div>
              {tab === 'request'
                ? <ServiceRequestForm t={t} c={c} siteEmail={s.email} />
                : <ContactForm t={t} email={s.email} />}
            </div>
            <ContactInfo t={t} s={s} c={c} />
          </div>
        </div>
      </section>
    </>
  )
}

// ── General Contact Form ──────────────────────
function ContactForm({ t, email }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Message from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.email}`)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <label className="field-label">{t({ en: 'Full name', ar: 'الاسم الكامل' })}</label>
        <input className="field-input" required value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder={t({ en: 'Your name', ar: 'اسمك' })} />
      </div>
      <div>
        <label className="field-label">{t({ en: 'Email', ar: 'البريد الإلكتروني' })}</label>
        <input className="field-input" type="email" required value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="you@company.com" />
      </div>
      <div>
        <label className="field-label">{t({ en: 'Message', ar: 'الرسالة' })}</label>
        <textarea className="field-textarea" required value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder={t({ en: 'How can we help?', ar: 'كيف يمكننا مساعدتك؟' })} />
      </div>
      <button type="submit" className="btn btn-ghost" style={{ alignSelf: 'flex-start' }}>
        {t({ en: 'Send message', ar: 'ابعت الرسالة' })}
      </button>
    </form>
  )
}

// ── Service Request Form ──────────────────────
function ServiceRequestForm({ t, c, siteEmail }) {
  const emptyForm = { name: '', email: '', phone: '', company: '', jobTitle: '', serviceType: '', budget: '', description: '' }
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState(null)
  const [errMsg, setErrMsg] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Only show enabled fields
  const fields = c.fields || {}
  const show = (key) => fields[key]?.enabled !== false

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Check required fields based on config
    const requiredFields = Object.entries(fields).filter(([_, f]) => f.enabled && f.required).map(([k]) => k)
    const missing = requiredFields.find(k => {
      const map = { serviceType: 'serviceType', jobTitle: 'jobTitle' }
      return !form[map[k] || k]
    })
    if (missing) {
      setErrMsg(t({ en: 'Please fill in all required fields.', ar: 'من فضلك املأ جميع الحقول المطلوبة.' }))
      setStatus('error'); return
    }
    setStatus('loading'); setErrMsg('')
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('service_requests').insert({
          name: form.name, email: form.email,
          phone: form.phone || null, company: form.company || null,
          job_title: form.jobTitle || null, service_type: form.serviceType,
          budget: form.budget || null, description: form.description, status: 'new',
        })
        if (error) throw error
      } else {
        const subject = encodeURIComponent(`Service Request from ${form.name}`)
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCompany: ${form.company}\nJob: ${form.jobTitle}\nService: ${form.serviceType}\nBudget: ${form.budget}\n\n${form.description}`)
        window.open(`mailto:${siteEmail}?subject=${subject}&body=${body}`)
      }
      setStatus('success'); setForm(emptyForm)
    } catch (err) { setErrMsg(err.message); setStatus('error') }
  }

  if (status === 'success') return (
    <div style={{ padding: '40px 32px', textAlign: 'center', background: 'rgba(79,216,255,.04)', border: '1px solid rgba(79,216,255,.15)', borderRadius: 'var(--r-lg)' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
      <h3 style={{ color: '#fff', marginBottom: 12 }}>{t({ en: 'Request received!', ar: 'تم استلام طلبك!' })}</h3>
      <p style={{ fontSize: 14 }}>{t(c.successMessage)}</p>
      <button className="btn btn-ghost" style={{ marginTop: 24 }} onClick={() => setStatus(null)}>
        {t({ en: 'Submit another request', ar: 'إرسال طلب آخر' })}
      </button>
    </div>
  )

  return (
    <form className="form" onSubmit={handleSubmit}>
      {status === 'error' && (
        <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.3)', borderRadius: 'var(--r-sm)', fontSize: 13, color: '#f87171' }}>
          {errMsg}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {show('name') && (
          <div>
            <label className="field-label">{t(fields.name?.label || { en: 'Full name', ar: 'الاسم الكامل' })}{fields.name?.required && ' *'}</label>
            <input className="field-input" value={form.name} onChange={e => set('name', e.target.value)} required={fields.name?.required} placeholder={t({ en: 'Your name', ar: 'اسمك' })} />
          </div>
        )}
        {show('email') && (
          <div>
            <label className="field-label">{t(fields.email?.label || { en: 'Email', ar: 'البريد الإلكتروني' })}{fields.email?.required && ' *'}</label>
            <input className="field-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} required={fields.email?.required} placeholder="you@company.com" />
          </div>
        )}
        {show('phone') && (
          <div>
            <label className="field-label">{t(fields.phone?.label || { en: 'Phone', ar: 'رقم الهاتف' })}</label>
            <input className="field-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+20 xxx xxx xxxx" />
          </div>
        )}
        {show('company') && (
          <div>
            <label className="field-label">{t(fields.company?.label || { en: 'Company', ar: 'الشركة' })}</label>
            <input className="field-input" value={form.company} onChange={e => set('company', e.target.value)} placeholder={t({ en: 'Company name', ar: 'اسم الشركة' })} />
          </div>
        )}
        {show('jobTitle') && (
          <div>
            <label className="field-label">{t(fields.jobTitle?.label || { en: 'Job Title', ar: 'المسمى الوظيفي' })}</label>
            <input className="field-input" value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder={t({ en: 'e.g. CTO', ar: 'مثال: مدير تقني' })} />
          </div>
        )}
        {show('budget') && (
          <div>
            <label className="field-label">{t(fields.budget?.label || { en: 'Budget', ar: 'الميزانية' })}</label>
            <select className="field-input" value={form.budget} onChange={e => set('budget', e.target.value)}>
              <option value="">{t({ en: 'Select range…', ar: 'اختر النطاق…' })}</option>
              {(c.budgetOptions || []).map((b, i) => <option key={i} value={b.en}>{t(b)}</option>)}
            </select>
          </div>
        )}
      </div>
      {show('serviceType') && (
        <div>
          <label className="field-label">{t(fields.serviceType?.label || { en: 'Service needed', ar: 'الخدمة المطلوبة' })}{fields.serviceType?.required && ' *'}</label>
          <select className="field-input" value={form.serviceType} onChange={e => set('serviceType', e.target.value)} required={fields.serviceType?.required}>
            <option value="">{t({ en: 'Select a service…', ar: 'اختر خدمة…' })}</option>
            {(c.serviceTypes || []).map((s, i) => <option key={i} value={s.en}>{t(s)}</option>)}
          </select>
        </div>
      )}
      {show('description') && (
        <div>
          <label className="field-label">{t(fields.description?.label || { en: 'Describe your project', ar: 'وصف مشروعك' })}{fields.description?.required && ' *'}</label>
          <textarea className="field-textarea" style={{ minHeight: 140 }} value={form.description}
            onChange={e => set('description', e.target.value)} required={fields.description?.required}
            placeholder={t({ en: "Tell us what you need…", ar: "احكيلنا إيه اللي محتاجه…" })} />
        </div>
      )}
      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={status === 'loading'}>
        {status === 'loading' ? t({ en: 'Submitting…', ar: 'جاري الإرسال…' }) : t({ en: 'Submit Request', ar: 'إرسال الطلب' })}
      </button>
    </form>
  )
}

// ── Contact Info Sidebar ──────────────────────
function ContactInfo({ t, s, c }) {
  return (
    <div className="contact-info">
      <div className="contact-item">
        <div className="contact-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div>
          <h4>{t({ en: 'Email us', ar: 'راسلنا' })}</h4>
          <p><a href={`mailto:${s.email}`} style={{ color: '#fff' }}>{s.email}</a></p>
        </div>
      </div>
      <div className="contact-item">
        <div className="contact-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
          </svg>
        </div>
        <div>
          <h4>LinkedIn</h4>
          <p><a href={s.linkedin} target="_blank" rel="noopener" style={{ color: '#fff' }}>Minds Makers</a></p>
        </div>
      </div>
      <div className="contact-item">
        <div className="contact-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div>
          <h4>{t({ en: 'Location', ar: 'الموقع' })}</h4>
          <p style={{ color: '#fff' }}>{t(s.location)}</p>
        </div>
      </div>
      <div style={{ padding: '16px 20px', background: 'rgba(79,216,255,.04)', border: '1px solid rgba(79,216,255,.12)', borderRadius: 'var(--r-md)', fontSize: 13 }}>
        <strong style={{ color: '#fff', display: 'block', marginBottom: 6 }}>
          {t({ en: 'Response time', ar: 'وقت الرد' })}
        </strong>
        {t(c.responseTime)}
      </div>
    </div>
  )
}
