import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { useData } from '../context/DataContext'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const SERVICE_TYPES = [
  { en: 'NEXORA — AI Testing & QA Automation', ar: 'نيكسورا — اختبار وأتمتة ضمان الجودة بالذكاء الاصطناعي' },
  { en: 'CIPHERA — Cybersecurity & Identity', ar: 'سيفيرا — الأمن السيبراني والهوية' },
  { en: 'Custom Software Engineering', ar: 'هندسة برمجيات مخصصة' },
  { en: 'Consulting & Systems Integration', ar: 'استشارات وتكامل أنظمة' },
  { en: 'Training & Certification', ar: 'تدريب وشهادات' },
  { en: 'Other / Not sure yet', ar: 'أخرى / لست متأكد بعد' },
]

const BUDGET_OPTIONS = [
  { en: 'Under $5,000', ar: 'أقل من $5,000' },
  { en: '$5,000 – $15,000', ar: '$5,000 – $15,000' },
  { en: '$15,000 – $50,000', ar: '$15,000 – $50,000' },
  { en: '$50,000+', ar: '$50,000+' },
  { en: 'Prefer not to say', ar: 'أفضل عدم الإفصاح' },
]

function ContactForm({ t, email }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Message from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.email}`)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
    setSent(true)
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

function ServiceRequestForm({ t, siteEmail }) {
  const empty = { name: '', email: '', phone: '', company: '', jobTitle: '', serviceType: '', budget: '', description: '' }
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [errMsg, setErrMsg] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.serviceType || !form.description) {
      setErrMsg(t({ en: 'Please fill in all required fields.', ar: 'من فضلك املأ جميع الحقول المطلوبة.' }))
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrMsg('')

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('service_requests').insert({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          company: form.company || null,
          job_title: form.jobTitle || null,
          service_type: form.serviceType,
          budget: form.budget || null,
          description: form.description,
          status: 'new',
        })
        if (error) throw error
      } else {
        // Fallback: open email client
        const subject = encodeURIComponent(`Service Request from ${form.name}`)
        const body = encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCompany: ${form.company}\nJob: ${form.jobTitle}\nService: ${form.serviceType}\nBudget: ${form.budget}\n\n${form.description}`
        )
        window.open(`mailto:${siteEmail}?subject=${subject}&body=${body}`)
      }
      setStatus('success')
      setForm(empty)
    } catch (err) {
      setErrMsg(err.message)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        padding: '40px 32px', textAlign: 'center',
        background: 'rgba(79,216,255,.04)', border: '1px solid rgba(79,216,255,.15)',
        borderRadius: 'var(--r-lg)'
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
        <h3 style={{ color: '#fff', marginBottom: 12 }}>
          {t({ en: 'Request received!', ar: 'تم استلام طلبك!' })}
        </h3>
        <p style={{ fontSize: 14 }}>
          {t({ en: "We'll review your request and get back to you within 24 hours.", ar: 'هنراجع طلبك ونرد عليك خلال 24 ساعة.' })}
        </p>
        <button className="btn btn-ghost" style={{ marginTop: 24 }} onClick={() => setStatus(null)}>
          {t({ en: 'Submit another request', ar: 'إرسال طلب آخر' })}
        </button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {status === 'error' && (
        <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.3)', borderRadius: 'var(--r-sm)', fontSize: 13, color: '#f87171' }}>
          {errMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label className="field-label">{t({ en: 'Full name *', ar: 'الاسم الكامل *' })}</label>
          <input className="field-input" required value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder={t({ en: 'Your name', ar: 'اسمك' })} />
        </div>
        <div>
          <label className="field-label">{t({ en: 'Email *', ar: 'البريد الإلكتروني *' })}</label>
          <input className="field-input" type="email" required value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="you@company.com" />
        </div>
        <div>
          <label className="field-label">{t({ en: 'Phone', ar: 'رقم الهاتف' })}</label>
          <input className="field-input" value={form.phone}
            onChange={e => set('phone', e.target.value)}
            placeholder="+20 xxx xxx xxxx" />
        </div>
        <div>
          <label className="field-label">{t({ en: 'Company', ar: 'الشركة' })}</label>
          <input className="field-input" value={form.company}
            onChange={e => set('company', e.target.value)}
            placeholder={t({ en: 'Company name (if any)', ar: 'اسم الشركة (إن وجد)' })} />
        </div>
        <div>
          <label className="field-label">{t({ en: 'Job Title', ar: 'المسمى الوظيفي' })}</label>
          <input className="field-input" value={form.jobTitle}
            onChange={e => set('jobTitle', e.target.value)}
            placeholder={t({ en: 'e.g. CTO, Product Manager', ar: 'مثال: مدير تقني، مدير منتج' })} />
        </div>
        <div>
          <label className="field-label">{t({ en: 'Budget', ar: 'الميزانية' })}</label>
          <select className="field-input" value={form.budget} onChange={e => set('budget', e.target.value)}>
            <option value="">{t({ en: 'Select range…', ar: 'اختر النطاق…' })}</option>
            {BUDGET_OPTIONS.map((b, i) => (
              <option key={i} value={b.en}>{t(b)}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="field-label">{t({ en: 'Service needed *', ar: 'الخدمة المطلوبة *' })}</label>
        <select className="field-input" required value={form.serviceType} onChange={e => set('serviceType', e.target.value)}>
          <option value="">{t({ en: 'Select a service…', ar: 'اختر خدمة…' })}</option>
          {SERVICE_TYPES.map((s, i) => (
            <option key={i} value={s.en}>{t(s)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label">{t({ en: 'Describe your project *', ar: 'وصف مشروعك *' })}</label>
        <textarea className="field-textarea" required value={form.description}
          style={{ minHeight: 140 }}
          onChange={e => set('description', e.target.value)}
          placeholder={t({ en: 'Tell us what you need, what problems you\'re facing, and any relevant details…', ar: 'احكيلنا إيه اللي محتاجه، والتحديات اللي بتواجهها، وأي تفاصيل مهمة…' })} />
      </div>

      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={status === 'loading'}>
        {status === 'loading'
          ? t({ en: 'Submitting…', ar: 'جاري الإرسال…' })
          : t({ en: 'Submit Request', ar: 'إرسال الطلب' })}
      </button>
    </form>
  )
}

export default function Contact() {
  const { t } = useLang()
  const { data } = useData()
  const s = data.site
  const [tab, setTab] = useState('request')

  return (
    <>
      <section className="hero" style={{ padding: '80px 0 50px' }}>
        <div className="container">
          <span className="eyebrow">{t({ en: 'Contact', ar: 'تواصل معنا' })}</span>
          <h1 style={{ marginTop: 18, fontSize: 'clamp(30px,4vw,46px)', color: '#fff', maxWidth: '18ch' }}>
            {t({ en: "Let's build something together.", ar: 'خليننا نبني حاجة مع بعض.' })}
          </h1>
          <p className="lead" style={{ marginTop: 20 }}>
            {t({ en: "Tell us what you're working on and we'll figure out the best way to help.", ar: 'قولنا بتشتغل على إيه وهنفكر في أفضل طريقة نساعد بيها.' })}
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">

          {/* ── Tabs ── */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 40, borderBottom: '1px solid var(--line)', paddingBottom: 0 }}>
            {[
              { id: 'request', en: 'Request a Service', ar: 'اطلب خدمة' },
              { id: 'contact', en: 'General Enquiry', ar: 'استفسار عام' },
            ].map(tb => (
              <button key={tb.id}
                onClick={() => setTab(tb.id)}
                style={{
                  padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  border: 'none', background: 'none', marginBottom: -1,
                  borderBottom: tab === tb.id ? '2px solid var(--acc)' : '2px solid transparent',
                  color: tab === tb.id ? 'var(--acc)' : 'var(--text-faint)',
                  transition: 'all .15s'
                }}>
                {t(tb)}
              </button>
            ))}
          </div>

          <div className="contact-grid">
            <div>
              {tab === 'request'
                ? <ServiceRequestForm t={t} siteEmail={s.email} />
                : <ContactForm t={t} email={s.email} />}
            </div>

            {/* ── Contact Info ── */}
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

              {/* Response time note */}
              <div style={{
                padding: '16px 20px',
                background: 'rgba(79,216,255,.04)',
                border: '1px solid rgba(79,216,255,.12)',
                borderRadius: 'var(--r-md)',
                fontSize: 13,
              }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: 6 }}>
                  {t({ en: 'Response time', ar: 'وقت الرد' })}
                </strong>
                {t({ en: 'We typically respond within 24 hours on business days.', ar: 'بنرد عادةً خلال 24 ساعة في أيام العمل.' })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
