import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import OpenAI from 'openai'
import { 
  FlowGPTRequest, 
  AnalysisType,
  AnalysisResult,
  SearchResultDocument
} from '@/types/flowgpt'
import {
  generateSystemPrompt,
  generateUserPrompt,
  validateAnalysisResult,
  sanitizeContent,
  search_web,
  formatAnalysisResult
} from '@/lib/flowgpt-utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FlowGPTRequest
    const { type, data } = body

    if (!type || !data) {
      return Response.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      )
    }

    const { content, position, company } = data

    if (!position) {
      return Response.json(
        { error: 'Position/Role is required' },
        { status: 400 }
      )
    }

    if (type === 'company' && !company) {
      return Response.json(
        { error: 'Company name is required for company research' },
        { status: 400 }
      )
    }

    if ((type === 'resume' || type === 'mock_interview') && !content) {
      return Response.json(
        { error: `Content is required for ${type === 'resume' ? 'resume analysis' : 'mock interview'}` },
        { status: 400 }
      )
    }

    // Create a new ReadableStream with a controller
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        const writeToStream = async (data: any) => {
          controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'))
        }

        try {
          // Send initial status
          await writeToStream({
            status: 'started',
            message: 'Initializing flowGPT...',
            progress: 0
          })

          let additionalContext = ''

          // Feature-specific analysis steps
          if (type === 'resume') {
            await writeToStream({
              status: 'scanning',
              message: 'Analyzing resume structure and format',
              icon: 'document-scan',
              progress: 15
            })

            await new Promise(resolve => setTimeout(resolve, 800))
            await writeToStream({
              status: 'analyzing_skills',
              message: 'Evaluating professional experience',
              icon: 'briefcase',
              progress: 30
            })

            await new Promise(resolve => setTimeout(resolve, 800))
            await writeToStream({
              status: 'ats_check',
              message: 'Running ATS compatibility check',
              icon: 'shield-check',
              progress: 45
            })

            await new Promise(resolve => setTimeout(resolve, 800))
            await writeToStream({
              status: 'matching',
              message: `Matching qualifications with ${position}`,
              icon: 'target',
              progress: 60
            })

          } else if (type === 'company') {
            await writeToStream({
              status: 'research',
              message: 'Analyzing company profile',
              icon: 'building',
              progress: 15
            })

            await new Promise(resolve => setTimeout(resolve, 800))
            await writeToStream({
              status: 'culture',
              message: 'Evaluating company culture and values',
              icon: 'users',
              progress: 30
            })

            // Skip web search if API URL is not configured
            if (process.env.CODEIUM_API_URL && process.env.CODEIUM_API_KEY) {
              try {
                await writeToStream({
                  status: 'searching',
                  message: 'Gathering latest industry insights',
                  icon: 'chart-line',
                  progress: 45
                })

                const searchResults = await search_web({
                  query: `${company} ${position || ''} culture benefits careers news 2024 2025`,
                  domain: ''
                })

                if (searchResults?.documents?.length > 0) {
                  additionalContext = `\n\nRecent information about ${company}:\n` + 
                    searchResults.documents
                      .slice(0, 5)
                      .map((doc: SearchResultDocument) => 
                        `- ${doc.title}\nSummary: ${doc.snippet}\nSource: ${doc.url}`
                      )
                      .join('\n\n')
                  
                  await writeToStream({
                    status: 'processing',
                    message: 'Synthesizing market data',
                    icon: 'chart-bar',
                    progress: 60
                  })
                }
              } catch (searchError) {
                await writeToStream({
                  status: 'processing',
                  message: 'Analyzing available information',
                  icon: 'database',
                  progress: 60
                })
              }
            } else {
              await writeToStream({
                status: 'processing',
                message: 'Analyzing core company data',
                icon: 'database',
                progress: 60
              })
            }

          } else if (type === 'mock_interview') {
            await writeToStream({
              status: 'initializing',
              message: 'Setting up your mock interview...',
              icon: 'brain',
              progress: 15,
              messages: [{
                role: 'interviewer',
                content: `Hello! I'll be your interviewer today for the ${position} position${company ? ` at ${company}` : ''}. Let's start with a brief introduction.`
              }]
            })

            await new Promise(resolve => setTimeout(resolve, 800))
            await writeToStream({
              status: 'analyzing_background',
              message: 'Analyzing your background and experience...',
              icon: 'user',
              progress: 30,
              messages: [{
                role: 'interviewer',
                content: `I see you have experience in ${content}. Let's dive into some technical questions.`
              }]
            })

            await new Promise(resolve => setTimeout(resolve, 800))
            await writeToStream({
              status: 'generating_questions',
              message: 'Preparing interview questions...',
              icon: 'sparkles',
              progress: 45,
              messages: [{
                role: 'interviewer',
                content: 'I have a mix of technical and behavioral questions prepared. Are you ready to begin?'
              }]
            })

            // Generate interview questions using GPT-4
            const completion = await openai.chat.completions.create({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: `You are an expert technical interviewer for a ${position} position${
                    company ? ` at ${company}` : ''
                  }. Generate a structured mock interview with:
                  1. Technical questions
                  2. System design questions
                  3. Behavioral questions
                  4. Coding challenges
                  
                  Format as a JSON array of questions, each with:
                  - type: "technical" | "system_design" | "behavioral" | "coding"
                  - question: string
                  - expectedDuration: number (in minutes)
                  - hints: string[]
                  - acceptanceCriteria: string[]
                  - followUp: string[]
                  - testCases: { input: string, output: string }[] (for coding questions)
                  - sampleSolution: string`
                },
                {
                  role: "user",
                  content: `Candidate background: ${content}`
                }
              ],
              temperature: 0.7,
              max_tokens: 2000
            })

            const questions = JSON.parse(completion.choices[0]?.message?.content || '[]')

            await writeToStream({
              status: 'ready',
              message: 'Interview questions ready',
              icon: 'check',
              progress: 95,
              messages: [{
                role: 'interviewer',
                content: "Let's begin with the first question.",
                questions
              }]
            })

            // Small delay before completion
            await new Promise(resolve => setTimeout(resolve, 500))

            await writeToStream({
              status: 'completed',
              message: 'Mock interview session ready',
              progress: 100,
              result: {
                type: 'mock_interview',
                questions,
                sessionId: Date.now().toString(),
                position,
                company,
                startTime: new Date().toISOString()
              }
            })
          }

          await writeToStream({
            status: 'analyzing',
            message: 'Generating comprehensive insights',
            icon: 'brain',
            progress: 75
          })

          const systemPrompt = generateSystemPrompt(type)
          const userPrompt = generateUserPrompt(type, content || '', position, company) + additionalContext

          let result: any = null
          let attempts = 0
          const maxAttempts = 3

          while (attempts < maxAttempts && !result) {
            try {
              await writeToStream({
                status: 'processing',
                message: 'AI processing in progress',
                icon: 'microchip',
                progress: 85 + (attempts * 2)
              })

              const completion = await openai.chat.completions.create({
                messages: [
                  { 
                    role: "system", 
                    content: `${systemPrompt}\n\nIMPORTANT: You must respond with a valid JSON object following this exact structure for the ${type} type. Your entire response must be a properly formatted JSON object that can be parsed by JSON.parse(). Do not include any explanations, notes, or text outside of the JSON object.` 
                  },
                  { 
                    role: "user", 
                    content: userPrompt 
                  }
                ],
                model: "gpt-4o",
                temperature: 0.7
              })

              const content = completion.choices[0]?.message?.content
              if (!content) {
                throw new Error('No response content from AI')
              }

              try {
                const jsonContent = content.trim().replace(/^```json\n?|\n?```$/g, '').trim()
                const parsedResult = JSON.parse(jsonContent)
                
                if (validateAnalysisResult(type, parsedResult)) {
                  result = parsedResult
                  
                  const formattedResult = formatAnalysisResult(type, result)

                  // First send the formatting status
                  await writeToStream({
                    status: 'formatting',
                    message: 'Polishing insights',
                    icon: 'wand-magic-sparkles',
                    progress: 95
                  })

                  // Small delay to show the transition
                  await new Promise(resolve => setTimeout(resolve, 500))

                  // Then send the completed status with the result
                  await writeToStream({
                    status: 'completed',
                    message: 'Analysis complete!',
                    icon: 'check-circle',
                    progress: 100,
                    result: formattedResult
                  })
                } else {
                  throw new Error('Response structure does not match expected format')
                }
              } catch (parseError) {
                if (parseError instanceof SyntaxError) {
                  throw new Error('Invalid JSON response from AI')
                }
                throw parseError
              }

              attempts++
            } catch (error: any) {
              console.error('Error in analysis attempt:', error)
              if (attempts === maxAttempts - 1) {
                throw error
              }
              attempts++
            }
          }

        } catch (error: any) {
          await writeToStream({
            status: 'error',
            message: error.message || 'An error occurred during analysis',
            icon: 'exclamation-triangle',
            progress: 0
          })
          return new Response(null, { status: 500 })
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error: any) {
    console.error('FlowGPT Analysis Error:', error)
    return Response.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
