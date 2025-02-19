export type AnalysisType = 'resume' | 'company' | 'mock_interview'

export interface FlowGPTRequest {
  type: AnalysisType
  data: {
    content?: string
    position?: string
    company?: string
  }
}

export interface SearchResultDocument {
  title: string
  snippet: string
  url: string
}

export interface ResumeAnalysisResult {
  overall_score: number
  key_strengths: string[]
  improvement_areas: string[]
  role_alignment: {
    score: number
    matching_skills: string[]
    missing_skills: string[]
  }
  ats_optimization: {
    score: number
    suggestions: string[]
  }
  detailed_feedback: string
}

export interface CompanyAnalysisResult {
  company_overview: {
    culture: string
    values: string[]
    industry_position: string
  }
  role_insights: {
    responsibilities: string[]
    required_skills: string[]
    growth_opportunities: string[]
  }
  benefits: {
    highlights: string[]
    unique_perks: string[]
  }
  interview_prep: {
    key_topics: string[]
    preparation_tips: string[]
  }
  success_tips: string[]
}

export interface MockInterviewResult {
  technical_questions: {
    basic: string[]
    intermediate: string[]
    advanced: string[]
  }
  behavioral_questions: {
    leadership: string[]
    teamwork: string[]
    problem_solving: string[]
  }
  company_fit_questions: string[]
  evaluation_criteria: {
    technical_skills: string[]
    soft_skills: string[]
    red_flags: string[]
  }
  interview_tips: string[]
}

export type AnalysisResult = 
  | { type: 'resume'; data: ResumeAnalysisResult }
  | { type: 'company'; data: CompanyAnalysisResult }
  | { type: 'mock_interview'; data: MockInterviewResult }
