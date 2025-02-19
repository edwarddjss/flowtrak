'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Application } from '@/types'
import { Brain, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface InterviewPrepProps {
  applications: Application[]
}

interface PreparedQuestion {
  question: string
  context: string
  tips: string[]
}

export function InterviewPrep({ applications }: InterviewPrepProps) {
  const [loading, setLoading] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [questions, setQuestions] = useState<PreparedQuestion[]>([])

  const upcomingInterviews = applications.filter(
    app => app.status === 'interviewing' && app.interview_date
  ).sort((a, b) => new Date(a.interview_date!).getTime() - new Date(b.interview_date!).getTime())

  const generatePrep = async (application: Application) => {
    setLoading(true)
    setSelectedApp(application)
    
    try {
      const response = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: application.company,
          position: application.position,
          description: application.notes
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate interview prep')
      }

      const data = await response.json()
      setQuestions(data.questions)
    } catch (error) {
      console.error('Error generating interview prep:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-background to-muted/50 border-none shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Interview Prep</h2>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered interview preparation for your upcoming interviews
            </p>
          </div>
        </div>

        {upcomingInterviews.length > 0 ? (
          <div className="space-y-4">
            {upcomingInterviews.map(app => (
              <div key={app.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <h3 className="font-medium">{app.company}</h3>
                  <p className="text-sm text-muted-foreground">
                    {app.position} • {new Date(app.interview_date!).toLocaleDateString()}
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="default" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => generatePrep(app)}
                    >
                      {loading && selectedApp?.id === app.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Brain className="mr-2 h-4 w-4" />
                      )}
                      Prepare
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Interview Preparation</DialogTitle>
                      <DialogDescription>
                        AI-generated questions and tips for your {app.company} interview
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      {questions.map((q, i) => (
                        <div key={i} className="space-y-2">
                          <h4 className="font-medium text-lg">{q.question}</h4>
                          <p className="text-sm text-muted-foreground">{q.context}</p>
                          <ul className="mt-2 space-y-1">
                            {q.tips.map((tip, j) => (
                              <li key={j} className="text-sm flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Upcoming Interviews</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              When you have interviews scheduled, they'll appear here with AI-powered preparation materials.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
