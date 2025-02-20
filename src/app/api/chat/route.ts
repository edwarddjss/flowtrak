import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant for FlowTrak, a job application tracking platform. 
          You help users with questions about:
          - How to use the platform
          - Job application strategies
          - Interview preparation
          - Resume and cover letter tips
          - Career advice
          
          Be concise and professional in your responses.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      stream: true
    })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response)
    
    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    )
  }
}
