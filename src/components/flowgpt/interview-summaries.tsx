'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InterviewSummaryType {
  id: string
  date: string
  company: string
  role: string
  type: 'technical' | 'behavioral'
  duration: number
  questions: string[]
  feedback: string[]
}

interface InterviewSummariesProps {
  summary: InterviewSummaryType
  onClose: () => void
}

export function InterviewSummaries({ summary, onClose }: InterviewSummariesProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{summary.company}</h2>
            <p className="text-muted-foreground">{summary.role}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant={summary.type === 'technical' ? 'default' : 'secondary'}>
            {summary.type}
          </Badge>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDate(summary.date)}
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Interview Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{formatDuration(summary.duration)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="font-medium">{summary.questions.length}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Questions</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {summary.questions.map((question, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted">
                    <p className="text-sm">{question}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {summary.feedback.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Feedback</h3>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {summary.feedback.map((feedback, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted">
                      <p className="text-sm">{feedback}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
