"use client";

import { useState, useRef } from "react";

// Reusable SVG Icon for the microphone
const MicIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM11 4a1 1 0 0 1 2 0v8a1 1 0 0 1-2 0V4z" />
    <path d="M12 15a5 5 0 0 0-5 5v1a1 1 0 0 0 2 0v-1a3 3 0 0 1 6 0v1a1 1 0 0 0 2 0v-1a5 5 0 0 0-5-5z" />
  </svg>
);

// Define the props we expect from the parent (TalkPage)
interface AudioRecorderProps {
  fromLanguage: string;
  toLanguage: string;
  onRecordingChange: (isRecording: boolean) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

export default function AudioRecorder({
  fromLanguage,
  toLanguage,
  onRecordingChange,
  onLoadingChange,
}: AudioRecorderProps) {
  // Local state for the component's internal logic
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // modified starts: TTS state/refs
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  const cleanupTts = () => {
    try {
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current.src = "";
      }
      if (ttsAudioUrl) {
        URL.revokeObjectURL(ttsAudioUrl);
        setTtsAudioUrl(null);
      }
    } catch {
      // noop
    }
  };
  // modified ends

  // Helper functions to update local state AND notify the parent
  const setRecording = (state: boolean) => {
    setIsRecording(state);
    onRecordingChange(state);
  };

  const setLoading = (state: boolean) => {
    setIsLoading(state);
    onLoadingChange(state);
  };

  const startRecording = async () => {
    setTranscription("");
    setTranslation("");
    setError("");
    // modified starts: reset any previous TTS audio when starting a new recording
    cleanupTts();
    // modified ends

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Audio recording is not supported by your browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        sendAudioToServer(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true); // Update state and notify parent
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Microphone access was denied. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setRecording(false); // Update state and notify parent
      setLoading(true); // Update state and notify parent
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm"); // server expects "file"
    // Use props for language
    formData.append("fromLanguage", fromLanguage);
    formData.append("toLanguage", toLanguage);

    try {
      const response = await fetch(`${API_URL}/api/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const ct = response.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const errData = await response.json();
          throw new Error(
            errData?.detail?.message || errData?.error || "Transcription failed"
          );
        } else {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text.slice(0, 160)}…`);
        }
      }

      const data = await response.json();
      setTranscription(data.transcription);
      setTranslation(data.translation);
    } catch (err: any) {
      console.error("Error sending audio to server:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false); // Update state and notify parent
    }
  };

  // modified starts: TTS trigger
  const playTranslation = async () => {
    if (!translation || ttsLoading) return;
    setTtsLoading(true);
    setError("");
    try {
      const resp = await fetch(`${API_URL}/api/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translation }),
      });

      if (!resp.ok) {
        const ct = resp.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await resp.json();
          throw new Error(data?.detail?.message || "TTS failed");
        } else {
          const text = await resp.text();
          throw new Error(
            `TTS failed (${resp.status}): ${text.slice(0, 120)}…`
          );
        }
      }

      const blob = await resp.blob(); // Expect audio/mpeg
      cleanupTts();
      const url = URL.createObjectURL(blob);
      setTtsAudioUrl(url);

      if (ttsAudioRef.current) {
        ttsAudioRef.current.src = url;
      } else {
        ttsAudioRef.current = new Audio(url);
      }
      await ttsAudioRef.current.play();
    } catch (e: any) {
      console.error("TTS error:", e);
      setError(e.message || "Error speaking translation.");
    } finally {
      setTtsLoading(false);
    }
  };
  // modified ends

  const handleRecordButtonPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Determine the status text to display
  let statusText =
    "Press the button to record your voice. The translation will appear below.";
  if (isRecording) {
    statusText = "Recording in progress...";
  } else if (isLoading) {
    statusText = "Transcribing & Translating...";
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
      {/* Record Button */}
      <button
        onClick={handleRecordButtonPress}
        disabled={isLoading}
        className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isRecording
            ? "bg-red-600 hover:bg-red-700 focus:ring-red-600"
            : "bg-red-600 hover:bg-red-700 focus:ring-red-600 opacity-90"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label={isRecording ? "Stop Recording" : "Start Recording"}
      >
        {/* Pulsing animation when recording, now red */}
        {isRecording && (
          <span className="absolute inline-flex w-full h-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
        )}
        <MicIcon className="w-8 h-8 text-white" />
      </button>

      {/* Status Text */}
      <p className="mt-4 text-lg font-medium text-gray-700">{statusText}</p>

      {/* Error Display */}
      {error && (
        <div className="w-full p-3 mt-4 text-center text-red-800 bg-red-100 border border-red-300 rounded-md">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results Display */}
      {translation && !isLoading && !error && (
        <div className="w-full p-4 mt-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900">{translation}</h3>
          <p className="mt-3 text-sm text-gray-500">
            <span className="font-medium">Original:</span> {transcription}
          </p>

          <div className="mt-4">
            <button
              onClick={playTranslation}
              disabled={ttsLoading}
              className={`inline-flex items-center px-4 py-2 rounded-md text-white transition ${
                ttsLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              aria-label="Play translated audio"
            >
              {ttsLoading ? "Preparing audio…" : "🔊 Speak translation"}
            </button>
          </div>
        </div>
      )}

      <audio ref={ttsAudioRef} className="hidden" />
    </div>
  );
}
