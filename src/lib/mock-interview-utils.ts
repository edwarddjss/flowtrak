import OpenAI from 'openai'
import { Question, InterviewType, Difficulty } from '@/types/mock-interview'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const generateInterviewQuestions = async (
  position: string,
  experience: string,
  company?: string,
  type: InterviewType = 'technical',
  difficulty: Difficulty = 'medium'
): Promise<Question[]> => {
  const prompt = `Generate a list of interview questions for a ${position} position${
    company ? ` at ${company}` : ''
  }. The candidate has the following experience: ${experience}

  Create a mix of questions focusing on:
  1. Technical skills and problem-solving
  2. System design and architecture
  3. Behavioral scenarios
  4. Role-specific challenges
  5. Coding exercises (with test cases)

  The questions should be at ${difficulty} difficulty level.
  
  Format each question as a JSON object with:
  - type: The type of question (technical, behavioral, coding, system_design)
  - question: The actual question text
  - expectedDuration: Expected time to answer in minutes
  - hints: Array of helpful hints
  - acceptanceCriteria: Array of points that make a good answer
  - followUp: Array of follow-up questions
  - testCases: Array of test cases (for coding questions)
  - sampleSolution: Example solution or key points (for non-coding questions)
  - difficultyLevel: Numerical difficulty (1-5)
  - topics: Array of relevant topics/skills being tested`

  const completion = await openai.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "You are an expert technical interviewer who creates high-quality interview questions." 
      },
      { 
        role: "user", 
        content: prompt 
      }
    ],
    model: "gpt-4o",
    temperature: 0.7
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('Failed to generate interview questions')
  }

  try {
    const questions = JSON.parse(content)
    return questions
  } catch (error) {
    console.error('Failed to parse questions:', error)
    throw new Error('Failed to parse interview questions')
  }
}

export const evaluateAnswer = async (
  question: Question,
  answer: string
): Promise<{
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
  tips: string[]
}> => {
  const prompt = `Evaluate this answer to the following interview question:

Question: ${question.question}

Answer: ${answer}

Acceptance Criteria:
${question.acceptanceCriteria.map(c => `- ${c}`).join('\n')}

Provide a detailed evaluation including:
1. Score out of 10
2. Specific strengths
3. Areas for improvement
4. Actionable tips for future answers

Format your response as a JSON object with:
{
  "score": number,
  "feedback": string,
  "strengths": string[],
  "improvements": string[],
  "tips": string[]
}`

  const completion = await openai.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "You are an expert technical interviewer who provides detailed, constructive feedback." 
      },
      { 
        role: "user", 
        content: prompt 
      }
    ],
    model: "gpt-4o",
    temperature: 0.3
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('Failed to generate evaluation')
  }

  try {
    const evaluation = JSON.parse(content)
    return evaluation
  } catch (error) {
    console.error('Failed to parse evaluation:', error)
    throw new Error('Failed to parse answer evaluation')
  }
}

export const evaluateCodeSolution = async (
  question: Question,
  code: string,
  language: string
): Promise<{
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
}> => {
  const prompt = `Evaluate this code solution for the following interview question:

Question: ${question.question}

Code (${language}):
${code}

Test Cases:
${question.testCases.map(tc => `Input: ${tc.input}\nExpected: ${tc.output}`).join('\n\n')}

Provide a detailed evaluation including:
1. Correctness
2. Time and space complexity
3. Test case results
4. Potential improvements
5. Code quality assessment

Format your response as a JSON object with the specified structure.`

  const completion = await openai.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "You are an expert code reviewer who provides detailed, technical evaluations." 
      },
      { 
        role: "user", 
        content: prompt 
      }
    ],
    model: "gpt-4o",
    temperature: 0.3
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('Failed to generate code evaluation')
  }

  try {
    const evaluation = JSON.parse(content)
    return evaluation
  } catch (error) {
    console.error('Failed to parse code evaluation:', error)
    throw new Error('Failed to parse code evaluation')
  }
}

export const generateHint = async (
  question: Question,
  previousHints: string[]
): Promise<string> => {
  const prompt = `Generate a helpful hint for this interview question:

Question: ${question.question}

Previous hints given:
${previousHints.map(h => `- ${h}`).join('\n')}

The hint should:
1. Not give away the answer
2. Guide the candidate's thinking
3. Be different from previous hints
4. Be concise and clear

Provide just the hint text without any additional formatting.`

  const completion = await openai.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "You are an expert interviewer who provides helpful, progressive hints." 
      },
      { 
        role: "user", 
        content: prompt 
      }
    ],
    model: "gpt-4o",
    temperature: 0.5
  })

  return completion.choices[0]?.message?.content || 'Try breaking down the problem into smaller steps.'
}

export const provideFeedback = async (
  interview: {
    questions: Question[]
    answers: {
      questionId: string
      answer: string
      evaluation: any
    }[]
  }
): Promise<{
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
}> => {
  const prompt = `Provide comprehensive feedback for this mock interview:

Questions and Answers:
${interview.answers.map(a => {
  const q = interview.questions.find(q => q.id === a.questionId)
  return `Q: ${q?.question}\nA: ${a.answer}\nEvaluation: ${JSON.stringify(a.evaluation)}`
}).join('\n\n')}

Provide detailed feedback including:
1. Overall performance score
2. Key strengths and areas for improvement
3. Specific technical assessments
4. Actionable next steps
5. Detailed summary

Format your response as a JSON object with the specified structure.`

  const completion = await openai.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "You are an expert technical interviewer who provides comprehensive, actionable feedback." 
      },
      { 
        role: "user", 
        content: prompt 
      }
    ],
    model: "gpt-4o",
    temperature: 0.3
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('Failed to generate interview feedback')
  }

  try {
    const feedback = JSON.parse(content)
    return feedback
  } catch (error) {
    console.error('Failed to parse interview feedback:', error)
    throw new Error('Failed to parse interview feedback')
  }
}
