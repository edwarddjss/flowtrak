'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Clock,
  MessageSquare,
  Lightbulb,
} from 'lucide-react'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  isAudioMessage?: boolean
}

interface InterviewSummaryProps {
  messages: Message[]
  duration: number
  closeAction: () => Promise<void>
  interviewType: string
}

export function InterviewSummary({
  messages,
  duration,
  closeAction,
  interviewType
}: InterviewSummaryProps) {
  const [summary, setSummary] = useState<{
    strengths: string[]
    improvements: string[]
    overallScore: number
    keyTakeaways: string[]
  } | null>(null)

  useEffect(() => {
    analyzeMockInterview()
  }, [])

  const analyzeMockInterview = async () => {
    try {
      const response = await fetch('/api/analyze-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          interviewType
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze interview')
      }

      const data = await response.json()
      setSummary(data)
    } catch (error) {
      console.error('Error analyzing interview:', error)
    }
  }

  const handleClose = async () => {
    try {
      await closeAction()
    } catch (error) {
      console.error('Error closing interview:', error)
    }
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Interview Summary</h2>
        <Button onClick={handleClose} variant="ghost">
          Close <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="flex items-center text-lg font-semibold mb-4">
            <ThumbsUp className="mr-2 h-5 w-5 text-green-500" />
            Strengths
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            {summary.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="flex items-center text-lg font-semibold mb-4">
            <ThumbsDown className="mr-2 h-5 w-5 text-red-500" />
            Areas for Improvement
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            {summary.improvements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="flex items-center text-lg font-semibold mb-4">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          Key Takeaways
        </h3>
        <ul className="list-disc pl-5 space-y-2">
          {summary.keyTakeaways.map((takeaway, index) => (
            <li key={index}>{takeaway}</li>
          ))}
        </ul>
      </Card>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          Duration: {Math.round(duration / 60)} minutes
        </div>
        <div className="flex items-center">
          <MessageSquare className="mr-1 h-4 w-4" />
          Messages: {messages.length}
        </div>
      </div>
    </div>
  )
}
