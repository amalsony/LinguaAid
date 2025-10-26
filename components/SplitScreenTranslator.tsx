'use client';

import { useState, useRef } from 'react';

interface Message {
  id: string;
  side: 'refugee' | 'responder';
  original: string;
  translated: string;
  timestamp: Date;
  originalLang: string;
  targetLang: string;
}

interface PatientInfo {
  'Patient Name': string | null;
  Age: string | null;
  Gender: string | null;
  'Medical Conditions': string | null;
  Allergies: string | null;
  Medications: string | null;
  'Emergency Contact': string | null;
  'Additional Notes': string | null;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'fa', name: 'Farsi (Persian)' },
  { code: 'ps', name: 'Pashto' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'so', name: 'Somali' },
  { code: 'ti', name: 'Tigrinya' },
  { code: 'sw', name: 'Swahili' },
];

function IconButton({ children, className = '', ...props }: any) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  );
}

export default function SplitScreenTranslator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [refugeeIsRecording, setRefugeeIsRecording] = useState(false);
  const [responderIsRecording, setResponderIsRecording] = useState(false);
  const [refugeeLang, setRefugeeLang] = useState('ar');
  const [responderLang, setResponderLang] = useState('en');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [isExtractingInfo, setIsExtractingInfo] = useState(false);
  const [autoPlaySpeech, setAutoPlaySpeech] = useState(true);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const refugeeMediaRecorder = useRef<MediaRecorder | null>(null);
  const responderMediaRecorder = useRef<MediaRecorder | null>(null);
  const refugeeAudioChunks = useRef<Blob[]>([]);
  const responderAudioChunks = useRef<Blob[]>([]);

  const startRecording = async (side: 'refugee' | 'responder') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      const audioChunks = side === 'refugee' ? refugeeAudioChunks : responderAudioChunks;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await processAudio(audioBlob, side);
        stream.getTracks().forEach((t) => t.stop());
      };

      if (side === 'refugee') {
        refugeeMediaRecorder.current = mediaRecorder;
        setRefugeeIsRecording(true);
      } else {
        responderMediaRecorder.current = mediaRecorder;
        setResponderIsRecording(true);
      }

      mediaRecorder.start();
    } catch (err) {
      console.error('microphone error', err);
      alert('Unable to access microphone. Please enable microphone permissions.');
    }
  };

  const stopRecording = (side: 'refugee' | 'responder') => {
    const m = side === 'refugee' ? refugeeMediaRecorder.current : responderMediaRecorder.current;
    if (m && m.state !== 'inactive') m.stop();
    if (side === 'refugee') setRefugeeIsRecording(false);
    else setResponderIsRecording(false);
  };

  const processAudio = async (audioBlob: Blob, side: 'refugee' | 'responder') => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const transcribeResponse = await fetch('/api/transcribe', { method: 'POST', body: formData });
      if (!transcribeResponse.ok) throw new Error('Transcription failed');
      const { transcription } = await transcribeResponse.json();
      if (!transcription || transcription.trim() === '') {
        alert('No speech detected. Please try again.');
        setIsProcessing(false);
        return;
      }

      const sourceLang = side === 'refugee' ? refugeeLang : responderLang;
      const targetLang = side === 'refugee' ? responderLang : refugeeLang;

      const translateResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transcription,
          sourceLang: LANGUAGES.find((l) => l.code === sourceLang)?.name,
          targetLang: LANGUAGES.find((l) => l.code === targetLang)?.name,
        }),
      });

      if (!translateResponse.ok) throw new Error('Translation failed');
      const { translation } = await translateResponse.json();

      const newMessage: Message = {
        id: Date.now().toString(),
        side,
        original: transcription,
        translated: translation,
        timestamp: new Date(),
        originalLang: sourceLang,
        targetLang,
      };

      setMessages((prev) => [...prev, newMessage]);

      if (autoPlaySpeech) await playTranslatedSpeech(translation);
    } catch (err) {
      console.error(err);
      alert('Failed to process audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const playTranslatedSpeech = async (text: string, messageId?: string) => {
    try {
      if (messageId) setPlayingMessageId(messageId);

      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Text-to-speech failed');
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // cleanup when finished
      audio.onended = () => {
        if (messageId) setPlayingMessageId(null);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        if (messageId) setPlayingMessageId(null);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (err) {
      console.error('tts error', err);
      if (messageId) setPlayingMessageId(null);
    }
  };

  const downloadTranscript = () => {
    const transcript = messages
      .map((m) => {
        const speaker = m.side === 'refugee' ? 'Refugee' : 'Responder';
        const time = m.timestamp.toLocaleTimeString();
        return `[${time}] ${speaker}:\nOriginal (${m.originalLang}): ${m.original}\nTranslated (${m.targetLang}): ${m.translated}\n`;
      })
      .join('\n');

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-transcript-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const extractPatientInfo = async () => {
    setIsExtractingInfo(true);
    try {
      const transcript = messages.map((m) => `${m.side === 'refugee' ? 'Patient' : 'Responder'}: ${m.original}`).join('\n');
      const response = await fetch('/api/extract-info', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transcript }) });
      if (!response.ok) throw new Error('Information extraction failed');
      const { data } = await response.json();
      setPatientInfo(data);
      setShowPatientInfo(true);
    } catch (err) {
      console.error(err);
      alert('Failed to extract patient information.');
    } finally {
      setIsExtractingInfo(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top controls */}
      <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-r from-slate-50 to-white p-4 shadow-md md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Live Interpreter</h3>
          <p className="mt-1 text-sm text-slate-500">Two-way, low-friction translation for responders and patients.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-sm">
            <input
              type="checkbox"
              checked={autoPlaySpeech}
              onChange={(e) => setAutoPlaySpeech(e.target.checked)}
              className="h-4 w-4 rounded"
              aria-label="Auto-play translations"
            />
            Auto-play
          </label>

          <IconButton
            onClick={() => setShowTranscript(!showTranscript)}
            className="bg-blue-600 text-white hover:bg-blue-700"
            aria-pressed={showTranscript}
            aria-label="Toggle transcript"
          >
            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          </IconButton>

          <IconButton onClick={downloadTranscript} className="bg-emerald-600 text-white hover:bg-emerald-700" aria-label="Download transcript">
            Download
          </IconButton>

          <IconButton onClick={extractPatientInfo} className="bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60" disabled={isExtractingInfo} aria-label="Extract patient info">
            {isExtractingInfo ? 'Extracting…' : 'Extract Info'}
          </IconButton>
        </div>
      </div>

      {/* Split area */}
      <div className="grid gap-6 md:grid-cols-2">
        {/** Refugee / Patient card */}
        <section aria-labelledby="patient-heading" className="rounded-2xl bg-gradient-to-b from-blue-50/60 to-white/60 p-6 shadow-lg">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h4 id="patient-heading" className="text-xl font-bold text-sky-800">Patient</h4>
              <p className="mt-1 text-sm text-sky-700">Speak in the patient’s language. Translation will appear to the responder.</p>
            </div>
            <select value={refugeeLang} onChange={(e) => setRefugeeLang(e.target.value)} className="rounded-md border border-sky-200 bg-white px-3 py-1 text-sm">
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => (refugeeIsRecording ? stopRecording('refugee') : startRecording('refugee'))}
              disabled={isProcessing || responderIsRecording}
              aria-pressed={refugeeIsRecording}
              aria-label={refugeeIsRecording ? 'Stop recording patient' : 'Start recording patient'}
              className={`flex h-28 w-28 items-center justify-center rounded-full text-white shadow transition-transform disabled:opacity-60 ${refugeeIsRecording ? 'scale-95 bg-red-600 animate-pulse' : 'bg-sky-600 hover:bg-sky-700'}`}
            >
              <img
                src={refugeeIsRecording ? '/microphone-open.svg' : '/microphone-muted.svg'}
                alt={refugeeIsRecording ? 'Microphone open' : 'Microphone muted'}
                className="h-16 w-16"
                aria-hidden="true"
              />
            </button>

            <p className="text-center text-sm font-medium text-sky-700">{refugeeIsRecording ? 'Recording…' : isProcessing ? 'Processing…' : 'Tap to speak'}</p>
          </div>

          <div className="mt-6 rounded-lg bg-white p-4 shadow-inner">
            <h5 className="mb-2 text-sm font-semibold text-slate-700">Latest</h5>
            <div className="space-y-3">
                {messages.filter((m) => m.side === 'refugee').slice(-3).map((msg) => (
                  <article key={msg.id} className="rounded-md border border-sky-100 bg-sky-50 p-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Original • {msg.originalLang.toUpperCase()}</span>
                      <time>{msg.timestamp.toLocaleTimeString()}</time>
                    </div>
                    <p className="mt-1 text-sm font-medium text-sky-800">{msg.original}</p>
                    <div className="mt-1 flex items-start justify-between gap-3">
                      <p className="text-sm text-slate-700">→ {msg.translated}</p>
                      <button
                        onClick={() => playTranslatedSpeech(msg.translated, msg.id)}
                        className={`ml-2 inline-flex items-center rounded-md px-2 py-1 text-sm font-medium bg-white/60 shadow-sm hover:bg-white ${playingMessageId === msg.id ? 'ring-2 ring-sky-300' : ''}`}
                        aria-label={`Play translation for message ${msg.id}`}
                      >
                        {playingMessageId === msg.id ? '🔊 Playing' : '🔈 Play'}
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </section>

        {/** Responder card */}
        <section aria-labelledby="responder-heading" className="rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white/60 p-6 shadow-lg">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h4 id="responder-heading" className="text-xl font-bold text-emerald-800">Responder</h4>
              <p className="mt-1 text-sm text-emerald-700">Speak to the patient. Translation will appear to them.</p>
            </div>
            <select value={responderLang} onChange={(e) => setResponderLang(e.target.value)} className="rounded-md border border-emerald-200 bg-white px-3 py-1 text-sm">
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => (responderIsRecording ? stopRecording('responder') : startRecording('responder'))}
              disabled={isProcessing || refugeeIsRecording}
              aria-pressed={responderIsRecording}
              aria-label={responderIsRecording ? 'Stop recording responder' : 'Start recording responder'}
              className={`flex h-28 w-28 items-center justify-center rounded-full text-white shadow transition-transform disabled:opacity-60 ${responderIsRecording ? 'scale-95 bg-red-600 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              <img
                src={responderIsRecording ? '/microphone-open.svg' : '/microphone-muted.svg'}
                alt={responderIsRecording ? 'Microphone open' : 'Microphone muted'}
                className="h-16 w-16"
                aria-hidden="true"
              />
            </button>

            <p className="text-center text-sm font-medium text-emerald-700">{responderIsRecording ? 'Recording…' : isProcessing ? 'Processing…' : 'Tap to speak'}</p>
          </div>

          <div className="mt-6 rounded-lg bg-white p-4 shadow-inner">
            <h5 className="mb-2 text-sm font-semibold text-slate-700">Latest</h5>
            <div className="space-y-3">
              {messages.filter((m) => m.side === 'responder').slice(-3).map((msg) => (
                <article key={msg.id} className="rounded-md border border-emerald-100 bg-emerald-50 p-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Original • {msg.originalLang.toUpperCase()}</span>
                    <time>{msg.timestamp.toLocaleTimeString()}</time>
                  </div>
                  <p className="mt-1 text-sm font-medium text-emerald-800">{msg.original}</p>
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <p className="text-sm text-slate-700">→ {msg.translated}</p>
                    <button
                      onClick={() => playTranslatedSpeech(msg.translated, msg.id)}
                      className={`ml-2 inline-flex items-center rounded-md px-2 py-1 text-sm font-medium bg-white/60 shadow-sm hover:bg-white ${playingMessageId === msg.id ? 'ring-2 ring-emerald-300' : ''}`}
                      aria-label={`Play translation for message ${msg.id}`}
                    >
                      {playingMessageId === msg.id ? '🔊 Playing' : '🔈 Play'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Transcript modal */}
      {showTranscript && (
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Conversation Transcript</h2>
            <button onClick={() => setShowTranscript(false)} className="text-slate-500 hover:text-slate-700" aria-label="Close transcript">✕</button>
          </div>
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`rounded-lg p-3 ${msg.side === 'refugee' ? 'bg-sky-50' : 'bg-emerald-50'}`}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-gray-600">{msg.side === 'refugee' ? '👤 Patient' : '🚑 Responder'}</span>
                  <span className="text-xs text-gray-500">{msg.timestamp.toLocaleTimeString()}</span>
                </div>
                <p className="mb-1 font-medium">{msg.original}</p>
                <p className="text-sm text-gray-700">→ {msg.translated}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patient info modal */}
      {showPatientInfo && patientInfo && (
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Patient Report</h2>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowPatientInfo(false)} className="text-slate-500 hover:text-slate-700" aria-label="Close patient info">✕</button>
            </div>
          </div>

          {/* Highlight critical items */}
          <div className="mb-4">
            {(patientInfo as any)['Allergies'] && (patientInfo as any)['Allergies'] !== null && (patientInfo as any)['Allergies'] !== '' ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <strong>Allergies:</strong> {(patientInfo as any)['Allergies'] || 'Not provided'}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-gray-100 p-3">
              <label className="mb-1 block text-sm font-semibold text-gray-600">Name</label>
              <p className="text-gray-900">{(patientInfo as any)['Patient Name'] || 'Not provided'}</p>
            </div>

            <div className="rounded-md border border-gray-100 p-3">
              <label className="mb-1 block text-sm font-semibold text-gray-600">Age</label>
              <p className="text-gray-900">{(patientInfo as any)['Age'] || 'Not provided'}</p>
            </div>

            <div className="rounded-md border border-gray-100 p-3">
              <label className="mb-1 block text-sm font-semibold text-gray-600">Gender</label>
              <p className="text-gray-900">{(patientInfo as any)['Gender'] || 'Not provided'}</p>
            </div>

            <div className="rounded-md border border-gray-100 p-3">
              <label className="mb-1 block text-sm font-semibold text-gray-600">Emergency Contact</label>
              <p className="text-gray-900">{(patientInfo as any)['Emergency Contact'] || 'Not provided'}</p>
            </div>

            <div className="md:col-span-2 rounded-md border border-gray-100 p-3">
              <label className="mb-1 block text-sm font-semibold text-gray-600">Medical Conditions</label>
              <p className="text-gray-900">{(patientInfo as any)['Medical Conditions'] || 'Not provided'}</p>
            </div>

            <div className="md:col-span-2 rounded-md border border-gray-100 p-3">
              <label className="mb-1 block text-sm font-semibold text-gray-600">Medications</label>
              <p className="text-gray-900">{(patientInfo as any)['Medications'] || 'Not provided'}</p>
            </div>

            <div className="md:col-span-2 rounded-md border border-gray-100 p-3">
              <label className="mb-1 block text-sm font-semibold text-gray-600">Additional Notes</label>
              <p className="text-gray-900">{(patientInfo as any)['Additional Notes'] || 'Not provided'}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <button
              onClick={() => {
                const data = JSON.stringify(patientInfo, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `patient-info-${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              Download JSON
            </button>

            <button
              onClick={() => {
                // Build a human-readable report
                const info: any = patientInfo;
                const lines: string[] = [];
                lines.push('Patient Report');
                lines.push('==============');
                lines.push(`Name: ${info['Patient Name'] || 'Not provided'}`);
                lines.push(`Age: ${info['Age'] || 'Not provided'}`);
                lines.push(`Gender: ${info['Gender'] || 'Not provided'}`);
                lines.push(`Allergies: ${info['Allergies'] || 'Not provided'}`);
                lines.push(`Medical Conditions: ${info['Medical Conditions'] || 'Not provided'}`);
                lines.push(`Medications: ${info['Medications'] || 'Not provided'}`);
                lines.push(`Emergency Contact: ${info['Emergency Contact'] || 'Not provided'}`);
                lines.push(`Additional Notes: ${info['Additional Notes'] || 'Not provided'}`);
                if (info._raw) {
                  lines.push('');
                  lines.push('Raw extraction output:');
                  lines.push(info._raw);
                }
                const report = lines.join('\n');
                const blob = new Blob([report], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `patient-report-${Date.now()}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Download Report (TXT)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
