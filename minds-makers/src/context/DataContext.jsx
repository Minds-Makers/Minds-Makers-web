import { createContext, useContext, useState, useEffect } from 'react'
import initialData from '../data/data.json'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const DataCtx = createContext()

const SECTIONS = [
  'site',
  'home',
  'services',
  'about',
  'work',
  'contact'
]


// Deep merge عشان نحافظ على البيانات الداخلية
function deepMerge(target, source) {
  const output = { ...target }

  Object.keys(source || {}).forEach((key) => {
    const sourceValue = source[key]

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue)
    ) {
      output[key] = deepMerge(
        target?.[key] || {},
        sourceValue
      )
    } else {
      output[key] = sourceValue
    }
  })

  return output
}


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

        const {
          data: rows,
          error
        } = await supabase
          .from('site_content')
          .select('id, content')


        if (error) throw error

        if (cancelled) return


        let merged = structuredClone(initialData)


        for (const row of rows || []) {

          if (SECTIONS.includes(row.id)) {

            merged[row.id] = deepMerge(
              merged[row.id],
              row.content
            )

          }

        }


        setData(merged)


      } catch (e) {

        console.warn(
          'Supabase fetch failed, using local data:',
          e.message
        )


      } finally {

        if (!cancelled) {
          setLoading(false)
        }

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
        (payload) => {


          const row = payload.new


          if (
            !row ||
            !SECTIONS.includes(row.id)
          ) {
            return
          }


          setData(prev => ({

            ...prev,

            [row.id]: deepMerge(
              prev[row.id],
              row.content
            )

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



  const saveSection = async (
    sectionId,
    sectionData
  ) => {


    const newData = {

      ...data,

      [sectionId]: deepMerge(
        data[sectionId],
        sectionData
      )

    }


    setData(newData)



    if (!isSupabaseConfigured) {

      return {
        ok: false,
        error: 'Not configured'
      }

    }



    try {


      const {
        error
      } = await supabase
        .from('site_content')
        .upsert({

          id: sectionId,

          content: newData[sectionId],

          updated_at:
            new Date().toISOString()

        })



      if (error) throw error



      return {
        ok: true
      }



    } catch (e) {


      return {

        ok: false,

        error: e.message

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



export const useData = () =>
  useContext(DataCtx)
