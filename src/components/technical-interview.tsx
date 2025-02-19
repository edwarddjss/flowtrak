'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { CodeEditor } from '@/components/code-editor'
import { useThemeStorage } from '@/lib/hooks/use-theme-storage'
import { questionBank, CodingQuestion } from '@/services/question-bank'
import { codeExecutionService } from '@/services/code-execution'
import { 
  Play,
  MessageSquare,
  PanelLeftOpen,
  PanelLeftClose,
  Loader2,
  Send
} from 'lucide-react'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const LANGUAGE_TEMPLATES = {
  'javascript': `function solution() {
  // Write your code here
  
}`,
  'typescript': `function solution(): void {
  // Write your code here
  
}`,
  'python': `def solution():
  # Write your code here
  
`
}

interface TechnicalInterviewProps {
  isStarted: boolean
  onEnd: () => void
}

export function TechnicalInterview({ isStarted, onEnd }: TechnicalInterviewProps) {
  const [activeQuestion, setActiveQuestion] = useState<CodingQuestion | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [code, setCode] = useState(LANGUAGE_TEMPLATES['javascript'])
  const [language, setLanguage] = useState('javascript')
  const [isExecuting, setIsExecuting] = useState(false)
  const [showChat, setShowChat] = useState(true)
  const [chatInput, setChatInput] = useState('')
  const { theme } = useThemeStorage()

  useEffect(() => {
    if (isStarted && !activeQuestion) {
      try {
        // Since questionBank is now an array, we can directly access it
        const randomIndex = Math.floor(Math.random() * questionBank.length)
        const question = questionBank[randomIndex]
        
        if (question) {
          setActiveQuestion(question)
          setMessages([
            {
              role: 'assistant',
              content: `Let's solve this problem: ${question.title}\n\n${question.description}`
            }
          ])
          // Use the question's template if available, otherwise use default
          const template = question.templates[language] || LANGUAGE_TEMPLATES[language as keyof typeof LANGUAGE_TEMPLATES]
          setCode(template)
        }
      } catch (error) {
        console.error('Error loading question:', error)
        setMessages([
          {
            role: 'assistant',
            content: 'Sorry, there was an error loading the question. Please try again.'
          }
        ])
      }
    }
  }, [isStarted, activeQuestion, language])

  const handleExecuteCode = async () => {
    if (!code.trim() || !activeQuestion) return

    setIsExecuting(true)
    try {
      const result = await codeExecutionService.execute(code, language, activeQuestion.testCases)
      
      // Add execution result to messages
      setMessages(prev => [...prev, {
        role: 'user',
        content: 'Code execution result:',
        code,
        executionResult: result
      }])

      // If all test cases pass, add to summary
      if (result.passedTests === result.totalTests) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Great job! All test cases passed. Would you like to try another problem?'
        }])
      }
    } catch (error) {
      console.error('Code execution error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'There was an error executing your code. Please try again.'
      }])
    } finally {
      setIsExecuting(false)
    }
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: chatInput
    }])
    setChatInput('')

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I understand your question. Let me help you with that...'
      }])
    }, 1000)
  }

  if (!activeQuestion) return null

  return (
    <div className="grid grid-cols-[1fr,auto] gap-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{activeQuestion.title}</h3>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border bg-muted p-4">
            <p className="whitespace-pre-wrap text-sm">{activeQuestion.description}</p>
          </div>

          <div className="relative">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
              height="400px"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleExecuteCode}
                disabled={isExecuting}
              >
                {isExecuting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run Code
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowChat(!showChat)}
          className="h-auto"
        >
          {showChat ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>

        {showChat && (
          <Card className="w-[300px] flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Interview Chat</h3>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3 rounded-lg p-3",
                      message.role === 'assistant' ? "bg-muted" : "bg-primary/5"
                    )}
                  >
                    <Avatar>
                      <AvatarFallback>
                        {message.role === 'assistant' ? 'AI' : 'You'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm">{message.content}</p>
                      {message.code && (
                        <div className="rounded bg-muted p-2">
                          <pre className="text-xs overflow-x-auto">
                            <code>{message.code}</code>
                          </pre>
                          {message.executionResult && (
                            <div className="mt-2 text-xs">
                              <p>Passed: {message.executionResult.passedTests}/{message.executionResult.totalTests} tests</p>
                              {message.executionResult.error && (
                                <p className="text-destructive">{message.executionResult.error}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
