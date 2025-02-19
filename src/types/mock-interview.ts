export type InterviewType = 'technical' | 'behavioral' | 'system_design' | 'mixed'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type QuestionType = 'technical' | 'behavioral' | 'coding' | 'system_design'

export interface TestCase {
  input: string
  output: string
  explanation?: string
}

export interface Question {
  id: string
  type: QuestionType
  question: string
  expectedDuration: number
  hints: string[]
  acceptanceCriteria: string[]
  followUp: string[]
  testCases: TestCase[]
  sampleSolution: string
  difficultyLevel: number
  topics: string[]
}

export interface Answer {
  questionId: string
  content: string
  timestamp: number
  duration: number
  evaluation?: AnswerEvaluation
}

export interface AnswerEvaluation {
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
  tips: string[]
  technicalAccuracy?: number
  communicationClarity?: number
  problemSolvingApproach?: number
  codeQuality?: {
    correctness: number
    efficiency: number
    readability: number
    testCoverage: number
  }
}

export interface InterviewSession {
  id: string
  position: string
  company?: string
  type: InterviewType
  difficulty: Difficulty
  startTime: number
  endTime?: number
  questions: Question[]
  answers: Answer[]
  feedback?: InterviewFeedback
}

export interface InterviewFeedback {
  overallScore: number
  summary: string
  strengths: string[]
  improvements: string[]
  nextSteps: string[]
  technicalAssessment: {
    problemSolving: number
    communication: number
    technicalDepth: number
    systemDesign: number
    codeQuality: number
  }
  recommendations: {
    topics: string[]
    resources: string[]
    practiceAreas: string[]
  }
}

export interface CodeEvaluation {
  isCorrect: boolean
  explanation: string
  performance: {
    timeComplexity: string
    spaceComplexity: string
    efficiency: number
  }
  testResults: {
    passed: boolean
    input: string
    expectedOutput: string
    actualOutput: string
  }[]
  improvements: string[]
}
