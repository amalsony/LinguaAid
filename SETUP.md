# LinguaAid - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd LinguaAid-Frontend
npm install
```

### Step 2: Get Your API Keys

#### ElevenLabs API Key
1. Go to [https://elevenlabs.io/](https://elevenlabs.io/)
2. Sign up for a free account
3. Navigate to your profile settings
4. Copy your API key

#### Google Gemini API Key
1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 3: Configure Environment Variables

1. Create a `.env.local` file in the `LinguaAid-Frontend` directory:
   ```bash
   copy .env.example .env.local
   ```

2. Edit `.env.local` and add your API keys:
   ```
   ELEVENLABS_API_KEY=sk_your_actual_elevenlabs_key_here
   GEMINI_API_KEY=your_actual_gemini_key_here
   ```

### Step 4: Run the Application
```bash
npm run dev
```

### Step 5: Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Testing the Application

1. **Open the Talk page**: Click "🎤 Talk" in the navigation
2. **Select languages**: 
   - Refugee side: Choose Arabic or another language
   - Responder side: Keep English or change as needed
3. **Test translation**:
   - Press the blue microphone button on the refugee side
   - Speak a sentence (e.g., "Hello, I need help")
   - Release the button
   - Watch the translation appear on the responder side
4. **Try features**:
   - Toggle "Auto-play translations" to hear the translation spoken
   - Click "Show Transcript" to see full conversation
   - Click "Download Transcript" to save the conversation
   - Click "Extract Patient Info" to get structured medical information

## 🔊 Browser Requirements

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Partial support (some audio formats may vary)

**Important**: The browser will ask for microphone permission. Click "Allow" to use the app.

## 🐛 Troubleshooting

### "No audio file provided" error
- Make sure you granted microphone permissions
- Check that your microphone is working in other apps
- Try a different browser

### "API key not configured" error
- Verify your `.env.local` file exists in the `LinguaAid-Frontend` directory
- Check that API keys are correctly copied (no extra spaces)
- Restart the dev server after adding API keys

### Translation not working
- Check your internet connection
- Verify API keys are valid
- Check the browser console (F12) for detailed error messages

### Audio playback not working
- Check your device volume
- Try toggling "Auto-play translations" off and on
- Some browsers block auto-play; manually click to play

## 📱 Usage Tips

1. **Speak clearly**: Wait 1-2 seconds after pressing the mic button before speaking
2. **One speaker at a time**: Only one person should record at a time
3. **Short sentences**: Break long messages into shorter sentences for better accuracy
4. **Check translations**: Review translations for accuracy before relying on them
5. **Save transcripts**: Download transcripts for important conversations

## 🌐 Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Make sure to set environment variables
- Use Node.js 18+
- Build command: `npm run build`
- Start command: `npm start`

## 🔐 Security Notes

- **Never commit** `.env.local` or API keys to version control
- API keys are kept server-side in Next.js API routes
- Consider rate limiting for production use
- Review ElevenLabs and Gemini usage limits

## 📞 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review API documentation:
  - [ElevenLabs API Docs](https://docs.elevenlabs.io/)
  - [Google Gemini API Docs](https://ai.google.dev/docs)

---

**Ready to help!** Once set up, LinguaAid can facilitate critical communication between first aid workers and refugees in emergency situations.
