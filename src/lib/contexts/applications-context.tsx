'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Application } from '@/types'
import { getApplications } from '@/app/client-actions'

interface ApplicationsContextType {
  applications: Application[]
  isLoading: boolean
  error: Error | null
  refreshApplications: () => Promise<void>
}

const ApplicationsContext = createContext<ApplicationsContextType>({
  applications: [],
  isLoading: true,
  error: null,
  refreshApplications: async () => {}
})

export function ApplicationsProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refreshApplications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getApplications()
      setApplications(data || [])
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching applications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshApplications()
  }, [])

  return (
    <ApplicationsContext.Provider 
      value={{ 
        applications, 
        isLoading,
        error,
        refreshApplications 
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  )
}

export function useApplications() {
  const context = useContext(ApplicationsContext)
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationsProvider')
  }
  return context
}
