import { NextRequest, NextResponse } from 'next/server';
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
    const { text, voiceId } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided.' },
        { status: 400 }
      );
    }

    // Use a default multilingual voice if none provided
    const selectedVoiceId = voiceId || '21m00Tcm4TlvDq8ikWAM'; // Rachel voice

    const XI_API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`;

    const response = await axios.post(
      XI_API_URL,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    // Return the audio as a response
    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error: any) {
    console.error('ElevenLabs TTS API Error:', error.response?.data || error.message);
    return NextResponse.json(
      {
        error: 'Failed to generate speech.',
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
