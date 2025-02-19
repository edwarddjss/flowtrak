import OpenAI from 'openai'
import { InterviewQuestion } from '@/types/interview'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface TestCase {
  input: any[]
  expectedOutput: any
  description: string
}

export interface CodeExecutionResult {
  success: boolean
  output: any
  error?: string
  executionTime?: number
  memoryUsage?: number
  testResults?: {
    passed: boolean
    input: any[]
    expectedOutput: any
    actualOutput: any
    description: string
  }[]
  feedback?: {
    correctness: number
    efficiency: number
    codeQuality: number
    suggestions: string[]
  }
}

export async function executeCode(
  code: string,
  language: string,
  question: InterviewQuestion,
  testCases: TestCase[]
): Promise<CodeExecutionResult> {
  try {
    // First, analyze the code for potential issues and get suggestions
    const analysisPrompt = `
      Analyze this ${language} code solution for the following problem:
      "${question.question}"
      
      Code:
      ${code}
      
      Provide analysis in JSON format with:
      1. Any potential issues or bugs
      2. Time complexity analysis
      3. Space complexity analysis
      4. Code quality suggestions
      5. Performance optimization suggestions
    `

    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert code reviewer. Analyze code for correctness, efficiency, and quality."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      response_format: { type: "json_object" }
    })

    const analysis = JSON.parse(analysisResponse.choices[0].message.content || '{}')

    // Then, simulate code execution and test cases
    const executionPrompt = `
      Execute this ${language} code with the following test cases:
      ${JSON.stringify(testCases)}
      
      Code:
      ${code}
      
      For each test case:
      1. Show the input used
      2. Show the expected output
      3. Show the actual output
      4. Indicate if the test passed
      5. Provide execution time (simulated)
      6. Provide memory usage (simulated)
      
      Return results in JSON format.
    `

    const executionResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a code execution engine. Run code and provide detailed results."
        },
        {
          role: "user",
          content: executionPrompt
        }
      ],
      response_format: { type: "json_object" }
    })

    const executionResults = JSON.parse(executionResponse.choices[0].message.content || '{}')

    // Combine analysis and execution results
    return {
      success: executionResults.allTestsPassed || false,
      output: executionResults.output,
      executionTime: executionResults.totalExecutionTime,
      memoryUsage: executionResults.totalMemoryUsage,
      testResults: executionResults.testResults,
      feedback: {
        correctness: executionResults.correctnessScore || 0,
        efficiency: analysis.efficiencyScore || 0,
        codeQuality: analysis.codeQualityScore || 0,
        suggestions: [
          ...analysis.suggestions || [],
          ...analysis.optimizationSuggestions || []
        ]
      }
    }
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      testResults: [],
      feedback: {
        correctness: 0,
        efficiency: 0,
        codeQuality: 0,
        suggestions: ['Error executing code']
      }
    }
  }
}
