import { create } from 'zustand'
import { Application } from '@/types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type NewApplication = Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>

interface ApplicationStore {
  data: Application[] | null
  error: Error | null
  isLoading: boolean
  fetchApplications: () => Promise<void>
  addApplication: (application: NewApplication) => Promise<void>
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>
  deleteApplication: (id: string) => Promise<void>
}

export const useApplications = create<ApplicationStore>((set, get) => ({
  data: null,
  error: null,
  isLoading: false,

  fetchApplications: async () => {
    const supabase = createClientComponentClient()
    
    try {
      set({ isLoading: true })
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set({ error: new Error('No user found') })
        return
      }

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ data, error: null })
    } catch (error) {
      set({ error: error as Error })
    } finally {
      set({ isLoading: false })
    }
  },

  addApplication: async (application: NewApplication) => {
    const supabase = createClientComponentClient()
    const currentData = get().data || []
    
    try {
      set({ isLoading: true })
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const newApplication = {
        ...application,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('applications')
        .insert([newApplication])
        .select()
        .single()

      if (error) throw error
      
      // Optimistically update the local state
      set({ 
        data: [data, ...currentData],
        error: null 
      })
    } catch (error) {
      set({ error: error as Error })
      // Revert optimistic update on error
      set({ data: currentData })
    } finally {
      set({ isLoading: false })
    }
  },

  updateApplication: async (id: string, updates: Partial<Application>) => {
    const supabase = createClientComponentClient()
    const currentData = get().data || []
    const updatedData = currentData.map(app => 
      app.id === id ? { ...app, ...updates, updated_at: new Date().toISOString() } : app
    )
    
    try {
      set({ 
        data: updatedData,
        isLoading: true 
      })

      const { error } = await supabase
        .from('applications')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      set({ 
        error: error as Error,
        data: currentData // Revert on error
      })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteApplication: async (id: string) => {
    const supabase = createClientComponentClient()
    const currentData = get().data || []
    
    try {
      set({ 
        data: currentData.filter(app => app.id !== id),
        isLoading: true 
      })

      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      set({ 
        error: error as Error,
        data: currentData // Revert on error
      })
    } finally {
      set({ isLoading: false })
    }
  }
}))
