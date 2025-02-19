'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, ThumbsDown, Brain, MessageSquare, Clock, Star } from 'lucide-react'
import { InterviewFeedback as IInterviewFeedback } from '@/types/interview'
import { motion } from 'framer-motion'

interface FeedbackCardProps {
  title: string
  score: number
  icon: React.ElementType
}

function FeedbackCard({ title, score, icon: Icon }: FeedbackCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <Progress value={score} className="h-2" />
      <p className="text-sm text-muted-foreground mt-2">
        Score: {score}/100
      </p>
    </Card>
  )
}

interface InterviewFeedbackProps {
  feedback: IInterviewFeedback
}

export function InterviewFeedback({ feedback }: InterviewFeedbackProps) {
  const {
    score,
    strengths,
    improvements,
    technicalAccuracy,
    communicationClarity,
    structuredResponse,
    specificExamples,
    completeness,
    recommendations
  } = feedback

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold mb-2">Interview Performance</h2>
        <div className="inline-flex items-center gap-2 text-4xl font-bold">
          {score}
          <span className="text-xl text-muted-foreground">/100</span>
        </div>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {technicalAccuracy !== undefined && (
          <FeedbackCard
            title="Technical Accuracy"
            score={technicalAccuracy}
            icon={Brain}
          />
        )}
        <FeedbackCard
          title="Communication"
          score={communicationClarity}
          icon={MessageSquare}
        />
        <FeedbackCard
          title="Structure"
          score={structuredResponse}
          icon={Clock}
        />
        <FeedbackCard
          title="Examples"
          score={specificExamples}
          icon={Star}
        />
        <FeedbackCard
          title="Completeness"
          score={completeness}
          icon={Star}
        />
      </motion.div>

      {/* Strengths and Improvements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Strengths</h3>
          </div>
          <ScrollArea className="h-[200px]">
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-2"
                >
                  <Badge variant="secondary" className="mt-0.5">
                    {index + 1}
                  </Badge>
                  <span>{strength}</span>
                </motion.li>
              ))}
            </ul>
          </ScrollArea>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsDown className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold">Areas for Improvement</h3>
          </div>
          <ScrollArea className="h-[200px]">
            <ul className="space-y-2">
              {improvements.map((improvement, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-2"
                >
                  <Badge variant="secondary" className="mt-0.5">
                    {index + 1}
                  </Badge>
                  <span>{improvement}</span>
                </motion.li>
              ))}
            </ul>
          </ScrollArea>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recommendations</h3>
          <ScrollArea className="h-[200px]">
            <ul className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Star className="h-4 w-4" />
                  </div>
                  <p className="text-sm">{recommendation}</p>
                </motion.li>
              ))}
            </ul>
          </ScrollArea>
        </Card>
      </motion.div>
    </div>
  )
}
