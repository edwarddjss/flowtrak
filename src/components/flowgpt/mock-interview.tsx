'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Mic, Video, VideoOff, MicOff, Code, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InterviewSummaries } from './interview-summaries'
import { TechnicalInterview } from '@/components/technical-interview'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  code?: string
}

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

export function MockInterview() {
  const [isStarted, setIsStarted] = useState(false)
  const [activeTab, setActiveTab] = useState<'technical' | 'behavioral' | null>(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [showSummary, setShowSummary] = useState(false)
  const [currentSummary, setCurrentSummary] = useState<InterviewSummaryType | null>(null)

  // Handle ending the interview
  const handleEndInterview = useCallback(() => {
    if (window.confirm('Are you sure you want to end this interview? Your progress will be saved.')) {
      setShowSummary(true)
      const summary: InterviewSummaryType = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration: 0,
        type: activeTab || 'behavioral',
        company: 'Mock Interview',
        role: 'Software Engineer',
        questions: messages.filter(m => m.role === 'assistant').map(m => m.content),
        feedback: []
      }
      setCurrentSummary(summary)
    }
  }, [activeTab, messages])

  // Reset everything
  const handleClose = useCallback(() => {
    setShowSummary(false)
    setIsStarted(false)
    setActiveTab(null)
    setMessages([])
    setCurrentSummary(null)
  }, [])

  // If interview type not selected, show selection screen
  if (!activeTab) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
        <h2 className="text-2xl font-bold">Choose Interview Type</h2>
        <div className="flex gap-4">
          <Button
            size="lg"
            onClick={() => setActiveTab('technical')}
            className="flex items-center gap-2 min-w-[200px]"
          >
            <Code className="w-5 h-5" />
            Technical Interview
          </Button>
          <Button
            size="lg"
            onClick={() => setActiveTab('behavioral')}
            className="flex items-center gap-2 min-w-[200px]"
          >
            <MessageSquare className="w-5 h-5" />
            Behavioral Interview
          </Button>
        </div>
      </div>
    )
  }

  // Show summary if interview is ended
  if (showSummary && currentSummary) {
    return (
      <InterviewSummaries 
        summary={currentSummary}
        onClose={handleClose}
      />
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {activeTab === 'technical' ? 'Technical Interview' : 'Behavioral Interview'}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === 'technical' 
                ? 'Practice coding problems and system design'
                : 'Practice common behavioral questions'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              >
                {isVideoEnabled ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <VideoOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              >
                {isAudioEnabled ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>
            </div>
            {isStarted ? (
              <Button 
                variant="destructive"
                onClick={handleEndInterview}
              >
                End Interview
              </Button>
            ) : (
              <Button onClick={() => setIsStarted(true)}>
                Start Interview
              </Button>
            )}
          </div>
        </div>
      </Card>

      {activeTab === 'technical' ? (
        <TechnicalInterview 
          isStarted={isStarted}
          onEnd={handleEndInterview}
        />
      ) : (
        <Card className="p-6">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={cn(
                  "flex gap-3 p-4 rounded-lg",
                  message.role === 'assistant' ? "bg-muted" : "bg-primary/5"
                )}
              >
                <Avatar>
                  <AvatarFallback>
                    {message.role === 'assistant' ? 'AI' : 'You'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                  {message.code && (
                    <pre className="mt-2 p-4 bg-muted rounded-lg overflow-x-auto">
                      <code>{message.code}</code>
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
