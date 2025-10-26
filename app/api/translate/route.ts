import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
  }

  try {
    const { text, sourceLang, targetLang } = await request.json();

    if (!text || !sourceLang || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required fields: text, sourceLang, targetLang' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY!;
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-default';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Only provide the translation, no explanations or additional text.\n\nText to translate: "${text}"`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translation = response.text();
      return NextResponse.json({ translation: translation.trim() });
    } catch (error: any) {
      console.error('Gemini API Error:', error.message);
      return NextResponse.json(
        {
          error: 'Failed to translate text.',
          details: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to translate text.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
