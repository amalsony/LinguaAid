"use client";

import { useState } from "react";
import AudioRecorder from "@/components/AudioRecorder";

// Moved the language lists here
const languages = [
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
  const [fromLanguage, setFromLanguage] = useState("English");
  const [toLanguage, setToLanguage] = useState("Spanish");

  // modified starts: track loading/recording for BOTH panes so we can disable selects
  const [isRecordingA, setIsRecordingA] = useState(false);
  const [isLoadingA, setIsLoadingA] = useState(false);
  const [isRecordingB, setIsRecordingB] = useState(false);
  const [isLoadingB, setIsLoadingB] = useState(false);
  const disableSelectors =
    isRecordingA || isLoadingA || isRecordingB || isLoadingB;
  // modified ends

  return (
    // modified starts: widen container and add two-column layout below selectors
    <section className="space-y-6 w-full max-w-6xl mx-auto">
      {/* Language selectors (shared by both panes) */}
      <div className="flex items-center justify-start w-full max-w-2xl mb-2 space-x-2">
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
            disabled={disableSelectors}
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
            disabled={disableSelectors}
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

      {/* Two synchronized panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Medic -> Patient */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Medic → Patient
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Speak in <span className="font-medium">{fromLanguage}</span>.
            Patient hears <span className="font-medium">{toLanguage}</span>.
          </p>
          <AudioRecorder
            fromLanguage={fromLanguage}
            toLanguage={toLanguage}
            onRecordingChange={setIsRecordingA}
            onLoadingChange={setIsLoadingA}
            // modified ends (additional prop below is optional heading)
            title="Record for patient"
          />
        </div>

        {/* Right: Patient -> Medic */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Patient → Medic
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Patient speaks in <span className="font-medium">{toLanguage}</span>.
            You hear <span className="font-medium">{fromLanguage}</span>.
          </p>
          <AudioRecorder
            fromLanguage={toLanguage} // reversed
            toLanguage={fromLanguage} // reversed
            onRecordingChange={setIsRecordingB}
            onLoadingChange={setIsLoadingB}
            title="Record for medic"
          />
        </div>
      </div>
    </section>
    // modified ends
  );
}
