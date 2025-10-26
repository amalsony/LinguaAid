'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    // Load session count from localStorage
    const stored = localStorage.getItem('linguaaid_sessions');
    if (stored) {
      try {
        const sessions = JSON.parse(stored);
        setSessionCount(sessions.length || 0);
      } catch (e) {
        setSessionCount(0);
      }
    }
  }, []);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="max-w-2xl muted">
        Monitor translation sessions and view statistics. This view gives a quick pulse on
        activity and usage so teams can stay prepared.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-5">
          <h2 className="mb-2 text-sm font-medium text-gray-600">Total Sessions</h2>
          <p className="text-3xl font-bold text-blue-600">{sessionCount}</p>
          <p className="mt-1 text-xs text-gray-500">
            {sessionCount === 0 ? 'No sessions yet' : 'Completed conversations'}
          </p>
        </div>

        <div className="card p-5">
          <h2 className="mb-2 text-sm font-medium text-gray-600">Languages Supported</h2>
          <p className="text-3xl font-bold text-green-600">10+</p>
          <p className="mt-1 text-xs text-gray-500">Including Arabic, Farsi, Pashto, Somali</p>
        </div>

        <div className="card p-5">
          <h2 className="mb-2 text-sm font-medium text-gray-600">AI-Powered</h2>
          <p className="text-3xl font-bold text-purple-600">✓</p>
          <p className="mt-1 text-xs text-gray-500">ElevenLabs + Google Gemini</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Features</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-xl">🎤</span>
            <div>
              <h3 className="font-medium">Real-time Speech Translation</h3>
              <p className="text-sm text-gray-600">
                Speak naturally and get instant translations in both directions
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">🔊</span>
            <div>
              <h3 className="font-medium">Text-to-Speech Playback</h3>
              <p className="text-sm text-gray-600">
                Hear translations spoken aloud in natural voices
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">📝</span>
            <div>
              <h3 className="font-medium">Conversation Transcripts</h3>
              <p className="text-sm text-gray-600">
                Download full conversation history for records
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">📋</span>
            <div>
              <h3 className="font-medium">Automatic Form Filling</h3>
              <p className="text-sm text-gray-600">
                AI extracts patient information from conversations
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">🌍</span>
            <div>
              <h3 className="font-medium">Multi-Language Support</h3>
              <p className="text-sm text-gray-600">
                Communicate in English, Arabic, Farsi, Pashto, and more
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="rounded-lg bg-blue-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-blue-900">Getting Started</h2>
        <p className="mb-4 text-sm text-blue-800">
          To begin using LinguaAid, click the "Talk" button in the navigation or on the home page.
          Each person selects their language, then takes turns pressing the microphone button to speak.
        </p>
        <a
          href="/talk"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Start Translation Session →
        </a>
      </div>
    </section>
  );
}

