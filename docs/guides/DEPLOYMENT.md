# Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite settings
6. Click "Deploy"

## 📦 Deploy to Netlify

### Option 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Option 2: Drag & Drop

1. Build your project: `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist` folder
4. Your site is live!

### Option 3: GitHub Integration

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import from Git"
4. Connect GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy"

## 🐙 Deploy to GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Update vite.config.ts with base path:
export default defineConfig({
  base: '/icony/', // repository name
  // ... other config
})

# Deploy
npm run deploy
```

## 🔧 Build Configuration

### Environment Variables

Create `.env.production`:

```env
# Optional analytics
VITE_ANALYTICS_ID=your-analytics-id

# Optional API endpoint (for future backend)
VITE_API_URL=https://api.example.com
```

### Optimize Build

**vite.config.ts** optimizations:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'lucide-react': ['lucide-react'],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
})
```

## 📊 Performance Checklist

- [x] Code splitting configured
- [x] Tree shaking enabled (Vite default)
- [x] CSS purging (Tailwind default)
- [x] Gzip compression (host default)
- [ ] Image optimization (add if using custom images)
- [ ] Service Worker (PWA feature)

## 🔍 SEO Configuration

Update `index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- SEO -->
  <title>Icony - Icon Customization Tool</title>
  <meta name="description" content="Customize icons with custom colors and export as PNG. Perfect for presentations and documents." />
  <meta name="keywords" content="icon, customization, png, export, design tool" />

  <!-- Open Graph -->
  <meta property="og:title" content="Icony - Icon Customization Tool" />
  <meta property="og:description" content="Customize icons with custom colors and export as PNG" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://your-domain.com" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Icony - Icon Customization Tool" />
  <meta name="twitter:description" content="Customize icons with custom colors and export as PNG" />
</head>
```

## 🔒 Security Headers

Add to `public/_headers` (Netlify) or `vercel.json` (Vercel):

**Netlify (`public/_headers`)**:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```

**Vercel (`vercel.json`)**:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 📈 Analytics Integration

### Google Analytics

```bash
npm install react-ga4
```

**src/main.tsx**:
```typescript
import ReactGA from 'react-ga4';

if (import.meta.env.PROD) {
  ReactGA.initialize(import.meta.env.VITE_ANALYTICS_ID);
}
```

### Plausible Analytics (Privacy-friendly)

Add to `index.html`:
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🐛 Monitoring & Error Tracking

### Sentry Integration

```bash
npm install @sentry/react
```

**src/main.tsx**:
```typescript
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
  });
}
```

## ✅ Pre-Deployment Checklist

- [ ] Build passes: `npm run build`
- [ ] No TypeScript errors: `npm run tsc --noEmit`
- [ ] All features tested locally
- [ ] Browser compatibility tested
- [ ] Mobile responsiveness checked
- [ ] Performance optimized
- [ ] SEO metadata added
- [ ] Analytics configured
- [ ] Error tracking setup
- [ ] Domain/DNS configured

## 🌐 Custom Domain Setup

### Vercel
1. Go to project settings
2. Add custom domain
3. Update DNS records (Vercel provides instructions)

### Netlify
1. Go to domain settings
2. Add custom domain
3. Netlify handles SSL automatically

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📱 PWA Configuration (Optional)

```bash
npm install -D vite-plugin-pwa
```

**vite.config.ts**:
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Icony',
        short_name: 'Icony',
        description: 'Icon Customization Tool',
        theme_color: '#3B82F6',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## 🎉 Post-Deployment

1. Test all features on production URL
2. Run Lighthouse audit
3. Test on multiple devices
4. Monitor analytics
5. Check error tracking
6. Share with users!

## 📞 Support

- GitHub Issues: Report bugs and request features
- Documentation: See `/docs` folder
- Email: your-email@example.com
