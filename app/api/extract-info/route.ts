import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'Gemini API key is not configured.' },
      { status: 500 }
    );
  }

  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'No transcript provided.' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-default';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `You are a medical information extraction assistant. Analyze the following conversation transcript between a first aid responder and a refugee/patient. Extract the following information if present:

- Patient Name (full name)
- Age
- Gender
- Medical Conditions (any mentioned illnesses, injuries, or symptoms)
- Allergies
- Medications
- Emergency Contact
- Additional Notes (any other relevant medical information)

Return the information in a structured JSON format. If any field is not mentioned in the transcript, set it to null. Be accurate and only extract information that is explicitly stated.

Transcript:
${transcript}

Return only valid JSON without any markdown formatting or additional text.`;

    try {
  const genResult = await model.generateContent(prompt);
  const genResponse = await genResult.response;
  let extractedData = genResponse.text();

      // Clean up the response (remove markdown code blocks if present)
      extractedData = extractedData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      // Attempt to parse JSON from the model's response reliably
      const requiredKeys = [
        'Patient Name',
        'Age',
        'Gender',
        'Medical Conditions',
        'Allergies',
        'Medications',
        'Emergency Contact',
        'Additional Notes',
      ];

      let parsed: any = null;
      try {
        parsed = JSON.parse(extractedData);
      } catch (e) {
        // Try to extract a JSON substring
        const jsonMatch = extractedData.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (e2) {
            parsed = null;
          }
        }
      }

      // Helper to find values in parsed object ignoring key formatting
      const findValue = (obj: any, key: string) => {
        if (!obj || typeof obj !== 'object') return null;
        const target = key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        for (const k of Object.keys(obj)) {
          const norm = k.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          if (norm === target) return obj[k] ?? null;
        }
        return null;
      };

      // Build a normalized result object
      const result: Record<string, any> = {};
      if (parsed && typeof parsed === 'object') {
        for (const key of requiredKeys) {
          const val = findValue(parsed, key);
          result[key] = val === undefined ? null : val;
        }
      } else {
        // If parsing failed, return nulls but include raw text for fallback
        for (const key of requiredKeys) result[key] = null;
        result._raw = extractedData;
      }

      return NextResponse.json({ data: result });
    } catch (error: any) {
      console.error('Gemini API Error:', error.message);
      return NextResponse.json(
        {
          error: 'Failed to extract information.',
          details: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to extract information from transcript.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
