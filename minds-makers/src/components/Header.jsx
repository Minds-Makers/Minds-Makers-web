import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import logo from '../assets/logo-64.png'

export default function Header() {
  const { lang, toggle, t } = useLang()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/', label: { en: 'Home', ar: 'الرئيسية' } },
    { to: '/services', label: { en: 'Services', ar: 'خدماتنا' } },
    { to: '/about', label: { en: 'About', ar: 'من نحن' } },
    { to: '/contact', label: { en: 'Contact', ar: 'تواصل معنا' } },
  ]

  return (
    <header className="site-header">
      <nav className="nav">
        <Link to="/" className="brand">
          <img src={logo} alt="Minds Makers logo" />
          <span className="brand-name">Minds<span> Makers</span></span>
        </Link>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={location.pathname === l.to ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {t(l.label)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="lang-toggle" onClick={toggle} aria-label="Switch language">
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>
          <Link to="/contact" className="btn btn-primary">
            {t({ en: 'Talk to us', ar: 'تواصل معنا' })}
          </Link>
          <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Open menu">
            ☰
          </button>
        </div>
      </nav>
    </header>
  )
}
