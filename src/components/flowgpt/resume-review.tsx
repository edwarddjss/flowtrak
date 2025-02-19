'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

interface ResumeReviewProps {
  onReviewAction: (feedback: string) => Promise<void>
  loading?: boolean
  initialFeedback?: string
}

export function ResumeReview({ onReviewAction, loading, initialFeedback }: ResumeReviewProps) {
  const [feedback, setFeedback] = useState(initialFeedback || '')
  const { theme } = useTheme()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className={cn(
          "rounded-lg p-2.5",
          "bg-primary/10 ring-1 ring-primary/20"
        )}>
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Resume Review</h2>
          <p className="text-sm text-muted-foreground">
            AI-powered analysis of your resume
          </p>
        </div>
      </div>

      <div className={cn(
        "rounded-lg border",
        "bg-card/50 backdrop-blur-sm",
        theme === 'dark' ? 'border-border/40' : 'border-border/10'
      )}>
        <ScrollArea className="h-[400px] p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                className="flex items-center gap-2 text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Analyzing your resume...
              </motion.div>
            </div>
          ) : feedback ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-500">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Analysis Complete</span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {feedback.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <AlertCircle className="h-5 w-5 mr-2" />
              No resume analysis available
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => onReviewAction(feedback)}
          disabled={loading || !feedback}
          className="gap-2"
        >
          Save Analysis
        </Button>
      </div>
    </div>
  )
}
