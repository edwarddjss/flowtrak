import { FileText, Briefcase, Building2, MessageSquare } from 'lucide-react'

export const steps = [
  {
    id: 'resume',
    name: 'Upload Resume',
    description: 'Upload your resume or import from LinkedIn',
    icon: FileText,
  },
  {
    id: 'target',
    name: 'Target Job',
    description: 'Define your target role and company',
    icon: Briefcase,
  },
  {
    id: 'research',
    name: 'Company Research',
    description: 'Research your target companies',
    icon: Building2,
  },
  {
    id: 'interview',
    name: 'Mock Interview',
    description: 'Practice with AI-powered interviews',
    icon: MessageSquare,
  },
]
