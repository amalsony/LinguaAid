"use client";

import { useState } from "react";
import AudioRecorder from "@/components/AudioRecorder";

// Moved the language lists here
const languages = [
  { value: "auto", label: "Auto-Detect" },
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "Arabic", label: "Arabic" },
  { value: "Ukrainian", label: "Ukrainian" },
  { value: "Pashto", label: "Pashto" },
  { value: "Dari", label: "Dari" },
  { value: "German", label: "German" },
  { value: "Polish", label: "Polish" },
];

const targetLanguages = languages.filter((lang) => lang.value !== "auto");

// Arrow icon for the language bar
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
      clipRule="evenodd"
    />
  </svg>
);

export default function TalkPage() {
  // State for languages and loading/recording status is now here
  const [fromLanguage, setFromLanguage] = useState("auto");
  const [toLanguage, setToLanguage] = useState("Spanish");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section className="space-y-2 w-full">
      <div className="flex items-center justify-start w-full max-w-lg mb-6 space-x-2">
        <div className="flex-1">
          <label
            htmlFor="from-lang"
            className="block text-sm font-medium text-gray-700"
          >
            Medic
          </label>
          <select
            id="from-lang"
            name="from-lang"
            disabled={isLoading || isRecording}
            value={fromLanguage}
            onChange={(e) => setFromLanguage(e.target.value)}
            className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:opacity-50"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-5">
          <ArrowRightIcon className="w-5 h-5 text-gray-400" />
        </div>

        <div className="flex-1">
          <label
            htmlFor="to-lang"
            className="block text-sm font-medium text-gray-700"
          >
            Patient
          </label>
          <select
            id="to-lang"
            name="to-lang"
            disabled={isLoading || isRecording}
            value={toLanguage}
            onChange={(e) => setToLanguage(e.target.value)}
            className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:opacity-50"
          >
            {targetLanguages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AudioRecorder
        fromLanguage={fromLanguage}
        toLanguage={toLanguage}
        onRecordingChange={setIsRecording}
        onLoadingChange={setIsLoading}
      />
    </section>
  );
}
