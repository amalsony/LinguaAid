import { NextRequest, NextResponse } from 'next/server';
import FormData from 'form-data';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: 'ElevenLabs API key is not configured.' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided.' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create FormData for ElevenLabs API
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append('file', buffer, {
      filename: audioFile.name || 'audio.webm',
      contentType: audioFile.type,
    });
    elevenLabsFormData.append('model_id', 'scribe_v1');

    const XI_API_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

    // Make the API call to ElevenLabs
    const response = await axios.post(XI_API_URL, elevenLabsFormData, {
      headers: {
        ...elevenLabsFormData.getHeaders(),
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return NextResponse.json({ transcription: response.data.text });
  } catch (error: any) {
    console.error('ElevenLabs API Error:', error.response?.data || error.message);
    return NextResponse.json(
      {
        error: 'Failed to transcribe audio.',
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
