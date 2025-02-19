import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Loader2, Brain } from 'lucide-react'

interface AnalysisProgressProps {
  progress: {
    status: string
    message: string
    progress: number
    icon?: string
  }
  type: 'resume' | 'company' | 'mock_interview'
}

const messages = {
  resume: [
    'Analyzing resume content...',
    'Identifying key skills...',
    'Evaluating experience...',
    'Checking ATS compatibility...',
    'Generating recommendations...'
  ],
  company: [
    'Researching company...',
    'Analyzing tech stack...',
    'Evaluating culture...',
    'Gathering interview insights...',
    'Preparing recommendations...'
  ],
  mock_interview: [
    'Analyzing position requirements...',
    'Generating technical questions...',
    'Creating follow-up scenarios...',
    'Preparing evaluation criteria...',
    'Finalizing interview prep...'
  ]
}

export function AnalysisProgress({ progress, type }: AnalysisProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
          <div className="relative h-12 w-12 rounded-xl bg-black/40 backdrop-blur-sm border border-white/[0.08] flex items-center justify-center">
            <Brain className="h-6 w-6 text-primary animate-pulse" />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Analysis in Progress</div>
            <div className="text-sm text-muted-foreground">{Math.round(progress.progress)}%</div>
          </div>
          <Progress value={progress.progress} className="h-2" />
        </div>
      </div>

      <motion.div
        key={progress.status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        {progress.message}
      </motion.div>
    </motion.div>
  )
}
