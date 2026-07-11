import { createContext, useContext, useState } from 'react'

const AuthCtx = createContext()

const INVITE_CODE = 'MM-ADMIN-2024'

async function hashPass(pass) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pass + 'mm_salt'))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function getAccounts() {
  try { return JSON.parse(localStorage.getItem('mm_accounts') || '[]') } catch { return [] }
}
function saveAccounts(a) { localStorage.setItem('mm_accounts', JSON.stringify(a)) }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('mm_user') || 'null') } catch { return null }
  })

  const login = async (email, pass) => {
    const accounts = getAccounts()
    const hash = await hashPass(pass)
    const found = accounts.find(a => a.email === email.toLowerCase() && a.hash === hash)
    if (!found) throw new Error('Incorrect email or password.')
    sessionStorage.setItem('mm_user', JSON.stringify(found))
    setUser(found)
  }

  const signup = async (name, email, code, pass, pass2) => {
    if (code !== INVITE_CODE) throw new Error('Invalid invite code.')
    if (pass.length < 8) throw new Error('Password must be at least 8 characters.')
    if (pass !== pass2) throw new Error('Passwords do not match.')
    const accounts = getAccounts()
    const emailLow = email.toLowerCase()
    if (accounts.find(a => a.email === emailLow)) throw new Error('Account with this email already exists.')
    const hash = await hashPass(pass)
    const newUser = { name, email: emailLow, hash, createdAt: new Date().toISOString() }
    accounts.push(newUser)
    saveAccounts(accounts)
    sessionStorage.setItem('mm_user', JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    sessionStorage.removeItem('mm_user')
    setUser(null)
  }

  const getAdmins = () => getAccounts()

  const removeAdmin = (email) => {
    if (email === user?.email) throw new Error("Can't remove your own account.")
    const accounts = getAccounts().filter(a => a.email !== email)
    saveAccounts(accounts)
  }

  return (
    <AuthCtx.Provider value={{ user, login, signup, logout, getAdmins, removeAdmin }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
