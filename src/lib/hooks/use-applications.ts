import { create } from 'zustand'
import { Application } from '@/types'
import { createClient } from '@supabase/supabase-js'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type NewApplication = Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>

interface ApplicationStore {
  data: Application[] | null
  error: Error | null
  isLoading: boolean
  fetchApplications: (userId: string) => Promise<void>
  addApplication: (userId: string, application: NewApplication) => Promise<void>
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>
  deleteApplication: (id: string) => Promise<void>
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  data: null,
  error: null,
  isLoading: false,

  fetchApplications: async (userId: string) => {
    try {
      set({ isLoading: true })
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ data, error: null })
    } catch (error) {
      set({ error: error as Error })
    } finally {
      set({ isLoading: false })
    }
  },

  addApplication: async (userId: string, application: NewApplication) => {
    const currentData = get().data || []
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([{ ...application, user_id: userId }])
        .select()
        .single()

      if (error) throw error
      set({ data: [data, ...currentData], error: null })
    } catch (error) {
      set({ error: error as Error })
    }
  },

  updateApplication: async (id: string, updates: Partial<Application>) => {
    const currentData = get().data || []
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      set({
        data: currentData.map(app => app.id === id ? data : app),
        error: null
      })
    } catch (error) {
      set({ error: error as Error })
    }
  },

  deleteApplication: async (id: string) => {
    const currentData = get().data || []
    
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)

      if (error) throw error
      set({
        data: currentData.filter(app => app.id !== id),
        error: null
      })
    } catch (error) {
      set({ error: error as Error })
    }
  }
}))

// Hook to use applications with session
export function useApplications() {
  const { data: session } = useSession()
  const store = useApplicationStore()
  
  useEffect(() => {
    if (session?.user?.id) {
      store.fetchApplications(session.user.id)
    }
  }, [session?.user?.id])

  return store
}
