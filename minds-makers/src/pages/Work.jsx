import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useData } from '../context/DataContext'

export default function Work() {
  const { t } = useLang()
  const { data } = useData()
  const { work } = data

  return (
    <>
      <section className="hero" style={{ padding: '80px 0 50px' }}>
        <div className="container">
          <span className="eyebrow">{t(work.hero.eyebrow)}</span>
          <h1 style={{ marginTop: 18, fontSize: 'clamp(30px,4vw,46px)', color: '#fff', maxWidth: '20ch' }}>
            {t(work.hero.title)}
          </h1>
          <p className="lead" style={{ marginTop: 20 }}>{t(work.hero.lead)}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="work-grid">
            {work.projects.map(proj => (
              <div className="work-card" key={proj.id}>
                <div className="work-thumb">
                  <span className="placeholder-tag">{proj.label}</span>
                </div>
                <div className="work-body">
                  <h3>{t(proj.title)}</h3>
                  <p>{t(proj.desc)}</p>
                  <div className="work-tags">
                    {proj.tags.map((tag, i) => (
                      <span key={i}>{typeof tag === 'object' ? t(tag) : tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="cta-band">
            <h2>{t({ en: 'Want your project featured here next?', ar: 'عايز مشروعك يكون هنا بعدين؟' })}</h2>
            <Link to="/contact" className="btn btn-primary">{t({ en: 'Start a project', ar: 'ابدأ مشروع' })}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
