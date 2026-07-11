import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { useData } from '../context/DataContext'

export default function Contact() {
  const { t } = useLang()
  const { data } = useData()
  const s = data.site
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`New inquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n${form.email}`)
    window.location.href = `mailto:${s.email}?subject=${subject}&body=${body}`
  }

  return (
    <>
      <section className="hero" style={{ padding: '80px 0 50px' }}>
        <div className="container">
          <span className="eyebrow">{t({ en: 'Contact', ar: 'تواصل معنا' })}</span>
          <h1 style={{ marginTop: 18, fontSize: 'clamp(30px,4vw,46px)', color: '#fff', maxWidth: '18ch' }}>
            {t({ en: "Let's build something together.", ar: 'خليننا نبني حاجة مع بعض.' })}
          </h1>
          <p className="lead" style={{ marginTop: 20 }}>
            {t({ en: "Tell us what you're working on and we'll figure out the best way to help.", ar: "قولنا بتشتغل على إيه وهنفكر في أفضل طريقة نساعد بيها." })}
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="contact-grid">
            <form className="form" onSubmit={handleSubmit}>
              <div>
                <label className="field-label">{t({ en: 'Full name', ar: 'الاسم الكامل' })}</label>
                <input className="field-input" name="name" required
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder={t({ en: 'Your name', ar: 'اسمك' })} />
              </div>
              <div>
                <label className="field-label">{t({ en: 'Email', ar: 'البريد الإلكتروني' })}</label>
                <input className="field-input" name="email" type="email" required
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder={t({ en: 'you@company.com', ar: 'بريدك@شركتك.com' })} />
              </div>
              <div>
                <label className="field-label">{t({ en: 'Message', ar: 'الرسالة' })}</label>
                <textarea className="field-textarea" name="message" required
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder={t({ en: "Tell us about your project...", ar: "احكيلنا عن مشروعك..." })} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                {t({ en: 'Send message', ar: 'ابعت الرسالة' })}
              </button>
            </form>

            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <div>
                  <h4>{t({ en: 'Email us', ar: 'راسلنا' })}</h4>
                  <p><a href={`mailto:${s.email}`} style={{ color: '#fff' }}>{s.email}</a></p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                </div>
                <div>
                  <h4>LinkedIn</h4>
                  <p><a href={s.linkedin} target="_blank" rel="noopener" style={{ color: '#fff' }}>Minds Makers</a></p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <div>
                  <h4>{t({ en: 'Location', ar: 'الموقع' })}</h4>
                  <p style={{ color: '#fff' }}>{t(s.location)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
