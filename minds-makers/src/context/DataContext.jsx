import { createContext, useContext, useState, useEffect } from 'react'
import initialData from '../data/data.json'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const DataCtx = createContext()

const SECTIONS = ['site', 'home', 'services', 'about', 'work', 'contact']


export function DataProvider({ children }) {

  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)


  useEffect(() => {

    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }


    let cancelled = false


    async function fetchAll() {

      try {

        const { data: rows, error } = await supabase
          .from('site_content')
          .select('id, content')


        if (error) throw error

        if (cancelled) return


        const merged = structuredClone(initialData)


        for (const row of rows || []) {

          if (!SECTIONS.includes(row.id)) continue


          // لو الـ content من الداتابيز عبارة عن array (زي services)
          // نستبدله بالكامل، لأن عمل spread لـ array جوه {} بيحوّله
          // لـ object عادي (0,1,2...) بدل array، وده بيكسر أي .map()
          if (Array.isArray(row.content)) {
            merged[row.id] = row.content
            continue
          }

          // استبدال كامل للقسم فقط
          // لو الداتا ناقصة نحتفظ بالنسخة المحلية
          merged[row.id] = {
            ...merged[row.id],
            ...(row.content || {})
          }

        }


        setData(merged)


      } catch (e) {

        console.warn(
          'Supabase fetch failed:',
          e.message
        )

        setData(initialData)

      } finally {

        if (!cancelled)
          setLoading(false)

      }

    }


    fetchAll()



    const channel = supabase
      .channel('site_content_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content'
        },
        payload => {

          const row = payload.new

          if (!row || !SECTIONS.includes(row.id))
            return


          setData(prev => ({
            ...prev,

            [row.id]: Array.isArray(row.content)
              ? row.content
              : {
                  ...initialData[row.id],
                  ...(prev[row.id] || {}),
                  ...(row.content || {})
                }

          }))

        }
      )
      .subscribe()



    return () => {

      cancelled = true

      supabase.removeChannel(channel)

    }


  }, [])



  const update = (newData) => {
    setData(newData)
  }



  const saveSection = async (sectionId, sectionData) => {


    // لو القسم أصلاً array (زي services)، منعملش object spread عليه
    // لأنه هيتحول لـ object بمفاتيح أرقام ويبوظ .map() في الموقع
    const newSection = Array.isArray(sectionData)
      ? sectionData
      : Array.isArray(initialData[sectionId])
      ? sectionData
      : {
          ...initialData[sectionId],
          ...data[sectionId],
          ...sectionData
        }


    const newData = {
      ...data,
      [sectionId]: newSection
    }


    setData(newData)



    if (!isSupabaseConfigured) {
      return {
        ok:false,
        error:'Not configured'
      }
    }



    try {

      const { error } = await supabase
        .from('site_content')
        .upsert({

          id: sectionId,

          content: newSection,

          updated_at: new Date().toISOString()

        })


      if(error) throw error


      return {ok:true}


    } catch(e) {

      return {
        ok:false,
        error:e.message
      }

    }

  }



  return (

    <DataCtx.Provider
      value={{
        data,
        update,
        saveSection,
        loading,
        isSupabaseConfigured
      }}
    >

      {children}

    </DataCtx.Provider>

  )

}


export const useData = () => useContext(DataCtx)
