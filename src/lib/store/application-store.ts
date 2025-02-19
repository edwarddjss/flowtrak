import { create } from 'zustand'
import { Application } from '@/types'
import { type NewApplication } from '@/lib/hooks/use-applications'

interface ApplicationState {
  applications: Application[]
  setApplications: (applications: Application[]) => void
  addApplication: (application: NewApplication) => void
  updateApplication: (id: string, application: Partial<Application>) => void
  deleteApplication: (id: string) => void
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  setApplications: (applications) => set({ applications }),
  addApplication: (application) =>
    set((state) => ({
      applications: [...state.applications, {
        ...application,
        id: crypto.randomUUID(),
        user_id: 'demo' // TODO: Replace with actual user_id from auth
      }],
    })),
  updateApplication: (id, updatedApplication) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updatedApplication } : app
      ),
    })),
  deleteApplication: (id) =>
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    })),
}))
