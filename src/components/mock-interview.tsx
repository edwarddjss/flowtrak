'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CustomAvatar } from '@/components/ui/custom-avatar'
import {
  Brain,
  Mic,
  MicOff,
  Play,
  Pause,
  MessageSquare,
  Code,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface MockInterviewProps {
  position: string
  company?: string
}

interface Message {
  role: 'interviewer' | 'candidate' | 'system'
  content: string
  feedback?: {
    score: number
    strengths: string[]
    improvements: string[]
    tips: string[]
  }
  code?: {
    language: string
    content: string
    isCorrect?: boolean
    explanation?: string
  }
}

export default function MockInterview({ position, company }: MockInterviewProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(45 * 60) // 45 minutes
  const [loading, setLoading] = useState(false)
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral' | null>(null)
  const timerRef = useRef<NodeJS.Timeout>()
  const { toast } = useToast()

  useEffect(() => {
    // Start the timer
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter your response before sending.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/flowgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'candidate', content: currentAnswer }],
          type: interviewType,
          position,
          company
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        { role: 'candidate', content: currentAnswer },
        { role: 'interviewer', content: data.response }
      ]);
      setCurrentAnswer('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!interviewType) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-8">
        <h2 className="text-2xl font-bold">Select Interview Type</h2>
        <div className="flex space-x-4">
          <Button
            size="lg"
            onClick={() => setInterviewType('technical')}
            className="flex items-center space-x-2"
          >
            <Code className="w-5 h-5" />
            <span>Technical Interview</span>
          </Button>
          <Button
            size="lg"
            onClick={() => setInterviewType('behavioral')}
            className="flex items-center space-x-2"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Behavioral Interview</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start space-x-3",
              message.role === 'candidate' && "flex-row-reverse space-x-reverse"
            )}
          >
            {message.role === 'interviewer' ? (
              <Avatar className="w-10 h-10">
                <AvatarImage src="/avatars/owl.svg" />
                <AvatarFallback style={{ backgroundColor: '#D4A373' }}>AI</AvatarFallback>
              </Avatar>
            ) : (
              <CustomAvatar userId={session?.user?.id || ''} className="w-10 h-10" />
            )}
            <div
              className={cn(
                "flex flex-col space-y-2 max-w-[80%]",
                message.role === 'candidate' && "items-end"
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-3",
                  message.role === 'interviewer' ? "bg-muted" : "bg-primary text-primary-foreground"
                )}
              >
                <p className="text-sm">{message.content}</p>
                
                {message.code && (
                  <div className="mt-4 space-y-2">
                    <div className="rounded-md bg-muted p-4">
                      <pre className="text-sm">
                        <code>{message.code.content}</code>
                      </pre>
                    </div>
                    {message.code.explanation && (
                      <p className="text-sm text-muted-foreground">
                        {message.code.explanation}
                      </p>
                    )}
                  </div>
                )}

                {message.feedback && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">Score: {message.feedback.score}/10</span>
                    </div>
                    
                    {message.feedback.strengths?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Strengths</h4>
                        <ul className="space-y-1">
                          {message.feedback.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {message.feedback.improvements?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Areas for Improvement</h4>
                        <ul className="space-y-1">
                          {message.feedback.improvements.map((improvement, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <RefreshCw className="mt-1 h-4 w-4 shrink-0 text-blue-500" />
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {message.feedback.tips?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Tips</h4>
                        <ul className="space-y-1">
                          {message.feedback.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Sparkles className="mt-1 h-4 w-4 shrink-0 text-purple-500" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer Input */}
      <div className="sticky bottom-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRecording(!isRecording)}
            className={cn(
              "transition-colors",
              isRecording && "text-red-500 hover:text-red-600"
            )}
          >
            {isRecording ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Textarea
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="flex-1 resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmitAnswer()
              }
            }}
          />
          <Button 
            onClick={handleSubmitAnswer}
            disabled={loading || !currentAnswer.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
