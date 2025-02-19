import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, interviewType } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert interviewer analyzing a ${interviewType} interview. 
          Analyze the interview conversation and provide:
          1. 3-5 key strengths demonstrated by the candidate
          2. 3-5 specific areas for improvement
          3. A score from 1-100 based on overall performance
          4. 3-5 key takeaways or action items for the candidate
          
          Format your response as a JSON object with the following structure:
          {
            "strengths": ["strength1", "strength2", ...],
            "improvements": ["improvement1", "improvement2", ...],
            "overallScore": number,
            "keyTakeaways": ["takeaway1", "takeaway2", ...]
          }`
        },
        ...messages
      ],
      temperature: 0.7,
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze interview' },
      { status: 500 }
    );
  }
}
