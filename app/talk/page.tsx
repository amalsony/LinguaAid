import SplitScreenTranslator from '@/components/SplitScreenTranslator';

export default function TalkPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <header className="mx-auto mb-6 max-w-4xl rounded-lg bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold leading-tight text-slate-900">Live Translation</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Real-time, two-way translation designed for first aid responders and people seeking help.
          Tap the microphone on your side to speak — translations appear on the other side and can be
          played automatically.
        </p>
      </header>

      <div className="mx-auto max-w-5xl">
        <SplitScreenTranslator />
      </div>
    </main>
  );
}
