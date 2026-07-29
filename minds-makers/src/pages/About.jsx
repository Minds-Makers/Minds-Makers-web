import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useData } from '../context/DataContext'

const PersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
)

export default function About() {
  const { t } = useLang()
  const { data } = useData()
  const { about } = data
export default function About() {
  const { t } = useLang()
  const { data } = useData()
  const { about } = data

  console.log("data:", data)
  console.log("about:", about)
  console.log("vision:", about?.vision)
  console.log("mission:", about?.mission)
  console.log("principles:", about?.principles)

  return (
    <>
      ...
  return (
    <>
      <section className="hero" style={{ padding: '80px 0 60px' }}>
        <div className="container about-hero">
          <div>
            <span className="eyebrow">{t(about.hero.eyebrow)}</span>
            <p className="quote" style={{ marginTop: 18 }}>{t(about.hero.quote)}</p>
          </div>
          <div className="synapse-wrap" style={{ maxWidth: 340, marginInlineStart: 'auto' }}>
            <svg viewBox="0 0 480 480">
              <defs>
                <linearGradient id="syn-grad2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#4fd8ff" /><stop offset="1" stopColor="#2e6bff" />
                </linearGradient>
              </defs>
              <circle cx="240" cy="240" r="150" fill="none" stroke="rgba(140,165,255,0.18)" strokeWidth="1" />
              <circle cx="240" cy="240" r="110" fill="none" stroke="rgba(140,165,255,0.14)" strokeWidth="1" />
              <path className="syn-line" style={{ stroke: 'url(#syn-grad2)' }} d="M240,90 a150,150 0 0 1 130,75" />
              <path className="syn-line" style={{ stroke: 'url(#syn-grad2)' }} d="M110,165 a150,150 0 0 0 0,150" />
              <path className="syn-line" style={{ stroke: 'url(#syn-grad2)' }} d="M240,390 a150,150 0 0 0 130,-75" />
              <circle className="syn-node lit" cx="240" cy="240" r="10" />
              <circle className="syn-node" cx="240" cy="90" r="6" />
              <circle className="syn-node" cx="370" cy="165" r="6" />
              <circle className="syn-node" cx="370" cy="315" r="6" />
              <circle className="syn-node" cx="240" cy="390" r="6" />
              <circle className="syn-node" cx="110" cy="315" r="6" />
              <circle className="syn-node" cx="110" cy="165" r="6" />
            </svg>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="grid-2">
            <div className="card">
              <span className="card-tag">{t({ en: 'Vision', ar: 'الرؤية' })}</span>
              <h3>{t(about.vision.title)}</h3>
              <p>{t(about.vision.desc)}</p>
            </div>
            <div className="card">
              <span className="card-tag">{t({ en: 'Mission', ar: 'المهمة' })}</span>
              <h3>{t(about.mission.title)}</h3>
              <p>{t(about.mission.desc)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t({ en: 'How we think', ar: 'إزاي بنفكر' })}</span>
            <h2>{t({ en: "Three things we won't compromise on.", ar: '٣ حاجات مش هنتنازل عنها.' })}</h2>
          </div>
          <div className="principles">
            {about.principles.map((p, i) => (
              <div className="principle" key={i}>
                <span className="mark">{p.mark}</span>
                <h3>{t(p.title)}</h3>
                <p>{t(p.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t({ en: 'Our team', ar: 'فريقنا' })}</span>
            <h2>{t({ en: 'The people behind the platforms.', ar: 'الناس اللي وراء المنصات.' })}</h2>
          </div>
          <div className="grid-3">
            {about.team.map((member, i) => (
              <div className="card" key={i}>
                <div className="card-icon"><PersonIcon /></div>
                <h3>{member.name}</h3>
                <p>{t(member.role)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="cta-band">
            <h2>{t({ en: 'Want to build something with us?', ar: 'عايز تبني حاجة معانا؟' })}</h2>
            <Link to="/contact" className="btn btn-primary">{t({ en: 'Get in touch', ar: 'تواصل معنا' })}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
