import { AnalysisType, SearchResultDocument } from '@/types/flowgpt'

export function generateSystemPrompt(type: AnalysisType): string {
  switch (type) {
    case 'resume':
      return `You are an expert career advisor specializing in resume analysis. Your task is to analyze resumes for any job role and provide actionable feedback.
Focus on:
1. Overall resume structure and formatting
2. Role-specific qualifications and experience
3. Skills and achievements relevant to the target position
4. ATS optimization suggestions
5. Areas for improvement`

    case 'company':
      return `You are an expert career advisor specializing in company analysis. Your task is to analyze companies and provide insights for job seekers.
Focus on:
1. Company overview and culture
2. Role-specific requirements and expectations
3. Benefits and growth opportunities
4. Industry position and recent developments
5. Interview preparation tips`

    case 'mock_interview':
      return `You are an expert interviewer specializing in conducting mock interviews. Your task is to create role-specific interview questions and provide evaluation criteria.
Focus on:
1. Role-specific technical questions
2. Behavioral scenarios relevant to the position
3. Company-specific cultural fit questions
4. Common interview challenges
5. Best practices for answering questions`

    default:
      throw new Error('Invalid analysis type')
  }
}

export function generateUserPrompt(
  type: AnalysisType,
  content: string,
  position: string,
  company?: string
): string {
  switch (type) {
    case 'resume':
      return `Analyze this resume for a ${position} position${company ? ` at ${company}` : ''}.
Content:
${content}

Provide a detailed analysis focusing on:
1. Overall resume effectiveness
2. Alignment with the ${position} role
3. Key strengths and achievements
4. Areas for improvement
5. ATS optimization suggestions

Format your response as a JSON object with these keys:
{
  "overall_score": number (1-100),
  "key_strengths": string[],
  "improvement_areas": string[],
  "role_alignment": {
    "score": number (1-100),
    "matching_skills": string[],
    "missing_skills": string[]
  },
  "ats_optimization": {
    "score": number (1-100),
    "suggestions": string[]
  },
  "detailed_feedback": string
}`

    case 'company':
      return `Analyze ${company} for someone interested in a ${position} position.

Provide a detailed analysis focusing on:
1. Company culture and values
2. Role-specific insights
3. Growth opportunities
4. Benefits and perks
5. Interview preparation tips

Format your response as a JSON object with these keys:
{
  "company_overview": {
    "culture": string,
    "values": string[],
    "industry_position": string
  },
  "role_insights": {
    "responsibilities": string[],
    "required_skills": string[],
    "growth_opportunities": string[]
  },
  "benefits": {
    "highlights": string[],
    "unique_perks": string[]
  },
  "interview_prep": {
    "key_topics": string[],
    "preparation_tips": string[]
  },
  "success_tips": string[]
}`

    case 'mock_interview':
      return `Create a mock interview for a ${position} position${company ? ` at ${company}` : ''}.

Generate a comprehensive set of interview questions and evaluation criteria focusing on:
1. Role-specific technical questions
2. Behavioral scenarios
3. Company culture fit
4. Problem-solving abilities
5. Communication skills

Format your response as a JSON object with these keys:
{
  "technical_questions": {
    "basic": string[],
    "intermediate": string[],
    "advanced": string[]
  },
  "behavioral_questions": {
    "leadership": string[],
    "teamwork": string[],
    "problem_solving": string[]
  },
  "company_fit_questions": string[],
  "evaluation_criteria": {
    "technical_skills": string[],
    "soft_skills": string[],
    "red_flags": string[]
  },
  "interview_tips": string[]
}`

    default:
      throw new Error('Invalid analysis type')
  }
}

export function validateAnalysisResult(type: AnalysisType, result: any): boolean {
  if (!result || typeof result !== 'object') {
    console.error('Result is not an object:', result)
    return false
  }

  try {
    switch (type) {
      case 'resume':
        return (
          typeof result.overall_score === 'number' &&
          Array.isArray(result.key_strengths) &&
          Array.isArray(result.improvement_areas) &&
          typeof result.role_alignment === 'object' &&
          typeof result.role_alignment.score === 'number' &&
          Array.isArray(result.role_alignment.matching_skills) &&
          Array.isArray(result.role_alignment.missing_skills) &&
          typeof result.ats_optimization === 'object' &&
          typeof result.ats_optimization.score === 'number' &&
          Array.isArray(result.ats_optimization.suggestions) &&
          typeof result.detailed_feedback === 'string'
        )

      case 'company':
        const companyChecks = {
          hasCompanyOverview: typeof result.company_overview === 'object',
          hasCulture: typeof result.company_overview?.culture === 'string',
          hasValues: Array.isArray(result.company_overview?.values),
          hasIndustryPosition: typeof result.company_overview?.industry_position === 'string',
          hasRoleInsights: typeof result.role_insights === 'object',
          hasResponsibilities: Array.isArray(result.role_insights?.responsibilities),
          hasRequiredSkills: Array.isArray(result.role_insights?.required_skills),
          hasGrowthOpportunities: Array.isArray(result.role_insights?.growth_opportunities),
          hasBenefits: typeof result.benefits === 'object',
          hasHighlights: Array.isArray(result.benefits?.highlights),
          hasUniquePerks: Array.isArray(result.benefits?.unique_perks),
          hasInterviewPrep: typeof result.interview_prep === 'object',
          hasKeyTopics: Array.isArray(result.interview_prep?.key_topics),
          hasPreparationTips: Array.isArray(result.interview_prep?.preparation_tips),
          hasSuccessTips: Array.isArray(result.success_tips)
        }
        return Object.values(companyChecks).every(check => check === true)

      case 'mock_interview':
        return (
          typeof result.technical_questions === 'object' &&
          Array.isArray(result.technical_questions.basic) &&
          Array.isArray(result.technical_questions.intermediate) &&
          Array.isArray(result.technical_questions.advanced) &&
          typeof result.behavioral_questions === 'object' &&
          Array.isArray(result.behavioral_questions.leadership) &&
          Array.isArray(result.behavioral_questions.teamwork) &&
          Array.isArray(result.behavioral_questions.problem_solving) &&
          Array.isArray(result.company_fit_questions) &&
          typeof result.evaluation_criteria === 'object' &&
          Array.isArray(result.evaluation_criteria.technical_skills) &&
          Array.isArray(result.evaluation_criteria.soft_skills) &&
          Array.isArray(result.evaluation_criteria.red_flags) &&
          Array.isArray(result.interview_tips)
        )

      default:
        return false
    }
  } catch {
    return false
  }
}

export function sanitizeContent(content: string): string {
  // Remove any potentially harmful characters or patterns
  return content
    .replace(/[^\w\s.,!?@#$%^&*()[\]{}<>:;'"\/\\-]/g, '') // Allow basic punctuation and special characters
    .trim()
}

export async function search_web(params: { query: string; domain: string }): Promise<{ documents: SearchResultDocument[] }> {
  const response = await fetch(process.env.CODEIUM_API_URL + '/web_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CODEIUM_API_KEY}`
    },
    body: JSON.stringify(params)
  })

  if (!response.ok) {
    throw new Error('Web search failed')
  }

  return response.json()
}

export function formatAnalysisResult(type: AnalysisType, result: any): any {
  if (type === 'company') {
    return {
      overview: {
        title: "Company Overview",
        content: result.company_overview.culture,
        values: result.company_overview.values,
        position: result.company_overview.industry_position
      },
      role: {
        title: "Role Insights",
        responsibilities: result.role_insights.responsibilities,
        requiredSkills: result.role_insights.required_skills,
        growthPath: result.role_insights.growth_opportunities
      },
      perks: {
        title: "Benefits & Perks",
        highlights: result.benefits.highlights,
        uniquePerks: result.benefits.unique_perks
      },
      interview: {
        title: "Interview Preparation",
        keyTopics: result.interview_prep.key_topics,
        tips: result.interview_prep.preparation_tips
      },
      success: {
        title: "Keys to Success",
        tips: result.success_tips
      }
    }
  } else if (type === 'resume') {
    return {
      overview: {
        title: "Resume Analysis",
        score: result.overall_score,
        strengths: result.key_strengths,
        improvements: result.improvement_areas
      },
      alignment: {
        title: "Role Alignment",
        score: result.role_alignment.score,
        matching: result.role_alignment.matching_skills,
        missing: result.role_alignment.missing_skills
      },
      ats: {
        title: "ATS Optimization",
        score: result.ats_optimization.score,
        suggestions: result.ats_optimization.suggestions
      },
      feedback: {
        title: "Detailed Feedback",
        content: result.detailed_feedback
      }
    }
  } else if (type === 'mock_interview') {
    return {
      technical: {
        title: "Technical Questions",
        basic: result.technical_questions.basic,
        intermediate: result.technical_questions.intermediate,
        advanced: result.technical_questions.advanced
      },
      behavioral: {
        title: "Behavioral Questions",
        leadership: result.behavioral_questions.leadership,
        teamwork: result.behavioral_questions.teamwork,
        problemSolving: result.behavioral_questions.problem_solving
      },
      cultural: {
        title: "Company Culture Fit",
        questions: result.company_fit_questions
      },
      evaluation: {
        title: "Evaluation Criteria",
        technical: result.evaluation_criteria.technical_skills,
        soft: result.evaluation_criteria.soft_skills,
        redFlags: result.evaluation_criteria.red_flags
      },
      tips: {
        title: "Interview Tips",
        content: result.interview_tips
      }
    }
  }
  return result
}
