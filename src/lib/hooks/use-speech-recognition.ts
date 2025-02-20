'use client'

import { useState, useEffect, useCallback } from 'react'

interface SpeechRecognitionState {
  isListening: boolean
  transcript: string
  interimTranscript: string
  error: string | null
}

interface SpeechRecognition {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: () => void
  onend: () => void
  onresult: (event: any) => void
  onerror: (event: any) => void
  start: () => void
  stop: () => void
}

interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

export function useSpeechRecognition() {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    transcript: '',
    interimTranscript: '',
    error: null
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get the appropriate speech recognition API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onstart = () => {
          setState(prev => ({ ...prev, isListening: true }))
        }

        recognition.onend = () => {
          setState(prev => ({ ...prev, isListening: false }))
        }

        recognition.onresult = (event: any) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          setState(prev => ({
            ...prev,
            transcript: prev.transcript + finalTranscript,
            interimTranscript
          }))
        }

        recognition.onerror = (event: any) => {
          setState(prev => ({ 
            ...prev, 
            error: `Speech recognition error: ${event.error}`
          }))
        }

        setRecognition(recognition)
      } else {
        setState(prev => ({ 
          ...prev, 
          error: 'Speech recognition is not supported in this browser.'
        }))
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition) {
      setState(prev => ({ 
        ...prev, 
        transcript: '', 
        interimTranscript: '', 
        error: null 
      }))
      recognition.start()
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
    }
  }, [recognition])

  const clearTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', interimTranscript: '' }))
  }, [])

  return {
    ...state,
    startListening,
    stopListening,
    clearTranscript
  }
}
