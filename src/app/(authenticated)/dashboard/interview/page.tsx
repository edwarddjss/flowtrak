'use client'

import { MockInterview } from '@/components/flowgpt/mock-interview'

export default function InterviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Mock Interview</h1>
      <p className="text-muted-foreground mt-2">
        Practice your interview skills with AI
      </p>
      <div className="mt-8">
        <MockInterview />
      </div>
    </div>
  )
}
