import OpenAI from 'openai'
import { InterviewQuestion, InterviewAnswer, InterviewFeedback, InterviewType } from '@/types/interview'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateQuestions(type: InterviewType, role: string, experience: string): Promise<InterviewQuestion[]> {
  const prompt = `Generate 5 ${type} interview questions for a ${role} position with ${experience} experience. 
  Format as JSON array with fields: id, type, question, category, difficulty, expectedPoints.`

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert technical interviewer. Generate challenging but fair interview questions."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  })

  const content = response.choices[0].message.content || '[]'
  const result = JSON.parse(content)
  return result.questions
}

export async function analyzeCandidateResponse(
  question: InterviewQuestion,
  answer: string
): Promise<InterviewFeedback> {
  const prompt = `
    Question: "${question.question}"
    Expected points: ${JSON.stringify(question.expectedPoints)}
    Candidate's answer: "${answer}"
    
    Analyze the response and provide feedback in JSON format with fields:
    - score (0-100)
    - strengths (array of strings)
    - improvements (array of strings)
    - technicalAccuracy (0-100, if applicable)
    - communicationClarity (0-100)
    - structuredResponse (0-100)
    - specificExamples (0-100)
    - completeness (0-100)
    - recommendations (array of strings)
  `

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert interviewer providing detailed feedback on candidate responses."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content) as InterviewFeedback
}

export async function generateFollowUpQuestion(
  question: InterviewQuestion,
  answer: string
): Promise<string> {
  const prompt = `
    Original question: "${question.question}"
    Candidate's answer: "${answer}"
    
    Generate a relevant follow-up question based on the candidate's response. 
    The follow-up should dig deeper into their answer or explore areas they might have missed.
  `

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert interviewer. Generate probing follow-up questions based on candidate responses."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  })

  const content = response.choices[0].message.content || ''
  return content
}

export async function generateOverallFeedback(
  session: {
    type: InterviewType;
    questions: InterviewQuestion[];
    answers: InterviewAnswer[];
  }
): Promise<InterviewFeedback> {
  const prompt = `
    Interview type: ${session.type}
    Questions and answers: ${JSON.stringify(session.questions.map((q, i) => ({
      question: q.question,
      answer: session.answers[i]?.answer
    })))}
    
    Provide comprehensive feedback on the entire interview in JSON format with fields:
    - score (0-100)
    - strengths (array of strings)
    - improvements (array of strings)
    - technicalAccuracy (0-100, if applicable)
    - communicationClarity (0-100)
    - structuredResponse (0-100)
    - specificExamples (0-100)
    - completeness (0-100)
    - recommendations (array of strings)
  `

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert interviewer providing detailed feedback on entire interview sessions."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content) as InterviewFeedback
}
