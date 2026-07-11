import { Routes, Route } from 'react-router-dom'
import { LangProvider } from './context/LangContext'
import { DataProvider } from './context/DataContext'
import { AuthProvider, useAuth } from './context/AuthContext'

import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import Work from './pages/Work'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function AdminGate() {
  const { user } = useAuth()
  return user ? <Dashboard /> : <Login />
}

function AppInner() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
      <Route path="/services" element={<SiteLayout><Services /></SiteLayout>} />
      <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />
      <Route path="/work" element={<SiteLayout><Work /></SiteLayout>} />
      <Route path="/contact" element={<SiteLayout><Contact /></SiteLayout>} />
      <Route path="/admin" element={<AdminGate />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <DataProvider>
        <AuthProvider>
          <AppInner />
        </AuthProvider>
      </DataProvider>
    </LangProvider>
  )
}
