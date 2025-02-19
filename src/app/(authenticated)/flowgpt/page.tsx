'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { CommandMenu } from '@/components/command-menu'
import { Sidebar } from '@/components/flowgpt/sidebar'
import { ResumeUpload } from '@/components/flowgpt/resume-upload'
import { TargetJob } from '@/components/flowgpt/target-job'
import { CompanyResearch } from '@/components/flowgpt/company-research'
import { MockInterview } from '@/components/flowgpt/mock-interview'
import { 
  handleResumeUpload,
  handleLinkedInImport,
  handleTargetJob,
  handleCompanyResearch,
  handleMockInterviewStart,
  handleMockInterviewAnswer,
} from './actions'

export default function FlowGPTPage() {
  const [currentStep, setCurrentStep] = useState('resume')
  const { theme } = useTheme()

  return (
    <div className={cn(
      "min-h-screen",
      "bg-gradient-to-b from-background via-background to-background/95",
      theme === 'dark' ? 'bg-opacity-90' : 'bg-opacity-100'
    )}>
      {/* Modern Command Palette Search */}
      <CommandMenu />

      <div className="flex h-screen">
        {/* Left Sidebar */}
        <Sidebar 
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl mx-auto p-6">
            <div className={cn(
              "rounded-xl border",
              "bg-card/50 backdrop-blur-sm",
              theme === 'dark' ? 'border-border/40' : 'border-border/10'
            )}>
              <div className="p-6">
                {currentStep === 'resume' && (
                  <ResumeUpload
                    onUploadAction={handleResumeUpload}
                    onLinkedInAction={handleLinkedInImport}
                  />
                )}
                {currentStep === 'target' && (
                  <TargetJob 
                    onSubmitAction={handleTargetJob}
                  />
                )}
                {currentStep === 'research' && (
                  <CompanyResearch 
                    onResearchAction={handleCompanyResearch}
                  />
                )}
                {currentStep === 'interview' && (
                  <MockInterview
                    onStartAction={handleMockInterviewStart}
                    onAnswerAction={handleMockInterviewAnswer}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
