import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useData } from '../context/DataContext'

export default function Services() {
  const { t } = useLang()
  const { data } = useData()
  const { services } = data
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [location])

  return (
    <>
      <section className="hero" style={{ padding: '80px 0 50px' }}>
        <div className="container">
          <span className="eyebrow">{t({ en: 'Services', ar: 'خدماتنا' })}</span>
          <h1 style={{ marginTop: 18, fontSize: 'clamp(30px,4vw,46px)', color: '#fff', maxWidth: '18ch' }}>
            {t({ en: 'Software, security, and AI — built on one engineering standard.', ar: 'منتجين. وخدمتين. ومعيار هندسي واحد.' })}
          </h1>
          <p className="lead" style={{ marginTop: 20 }}>
            {t({ en: "Whether you need a security layer, an AI-driven system, or a custom software solution, everything we deliver runs on the same AI-native engineering bench.", ar: "سواء اشتركت في منصة جاهزة أو جبتلنا مشكلة مخصصة، كل اللي بنسلمه طالع من نفس الفريق الهندسي المبني على الذكاء الاصطناعي." })}
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container">
          {services.map(svc => (
            <div className="service-block" key={svc.id} id={svc.id}>
              <div>
                <span className="eyebrow">{t(svc.tag)}</span>
                <h3>{typeof svc.name === 'object' ? t(svc.name) : svc.name}</h3>
                <p className="desc">{t(svc.desc)}</p>
              </div>
              <ul className="service-list">
                {svc.features.map((f, i) => (
                  <li key={i}>{t(f)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t({ en: 'Who we serve', ar: 'مين بنخدم' })}</span>
            <h2>{t({ en: 'Built for the teams who own the risk.', ar: 'اتبنى لأجل الفرق اللي بتتحمل المخاطرة.' })}</h2>
          </div>
          <div className="grid-2">
            <div className="card">
              <h3>{t({ en: 'Technical teams', ar: 'الفرق التقنية' })}</h3>
              <p>{t({ en: 'Software developers, QA engineers, DevOps professionals, and cybersecurity teams looking for AI-powered automation to accelerate workflows and strengthen security.', ar: 'مطوري برمجيات، مهندسي ضمان جودة، متخصصي DevOps، وفرق أمن سيبراني بيدوروا على أتمتة بالذكاء الاصطناعي تسرّع شغلهم وتقوّي الأمان.' })}</p>
            </div>
            <div className="card">
              <h3>{t({ en: 'Key industries', ar: 'القطاعات الرئيسية' })}</h3>
              <p>{t({ en: 'FinTech, banking, payment systems, enterprises, and digital platforms that require robust security, compliance, and scalable QA.', ar: 'التكنولوجيا المالية، البنوك، أنظمة المدفوعات، والمؤسسات والمنصات الرقمية اللي محتاجة أمان قوي والتزام بالامتثال وضمان جودة قابل للتوسع.' })}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>{t({ en: "Not sure which service fits?", ar: "مش متأكد إيه اللي يناسبك؟" })}</h2>
            <Link to="/contact" className="btn btn-primary">{t({ en: 'Tell us about your project', ar: 'احكيلنا عن مشروعك' })}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
