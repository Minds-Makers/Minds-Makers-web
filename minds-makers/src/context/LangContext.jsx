import { createContext, useContext, useState, useEffect } from 'react'

const LangCtx = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const p = new URLSearchParams(window.location.search).get('lang')
    return p === 'ar' ? 'ar' : 'en'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang)
    document.documentElement.setAttribute('lang', lang)
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  }, [lang])

  const t = (obj) => {
    if (!obj) return ''
    if (typeof obj === 'string') return obj
    return obj[lang] || obj.en || ''
  }

  const toggle = () => setLang(l => l === 'en' ? 'ar' : 'en')

  return <LangCtx.Provider value={{ lang, toggle, t }}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)
