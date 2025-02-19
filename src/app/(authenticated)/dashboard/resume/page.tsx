'use client'

import { ResumeReview } from '@/components/flowgpt/resume-review'

export default function ResumePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Resume Review</h1>
      <p className="text-muted-foreground mt-2">
        Get AI-powered feedback on your resume
      </p>
      <div className="mt-8">
        <ResumeReview />
      </div>
    </div>
  )
}
