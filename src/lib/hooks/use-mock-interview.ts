import { useState, useEffect, useCallback } from 'react'
import { 
  InterviewType, 
  InterviewQuestion, 
  InterviewAnswer, 
  InterviewSession,
  InterviewFeedback,
  behavioralQuestions,
  technicalQuestions
} from '@/types/interview'
import { 
  generateQuestions, 
  analyzeCandidateResponse, 
  generateFollowUpQuestion,
  generateOverallFeedback
} from '@/lib/interview-ai'

interface InterviewState {
  isActive: boolean
  type: InterviewType | null
  currentQuestion: InterviewQuestion | null
  session: InterviewSession | null
  isProcessing: boolean
  error: string | null
}

export function useMockInterview() {
  const [state, setState] = useState<InterviewState>({
    isActive: false,
    type: null,
    currentQuestion: null,
    session: null,
    isProcessing: false,
    error: null
  })

  const startInterview = useCallback(async (
    type: InterviewType,
    role: string = 'Software Engineer',
    experience: string = '3-5 years'
  ) => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }))

    try {
      // Get AI-generated questions or use pre-defined ones based on type
      const questions = process.env.OPENAI_API_KEY
        ? await generateQuestions(type, role, experience)
        : type === 'behavioral' 
          ? behavioralQuestions 
          : technicalQuestions

      const session: InterviewSession = {
        id: Math.random().toString(36).substring(7),
        type,
        startTime: new Date(),
        questions,
        answers: []
      }

      setState(prev => ({
        ...prev,
        isActive: true,
        type,
        currentQuestion: questions[0],
        session,
        isProcessing: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to start interview. Please try again.',
        isProcessing: false
      }))
    }
  }, [])

  const submitAnswer = useCallback(async (answer: string) => {
    if (!state.session || !state.currentQuestion) return

    setState(prev => ({ ...prev, isProcessing: true }))

    try {
      // Get AI feedback on the answer
      const feedback = process.env.OPENAI_API_KEY
        ? await analyzeCandidateResponse(state.currentQuestion, answer)
        : {
            score: 85,
            strengths: ['Good structure', 'Clear examples'],
            improvements: ['Could provide more details'],
            communicationClarity: 90,
            structuredResponse: 85,
            specificExamples: 80,
            completeness: 85,
            recommendations: ['Consider using the STAR method']
          }

      const interviewAnswer: InterviewAnswer = {
        questionId: state.currentQuestion.id,
        answer,
        feedback,
        duration: 0, // TODO: Add actual duration tracking
        timestamp: new Date()
      }

      // Get next question
      const currentIndex = state.session.questions.findIndex(
        q => q.id === state.currentQuestion?.id
      )
      const nextQuestion = state.session.questions[currentIndex + 1]

      // Update session with new answer and possibly get a follow-up question
      const updatedSession = {
        ...state.session,
        answers: [...state.session.answers, interviewAnswer]
      }

      setState(prev => ({
        ...prev,
        currentQuestion: nextQuestion,
        session: updatedSession,
        isProcessing: false
      }))

      // If no next question, end the interview
      if (!nextQuestion) {
        endInterview()
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to process answer. Please try again.',
        isProcessing: false
      }))
    }
  }, [state.session, state.currentQuestion])

  const endInterview = useCallback(async () => {
    if (!state.session) return

    setState(prev => ({ ...prev, isProcessing: true }))

    try {
      // Get overall feedback from AI
      const overallFeedback = process.env.OPENAI_API_KEY
        ? await generateOverallFeedback(state.session)
        : {
            score: 88,
            strengths: ['Strong communication', 'Good technical depth'],
            improvements: ['Could improve answer structure'],
            technicalAccuracy: 85,
            communicationClarity: 90,
            structuredResponse: 85,
            specificExamples: 90,
            completeness: 90,
            recommendations: ['Practice STAR method', 'Add more technical details']
          }

      const updatedSession = {
        ...state.session,
        endTime: new Date(),
        overallFeedback
      }

      setState(prev => ({
        ...prev,
        isActive: false,
        session: updatedSession,
        isProcessing: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to generate feedback. Please try again.',
        isProcessing: false
      }))
    }
  }, [state.session])

  return {
    ...state,
    startInterview,
    submitAnswer,
    endInterview
  }
}
