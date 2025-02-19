'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Brain,
  Mic,
  MicOff,
  Play,
  Pause,
  SkipForward,
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
import { useChat } from 'ai/react'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

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

export default function MockInterviewPage() {
  const [stage, setStage] = useState<'setup' | 'interview' | 'feedback'>('setup')
  const [position, setPosition] = useState('')
  const [company, setCompany] = useState('')
  const [experience, setExperience] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [timeRemaining, setTimeRemaining] = useState(45 * 60) // 45 minutes
  const timerRef = useRef<NodeJS.Timeout>()
  const { toast } = useToast()

  const startInterview = async () => {
    if (!position || !experience) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to start the interview.",
        variant: "destructive"
      })
      return
    }

    setStage('interview')
    setMessages([
      {
        role: 'system',
        content: 'Interview Started'
      },
      {
        role: 'interviewer',
        content: `Hello! I'm your interviewer for the ${position} position${company ? ` at ${company}` : ''}. Let's get started with some technical questions. Are you ready?`
      }
    ])

    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = async (answer: string) => {
    // Add candidate's answer
    setMessages(prev => [...prev, {
      role: 'candidate',
      content: answer
    }])

    // Simulate interviewer's response and feedback
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'interviewer',
        content: 'Great answer! Let me provide some feedback.',
        feedback: {
          score: 8,
          strengths: [
            'Clear explanation of the problem-solving approach',
            'Good understanding of time complexity',
            'Effective communication of technical concepts'
          ],
          improvements: [
            'Could mention space complexity analysis',
            'Consider discussing alternative approaches'
          ],
          tips: [
            'Keep up the good pace of explanation',
            'Feel free to use the whiteboard for visualization'
          ]
        }
      }])
    }, 1500)
  }

  const handleCodeChallenge = async (code: string) => {
    setMessages(prev => [...prev, {
      role: 'candidate',
      content: 'Here\'s my solution:',
      code: {
        language: 'javascript',
        content: code,
        isCorrect: true,
        explanation: 'Your solution correctly handles all test cases and has optimal time complexity.'
      }
    }])
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-medium">Mock Interview</span>
          </div>
          {stage === 'interview' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">{formatTime(timeRemaining)}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <Mic className="h-4 w-4 text-red-500" /> : <MicOff className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="container flex-1 py-6 md:py-10">
        <div className="mx-auto max-w-5xl space-y-8">
          <AnimatePresence mode="wait">
            {stage === 'setup' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Interview Setup</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Position/Role</label>
                      <Input
                        placeholder="e.g. Software Engineer, Product Manager"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company (Optional)</label>
                      <Input
                        placeholder="e.g. Google, Microsoft, Amazon"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Experience Level & Background</label>
                      <Textarea
                        placeholder="Describe your experience level and relevant background..."
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <Button 
                    className="mt-6"
                    onClick={startInterview}
                  >
                    Start Interview
                  </Button>
                </Card>
              </motion.div>
            )}

            {stage === 'interview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-4",
                        message.role === 'candidate' && "flex-row-reverse"
                      )}
                    >
                      <Avatar>
                        <AvatarFallback>
                          {message.role === 'interviewer' ? 'AI' : 'ME'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "flex-1 space-y-4",
                        message.role === 'candidate' && "items-end"
                      )}>
                        <Card className={cn(
                          "p-4 max-w-[80%]",
                          message.role === 'candidate' && "ml-auto bg-primary text-primary-foreground"
                        )}>
                          <p>{message.content}</p>
                          
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
                            </div>
                          )}
                        </Card>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="container py-4">
                    <div className="mx-auto max-w-5xl">
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
                          className="flex-1 resize-none"
                          rows={1}
                        />
                        <Button>Send</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
