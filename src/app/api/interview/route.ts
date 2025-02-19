import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const SYSTEM_PROMPT = `You are an experienced technical interviewer conducting a mock interview. 
Your goal is to assess the candidate's skills and provide constructive feedback.
Ask one question at a time and wait for the candidate's response.
After they respond, provide brief feedback and ask the next question.
Keep the conversation natural and professional.`

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface InterviewRequest {
  messages: Message[]
  type: 'behavioral' | 'technical'
  audio?: Blob
}

export async function POST(req: NextRequest) {
  try {
    // Get supabase client
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Check authentication using getUser instead of getSession for better security
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body = await req.json()
    const { messages, type = 'behavioral' } = body

    // Validate request
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages must be an array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Add system prompt if it's not already there
    const fullMessages = messages.find(m => m.role === 'system')
      ? messages
      : [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 500
    })

    const assistantMessage = completion.choices[0].message

    return new Response(
      JSON.stringify({
        role: 'assistant',
        content: assistantMessage.content
      }),
      { 
        headers: { 
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to process request'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function POSTInterview(req: NextRequest) {
  try {
    // Get supabase client
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Check authentication using getUser instead of getSession for better security
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body = await req.json()
    const { messages, type = 'behavioral' } = body

    // Validate request
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages must be an array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Add system prompt if it's not already there
    const fullMessages = messages.find(m => m.role === 'system')
      ? messages
      : [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 500
    })

    const assistantMessage = completion.choices[0].message

    return new Response(
      JSON.stringify({
        role: 'assistant',
        content: assistantMessage.content
      }),
      { 
        headers: { 
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to process request'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function GETInterviewQuestions() {
  return Response.json({
    behavioral: [
      "Tell me about a challenging situation you've faced at work and how you handled it.",
      "Describe a time when you had to work with a difficult team member.",
      "Give me an example of a time you showed leadership.",
      "Tell me about a project you're particularly proud of.",
      "How do you handle conflicting priorities?",
    ],
    technical: [
      "How would you implement a function to find duplicate numbers in an array?",
      "Explain how you would design a URL shortening service.",
      "What's the time complexity of binary search and how would you implement it?",
      "How would you design a real-time chat application?",
      "Explain the difference between TCP and UDP and when to use each.",
    ]
  })
}
