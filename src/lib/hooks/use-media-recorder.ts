'use client'

import { useState, useEffect, useCallback } from 'react'

interface MediaRecorderState {
  isRecording: boolean
  isPaused: boolean
  audioBlob: Blob | null
  videoBlob: Blob | null
  error: string | null
}

export function useMediaRecorder(options: {
  audio?: boolean
  video?: boolean
  onDataAvailable?: (blob: Blob) => void
}) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [state, setState] = useState<MediaRecorderState>({
    isRecording: false,
    isPaused: false,
    audioBlob: null,
    videoBlob: null,
    error: null,
  })

  // Initialize media stream
  const initializeStream = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: options.audio,
        video: options.video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } : false
      })
      setStream(mediaStream)

      const recorder = new MediaRecorder(mediaStream, {
        mimeType: options.video ? 'video/webm' : 'audio/webm'
      })

      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: options.video ? 'video/webm' : 'audio/webm'
        })
        if (options.video) {
          setState(prev => ({ ...prev, videoBlob: blob }))
        } else {
          setState(prev => ({ ...prev, audioBlob: blob }))
        }
        if (options.onDataAvailable) {
          options.onDataAvailable(blob)
        }
      }

      setMediaRecorder(recorder)
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to access media devices. Please ensure you have granted permission.'
      }))
    }
  }, [options.audio, options.video, options.onDataAvailable])

  const startRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      mediaRecorder.start(1000) // Collect data every second
      setState(prev => ({ ...prev, isRecording: true, isPaused: false }))
    }
  }, [mediaRecorder])

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
      setState(prev => ({ ...prev, isRecording: false }))
      
      // Stop all tracks
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [mediaRecorder, stream])

  const pauseRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause()
      setState(prev => ({ ...prev, isPaused: true }))
    }
  }, [mediaRecorder])

  const resumeRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume()
      setState(prev => ({ ...prev, isPaused: false }))
    }
  }, [mediaRecorder])

  // Cleanup
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  return {
    ...state,
    stream,
    initializeStream,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording
  }
}
