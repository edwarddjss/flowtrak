export type InterviewType = 'behavioral' | 'technical'

export interface InterviewQuestion {
  id: string
  type: InterviewType
  question: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  expectedPoints?: string[]
  sampleAnswer?: string
  followUps?: string[]
}

export interface InterviewFeedback {
  score: number
  strengths: string[]
  improvements: string[]
  technicalAccuracy?: number
  communicationClarity?: number
  structuredResponse?: number
  specificExamples?: number
  completeness?: number
  recommendations: string[]
}

export interface InterviewAnswer {
  questionId: string
  answer: string
  feedback?: InterviewFeedback
  duration: number
  timestamp: Date
}

export interface InterviewSession {
  id: string
  type: InterviewType
  startTime: Date
  endTime?: Date
  questions: InterviewQuestion[]
  answers: InterviewAnswer[]
  overallFeedback?: InterviewFeedback
  recordingUrl?: string
}

// Sample question banks
export const behavioralQuestions: InterviewQuestion[] = [
  {
    id: 'b1',
    type: 'behavioral',
    question: 'Tell me about a challenging situation you\'ve faced at work and how you handled it.',
    category: 'problem-solving',
    difficulty: 'medium',
    expectedPoints: [
      'Clear description of the situation',
      'Explanation of challenges',
      'Actions taken',
      'Results achieved',
      'Lessons learned'
    ]
  },
  {
    id: 'b2',
    type: 'behavioral',
    question: 'Describe a project where you had to lead a team. What was your approach and what were the results?',
    category: 'leadership',
    difficulty: 'medium',
    expectedPoints: [
      'Project overview',
      'Team composition',
      'Leadership style',
      'Challenges faced',
      'Project outcome'
    ]
  },
  // Add more behavioral questions...
]

export const technicalQuestions: InterviewQuestion[] = [
  {
    id: 't1',
    type: 'technical',
    question: 'How would you implement a function to find duplicate numbers in an array?',
    category: 'algorithms',
    difficulty: 'medium',
    expectedPoints: [
      'Time complexity analysis',
      'Space complexity analysis',
      'Edge cases consideration',
      'Optimal solution explanation',
      'Code implementation'
    ],
    sampleAnswer: `
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (const num of arr) {
    if (seen.has(num)) {
      duplicates.add(num);
    }
    seen.add(num);
  }
  
  return Array.from(duplicates);
}
    `
  },
  {
    id: 't2',
    type: 'technical',
    question: 'Explain the differences between REST and GraphQL. When would you choose one over the other?',
    category: 'system-design',
    difficulty: 'medium',
    expectedPoints: [
      'Understanding of both technologies',
      'Key differences',
      'Use case analysis',
      'Pros and cons',
      'Real-world examples'
    ]
  },
  // Add more technical questions...
]
