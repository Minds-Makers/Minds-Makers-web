import { createContext, useContext, useState, useEffect } from 'react'
import initialData from '../data/data.json'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const DataCtx = createContext()

const SECTIONS = ['site', 'home', 'services', 'about', 'work']

export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_site_data')
      return saved ? JSON.parse(saved) : initialData
    } catch { return initialData }
  })
  const [loading, setLoading] = useState(isSupabaseConfigured)

  // ── Fetch live data from Supabase on load ──
  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return }

    let cancelled = false
    async function fetchAll() {
      try {
        const { data: rows, error } = await supabase
          .from('site_content')
          .select('id, content')
        if (error) throw error
        if (cancelled || !rows) return

        const merged = { ...initialData }
        for (const row of rows) {
          if (SECTIONS.includes(row.id)) merged[row.id] = row.content
        }
        setData(merged)
        localStorage.setItem('mm_site_data', JSON.stringify(merged))
      } catch (e) {
        console.warn('Supabase fetch failed, using cached/local data:', e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()

    // ── Live updates: reflect dashboard edits in real time ──
    const channel = supabase
      .channel('site_content_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, (payload) => {
        const row = payload.new
        if (!row || !SECTIONS.includes(row.id)) return
        setData(prev => {
          const updated = { ...prev, [row.id]: row.content }
          localStorage.setItem('mm_site_data', JSON.stringify(updated))
          return updated
        })
      })
      .subscribe()

    return () => { cancelled = true; supabase.removeChannel(channel) }
  }, [])

  // ── Local update (used by dashboard for instant UI feedback) ──
  const update = (newData) => {
    setData(newData)
    localStorage.setItem('mm_site_data', JSON.stringify(newData))
  }

  // ── Save one section to Supabase (used by dashboard Save buttons) ──
  const saveSection = async (sectionId, sectionData) => {
    const newData = { ...data, [sectionId]: sectionData }
    update(newData)
    if (!isSupabaseConfigured) return { ok: true, offline: true }
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ id: sectionId, content: sectionData, updated_at: new Date().toISOString() })
      if (error) throw error
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  const reset = () => {
    localStorage.removeItem('mm_site_data')
    setData(initialData)
  }

  return (
    <DataCtx.Provider value={{ data, update, saveSection, reset, loading, isSupabaseConfigured }}>
      {children}
    </DataCtx.Provider>
  )
}

export const useData = () => useContext(DataCtx)
