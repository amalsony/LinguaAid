# LinguaAid - Live Translation App for First Aid Workers & Refugees

LinguaAid is a real-time translation application designed specifically for first aid field workers and refugees to communicate effectively during emergency situations. The app provides instant speech-to-speech translation with automatic transcription and form filling capabilities.

## 🌟 Features

- **Split-Screen Interface**: Separate sides for refugee/patient and responder
- **Real-Time Speech Translation**: 
  - Press and hold to record speech
  - Automatic transcription using ElevenLabs API
  - Translation powered by Google Gemini AI
  - Text-to-speech playback of translations
- **Conversation Transcript**: Download complete conversation history
- **Automatic Form Filling**: AI-powered extraction of patient information (name, age, medical conditions, allergies, etc.)
- **Multi-Language Support**: English, Arabic, Farsi, Pashto, Spanish, French, Somali, Swahili, Ukrainian, Tigrinya
- **Accessible Design**: High contrast, large touch targets, and responsive layout

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- ElevenLabs API key ([Get one here](https://elevenlabs.io/))
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   cd LinguaAid-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   ```bash
   copy .env.example .env.local
   ```
   - Edit `.env.local` and add your API keys:
   ```
   ELEVENLABS_API_KEY=your_actual_elevenlabs_key
   GEMINI_API_KEY=your_actual_gemini_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 How to Use

### Starting a Translation Session

1. Click "Start Live Translation" or navigate to `/talk`
2. **Refugee/Patient side** (left, blue):
   - Select their language from the dropdown
   - Press the microphone button to speak
   - Release to process the audio
3. **Responder side** (right, green):
   - Select their language (default: English)
   - Press the microphone button to speak
   - Release to process the audio

### Features During Session

- **Auto-play translations**: Toggle to automatically play translated text as speech
- **View Transcript**: See the full conversation history
- **Download Transcript**: Save conversation as a text file
- **Extract Patient Info**: Use AI to automatically extract and structure patient information from the conversation

## 🏗️ Project Structure

```
LinguaAid-Frontend/
├── app/
│   ├── api/                    # Next.js API routes
│   │   ├── transcribe/        # ElevenLabs speech-to-text
│   │   ├── translate/         # Gemini translation
│   │   ├── text-to-speech/    # ElevenLabs text-to-speech
│   │   └── extract-info/      # Gemini info extraction
│   ├── talk/                  # Main translation interface
│   ├── dashboard/             # Statistics and info
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/
│   ├── SplitScreenTranslator.tsx  # Main translation component
│   ├── NavBar.tsx
│   ├── Logo.tsx
│   ├── ThemeToggle.tsx
│   ├── AccessibilityButton.tsx
│   ├── A11yProvider.tsx
│   └── PageTabs.tsx
└── public/                    # Static assets
```

## 🔧 API Endpoints

### POST `/api/transcribe`
- **Purpose**: Convert audio to text
- **Input**: FormData with audio file
- **Output**: `{ transcription: string }`

### POST `/api/translate`
- **Purpose**: Translate text between languages
- **Input**: `{ text, sourceLang, targetLang }`
- **Output**: `{ translation: string }`

### POST `/api/text-to-speech`
- **Purpose**: Convert text to speech audio
- **Input**: `{ text, voiceId? }`
- **Output**: Audio stream (audio/mpeg)

### POST `/api/extract-info`
- **Purpose**: Extract patient information from conversation
- **Input**: `{ transcript }`
- **Output**: `{ data: PatientInfo }`

## 🌍 Supported Languages

- English (en)
- Arabic (ar)
- French (fr)
- Spanish (es)
- Farsi/Persian (fa)
- Pashto (ps)
- Ukrainian (uk)
- Somali (so)
- Tigrinya (ti)
- Swahili (sw)

## 🛠️ Technologies Used

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Speech-to-Text**: ElevenLabs API
- **Text-to-Speech**: ElevenLabs API
- **Translation & AI**: Google Gemini API
- **Audio Recording**: MediaRecorder API (Web API)

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ELEVENLABS_API_KEY` | API key for ElevenLabs (transcription & TTS) | Yes |
| `GEMINI_API_KEY` | API key for Google Gemini (translation & extraction) | Yes |

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## 🤝 Contributing

This is a hackathon project. Contributions and improvements are welcome!

## 📄 License

MIT License - feel free to use this project for your needs.

## 🙏 Acknowledgments

- ElevenLabs for high-quality speech services
- Google Gemini for powerful AI translation
- First aid workers and humanitarian organizations worldwide

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for humanitarian aid workers and refugees worldwide.

