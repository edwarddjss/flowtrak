'use client'

import { Card } from '@/components/ui/card'
import { Brain } from 'lucide-react'

export function AIFeatures() {
  return (
    <Card className="p-6 flex flex-col items-center text-center space-y-4">
      <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
        <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="text-2xl font-bold">AI-Powered Features</h3>
      <ul className="text-gray-500 dark:text-gray-400 space-y-2 text-left">
        <li>• Mock Interview Practice with AI</li>
        <li>• Smart Application Analysis</li>
        <li>• Interview Performance Feedback</li>
        <li>• Resume and Cover Letter Tips</li>
      </ul>
    </Card>
  )
}
