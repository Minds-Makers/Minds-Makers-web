import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useData } from '../context/DataContext'
import logo from '../assets/logo-64.png'

export default function Footer() {
  const { t } = useLang()
  const { data } = useData()
  const s = data.site

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <img src={logo} alt="Minds Makers logo" />
              <span className="brand-name">Minds<span> Makers</span></span>
            </Link>
            <p>{t(s.description)}</p>
          </div>
          <div className="footer-col">
            <h4>{t({ en: 'Navigate', ar: 'تصفح' })}</h4>
            <ul>
              <li><Link to="/services">{t({ en: 'Services', ar: 'خدماتنا' })}</Link></li>
              <li><Link to="/about">{t({ en: 'About', ar: 'من نحن' })}</Link></li>
              <li><Link to="/contact">{t({ en: 'Contact', ar: 'تواصل معنا' })}</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t({ en: 'Products', ar: 'منتجاتنا' })}</h4>
            <ul>
              <li><Link to="/services#nexora">NEXORA</Link></li>
              <li><Link to="/services#ciphera">CIPHERA</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t({ en: 'Contact', ar: 'تواصل' })}</h4>
            <ul>
              <li><a href={`mailto:${s.email}`}>{s.email}</a></li>
              <li><a href={s.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
              <li>{t(s.location)}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Minds Makers. {t({ en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' })}</span>
        </div>
      </div>
    </footer>
  )
}
