# Deployment Guide for LinguaAid

## 🚀 Deploying to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications and offers seamless integration.

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- API keys ready (ElevenLabs and Gemini)

### Steps

1. **Push your code to GitHub**
   ```bash
   cd LinguaAid-Frontend
   git init
   git add .
   git commit -m "Initial commit - LinguaAid application"
   git branch -M main
   git remote add origin https://github.com/yourusername/linguaaid.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `LinguaAid-Frontend` directory as the root

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     ```
     ELEVENLABS_API_KEY = your_elevenlabs_key
     GEMINI_API_KEY = your_gemini_key
     ```
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 2-3 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### Automatic Deployments
- Every push to `main` branch triggers automatic deployment
- Pull requests create preview deployments

## 🐳 Docker Deployment

### Build Docker Image
```bash
cd LinguaAid-Frontend

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
EOF

# Build
docker build -t linguaaid .

# Run
docker run -p 3000:3000 \
  -e ELEVENLABS_API_KEY=your_key \
  -e GEMINI_API_KEY=your_key \
  linguaaid
```

## ☁️ AWS Deployment

### Using AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd LinguaAid-Frontend
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Add Environment Variables**
   - In Amplify app settings
   - Add `ELEVENLABS_API_KEY` and `GEMINI_API_KEY`

## 🌍 DigitalOcean App Platform

1. **Create New App**
   - Connect GitHub repository
   - Select `LinguaAid-Frontend` directory

2. **Configure**
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Port: `3000`

3. **Environment Variables**
   - Add your API keys in the settings

## 🔧 Self-Hosted (Linux Server)

### Using PM2

```bash
# On your server
cd /var/www
git clone your-repo-url linguaaid
cd linguaaid/LinguaAid-Frontend

# Install dependencies
npm ci --production

# Create .env.local file
cat > .env.local << EOF
ELEVENLABS_API_KEY=your_key
GEMINI_API_KEY=your_key
EOF

# Build
npm run build

# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "linguaaid" -- start

# Set up auto-restart on server reboot
pm2 startup
pm2 save
```

### Using Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Performance Optimization

### Enable Caching
- Configure CDN (Cloudflare, AWS CloudFront)
- Enable Next.js static optimization

### Monitoring
- Set up error tracking (Sentry)
- Monitor API usage (ElevenLabs and Gemini dashboards)
- Set up uptime monitoring

## 🔐 Security Best Practices

1. **API Keys**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **Rate Limiting**
   - Implement rate limiting on API routes
   - Use Vercel's built-in rate limiting or middleware

3. **HTTPS**
   - Always use HTTPS in production
   - Vercel provides this automatically

4. **Content Security Policy**
   - Configure CSP headers in `next.config.ts`

## 💰 Cost Estimation

### Free Tier Usage
- **Vercel**: Free for hobby projects
- **ElevenLabs**: 
  - Free tier: 10,000 characters/month for TTS
  - Speech-to-text has separate limits
- **Google Gemini**: Free tier with rate limits

### Production Costs (estimated monthly)
- **Hosting**: $0-20 (Vercel Pro if needed)
- **ElevenLabs**: $5-50 depending on usage
- **Gemini API**: Pay per request (usually < $10 for moderate use)

**Total**: ~$15-80/month for moderate production use

## 📈 Scaling Considerations

1. **API Rate Limits**
   - Monitor API usage
   - Implement caching where possible
   - Consider API key rotation

2. **Database** (for future features)
   - Add PostgreSQL or MongoDB for session storage
   - Use Vercel Postgres or MongoDB Atlas

3. **CDN**
   - Enable for static assets
   - Reduce API calls with client-side caching

## 🧪 Testing in Production

1. **Deploy to staging first**
   - Use Vercel preview deployments
   - Test with real API keys in staging

2. **Monitor logs**
   - Check Vercel logs
   - Monitor API error rates

3. **User testing**
   - Test with various languages
   - Verify audio works on different devices

---

## 🎉 Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] API keys working
- [ ] Microphone permissions work
- [ ] Audio recording functional
- [ ] Translation working correctly
- [ ] TTS playback working
- [ ] Transcript download works
- [ ] Patient info extraction works
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Error monitoring set up
- [ ] Backup/recovery plan in place

---

**Need help?** Check the [SETUP.md](./SETUP.md) for local development or consult the platform-specific documentation.
