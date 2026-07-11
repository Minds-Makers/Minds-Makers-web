import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useData } from '../context/DataContext'

const SynapseIcon = () => (
  <svg viewBox="0 0 480 480" style={{ width: '100%', height: 'auto' }}>
    <defs>
      <linearGradient id="syn-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4fd8ff" />
        <stop offset="1" stopColor="#2e6bff" />
      </linearGradient>
    </defs>
    <path className="syn-line" d="M240,240 L120,110" />
    <path className="syn-line" d="M240,240 L360,90" />
    <path className="syn-line" d="M240,240 L90,260" />
    <path className="syn-line" d="M240,240 L380,280" />
    <path className="syn-line" d="M240,240 L160,400" />
    <path className="syn-line" d="M240,240 L320,390" />
    <path className="syn-line" d="M120,110 L90,260" />
    <path className="syn-line" d="M360,90 L380,280" />
    <path className="syn-line" d="M160,400 L320,390" />
    <circle className="syn-node lit" cx="240" cy="240" r="9" />
    <circle className="syn-node" cx="120" cy="110" r="6" />
    <circle className="syn-node" cx="360" cy="90" r="6" />
    <circle className="syn-node" cx="90" cy="260" r="6" />
    <circle className="syn-node" cx="380" cy="280" r="6" />
    <circle className="syn-node" cx="160" cy="400" r="6" />
    <circle className="syn-node" cx="320" cy="390" r="6" />
    <circle className="syn-pulse" r="3"><animateMotion dur="3.2s" repeatCount="indefinite" path="M240,240 L120,110" /></circle>
    <circle className="syn-pulse" r="3"><animateMotion dur="3.2s" repeatCount="indefinite" path="M240,240 L380,280" begin="0.6s" /></circle>
    <circle className="syn-pulse" r="3"><animateMotion dur="3.2s" repeatCount="indefinite" path="M240,240 L160,400" begin="1.2s" /></circle>
    <circle className="syn-pulse" r="3"><animateMotion dur="3.2s" repeatCount="indefinite" path="M240,240 L360,90" begin="1.8s" /></circle>
    <text className="syn-label" x="95" y="100">QA</text>
    <text className="syn-label" x="335" y="80">SECURITY</text>
    <text className="syn-label" x="40" y="255">CODE</text>
    <text className="syn-label" x="388" y="275">IDENTITY</text>
    <text className="syn-label" x="125" y="420">TRAINING</text>
    <text className="syn-label" x="295" y="412">SCALE</text>
  </svg>
)

const cardIcons = [
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" /></svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" /></svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5Z" /><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /></svg>,
]

export default function Home() {
  const { t } = useLang()
  const { data } = useData()
  const { home, services } = data

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="eyebrow">{t(home.hero.eyebrow)}</span>
            <h1 dangerouslySetInnerHTML={{ __html: t(home.hero.title) }} />
            <p className="lead">{t(home.hero.lead)}</p>
            <div className="hero-actions">
              <Link to="/services" className="btn btn-primary">{t({ en: 'See our services', ar: 'اعرف خدماتنا' })}</Link>
              <Link to="/contact" className="btn btn-ghost">{t({ en: 'Talk to us', ar: 'تواصل معنا' })}</Link>
            </div>
            <div className="hero-stats">
              {home.hero.stats.map((s, i) => (
                <div className="stat" key={i}>
                  <div className="num">{typeof s.num === 'object' ? t(s.num) : s.num}</div>
                  <div className="label">{t(s.label)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="synapse-wrap"><SynapseIcon /></div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t(home.capabilities.eyebrow)}</span>
            <h2>{t(home.capabilities.title)}</h2>
            <p>{t(home.capabilities.subtitle)}</p>
          </div>
          <div className="grid-4">
            {services.map((svc, i) => (
              <div className="card" key={svc.id}>
                <span className="card-tag">{t(svc.tag)}</span>
                <div className="card-icon">{cardIcons[i]}</div>
                <h3>{typeof svc.name === 'object' ? t(svc.name) : svc.name}</h3>
                <p>{t(svc.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t(home.process.eyebrow)}</span>
            <h2>{t(home.process.title)}</h2>
          </div>
          <div className="process">
            {home.process.steps.map(s => (
              <div className="process-step" key={s.num}>
                <span className="process-num">{s.num}</span>
                <h3>{t(s.title)}</h3>
                <p>{t(s.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>{t(home.cta.title)}</h2>
            <Link to="/contact" className="btn btn-primary">{t(home.cta.btn)}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
