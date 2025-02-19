import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { AnalysisType } from '@/types/flowgpt'

interface AnalysisState {
  isLoading: boolean
  progress: { status: string; message: string; progress: number } | null
  error: string | null
  results: any | null
  isSuccess: boolean
}

export function useFlowGPTAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    progress: null,
    error: null,
    results: null,
    isSuccess: false
  })
  const { toast } = useToast()

  const startAnalysis = async (type: AnalysisType, data: any) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      progress: { status: 'starting', message: 'Initializing analysis...', progress: 0 },
      isSuccess: false 
    }))

    try {
      const response = await fetch('/api/flowgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to analyze')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Stream not available')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = new TextDecoder().decode(value)
        const updates = text.split('\n').filter(Boolean)

        for (const update of updates) {
          const data = JSON.parse(update)
          
          if (data.status === 'error') {
            throw new Error(data.error)
          }
          
          if (data.status === 'completed') {
            setState(prev => ({ 
              ...prev, 
              results: data.result,
              isSuccess: true,
              isLoading: false,
              progress: {
                status: data.status,
                message: data.message,
                progress: data.progress
              }
            }))
            break
          }
          
          setState(prev => ({ 
            ...prev, 
            progress: {
              status: data.status,
              message: data.message,
              progress: data.progress
            }
          }))
        }
      }

      toast({
        title: 'Analysis complete',
        description: 'View your personalized insights below',
      })
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
        isSuccess: false
      }))
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const reset = () => {
    setState({
      isLoading: false,
      progress: null,
      error: null,
      results: null,
      isSuccess: false
    })
  }

  return {
    ...state,
    startAnalysis,
    reset
  }
}
