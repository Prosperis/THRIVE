# Thrive Deployment Guide

Complete guide for deploying Thrive to production environments.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Build Configuration](#build-configuration)
3. [Deployment Platforms](#deployment-platforms)
4. [Environment Variables](#environment-variables)
5. [Custom Domain Setup](#custom-domain-setup)
6. [HTTPS Configuration](#https-configuration)
7. [Performance Optimization](#performance-optimization)
8. [Monitoring & Analytics](#monitoring--analytics)
9. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production, ensure you've completed these tasks:

### Code Quality

- [ ] All tests passing
- [ ] No TypeScript errors (`bun run type-check`)
- [ ] No linting errors (`bun run lint`)
- [ ] Code formatted (`bun run format`)
- [ ] No console.log or debugging code
- [ ] Error boundaries implemented
- [ ] Loading states implemented

### Performance

- [ ] Bundle size optimized
- [ ] Images optimized (WebP format)
- [ ] Code splitting implemented
- [ ] Lazy loading for heavy components
- [ ] Memoization for expensive computations

### Accessibility

- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] WCAG 2.1 AA compliance verified
- [ ] Color contrast checked
- [ ] Focus indicators visible

### Browser Testing

- [ ] Chrome tested
- [ ] Firefox tested
- [ ] Safari tested
- [ ] Edge tested
- [ ] Mobile browsers tested
- [ ] Responsive design verified

### Security

- [ ] No sensitive data in code
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CSP headers configured (if applicable)
- [ ] Dependencies updated

### Documentation

- [ ] README updated
- [ ] User guide complete
- [ ] Developer guide complete
- [ ] API reference complete
- [ ] Deployment guide (this file)

---

## Build Configuration

### Production Build

```bash
# Build for production
bun run build

# Output location: dist/
# Build includes:
# - Minified JavaScript
# - Optimized CSS
# - Compressed assets
# - Source maps (optional)
```

### Build Configuration (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for debugging
    sourcemap: false, // Set to true for debugging
    
    // Minification
    minify: 'esbuild',
    
    // Target browsers
    target: 'es2020',
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunk splitting
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts'],
        },
      },
    },
  },
  
  // Preview server (for testing production build)
  preview: {
    port: 4173,
    strictPort: true,
  },
});
```

### Environment Variables

Create `.env.production`:

```env
# App Configuration
VITE_APP_NAME=Thrive
VITE_APP_VERSION=1.0.0

# API Configuration (if backend is added)
VITE_API_URL=https://api.yourdomain.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# Analytics (if using)
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## Deployment Platforms

### Vercel (Recommended)

Vercel is optimized for React applications and provides excellent performance.

#### Automatic Deployment (GitHub)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/thrive.git
git push -u origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure settings:
     - **Framework Preset**: Vite
     - **Build Command**: `bun run build`
     - **Output Directory**: `dist`
     - **Install Command**: `bun install`
   - Add environment variables
   - Click "Deploy"

3. **Automatic Deployments**:
   - Every push to `main` automatically deploys
   - Pull requests get preview deployments
   - Rollback to previous deployments anytime

#### Manual Deployment (CLI)

```bash
# Install Vercel CLI
bun add -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

### Netlify

#### Automatic Deployment

1. **Push to GitHub** (same as Vercel)

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your repository
   - Configure build settings:
     - **Build Command**: `bun run build`
     - **Publish Directory**: `dist`
   - Add environment variables
   - Click "Deploy site"

#### Netlify Configuration (`netlify.toml`)

```toml
[build]
  command = "bun run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

### Cloudflare Pages

#### Automatic Deployment

1. **Push to GitHub**

2. **Connect to Cloudflare Pages**:
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Click "Create a project"
   - Connect your GitHub repository
   - Configure build:
     - **Build Command**: `bun run build`
     - **Build Output Directory**: `dist`
   - Add environment variables
   - Click "Save and Deploy"

#### Cloudflare Configuration (`_redirects`)

Create `public/_redirects`:

```
/* /index.html 200
```

---

### GitHub Pages

#### Manual Deployment

1. **Install gh-pages**:
```bash
bun add -D gh-pages
```

2. **Update `package.json`**:
```json
{
  "scripts": {
    "predeploy": "bun run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://username.github.io/thrive"
}
```

3. **Update `vite.config.ts`**:
```typescript
export default defineConfig({
  base: '/thrive/', // Repository name
  // ... other config
});
```

4. **Deploy**:
```bash
bun run deploy
```

5. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` → `/root`
   - Click Save

---

### Docker

#### Dockerfile

```dockerfile
# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build application
RUN bun run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Build and Run

```bash
# Build Docker image
docker build -t thrive .

# Run container
docker run -p 8080:80 thrive

# Open http://localhost:8080
```

---

## Environment Variables

### Development (.env.development)

```env
VITE_APP_NAME=Thrive (Dev)
VITE_APP_VERSION=1.0.0-dev
VITE_API_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=false
```

### Production (.env.production)

```env
VITE_APP_NAME=Thrive
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.yourdomain.com
VITE_ENABLE_ANALYTICS=true
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Accessing in Code

```typescript
// Always prefix with VITE_ to expose to client
const apiUrl = import.meta.env.VITE_API_URL;
const appVersion = import.meta.env.VITE_APP_VERSION;

// Check environment
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
```

### Platform-Specific Setup

**Vercel**:
- Settings → Environment Variables
- Add each variable (VITE_API_URL, etc.)
- Select environment (Production, Preview, Development)

**Netlify**:
- Site settings → Build & deploy → Environment
- Add each variable

**Cloudflare Pages**:
- Settings → Environment variables
- Add variables for Production and Preview

---

## Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your domain: `www.yourdomain.com`
3. Configure DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Vercel automatically provisions SSL certificate
5. Domain active in ~5 minutes

### Netlify

1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: [your-site].netlify.app
   ```
4. SSL certificate automatically provisioned

### Cloudflare Pages

1. Go to Custom domains
2. Add domain
3. DNS configured automatically (if using Cloudflare DNS)
4. SSL/TLS settings: Full (strict)

---

## HTTPS Configuration

### Automatic (Most Platforms)

Vercel, Netlify, and Cloudflare automatically provide SSL certificates via Let's Encrypt. No configuration needed!

### Manual (Custom Server)

1. **Get SSL Certificate**:
   - Use [Let's Encrypt](https://letsencrypt.org/) (free)
   - Use [Certbot](https://certbot.eff.org/) for automation

2. **Configure nginx**:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

3. **Auto-renewal**:
```bash
# Certbot auto-renews via cron
sudo certbot renew --dry-run
```

---

## Performance Optimization

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // Enable/disable source maps
    sourcemap: false,
    
    // Minification
    minify: 'esbuild',
    
    // Chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
        },
      },
    },
    
    // Compression
    reportCompressedSize: true,
  },
});
```

### Code Splitting

```typescript
// Lazy load routes
import { lazy } from 'react';

const AnalyticsPage = lazy(() => import('./routes/analytics'));
const DocumentsPage = lazy(() => import('./routes/documents'));
```

### Asset Optimization

**Images**:
- Use WebP format
- Compress images (TinyPNG, ImageOptim)
- Use appropriate sizes
- Lazy load off-screen images

**Fonts**:
- Use system fonts when possible
- Subset custom fonts
- Preload critical fonts

### Caching Strategy

**Static Assets** (Vercel/Netlify automatically handle this):
```
/assets/* - Cache for 1 year (immutable)
/index.html - No cache (always fresh)
```

**Service Worker** (optional):
```typescript
// Enable PWA caching if needed
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    // Prompt user to reload
  },
});
```

### Performance Budget

Target metrics:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 300KB (gzipped)

---

## Monitoring & Analytics

### Google Analytics

1. **Get Tracking ID** from Google Analytics

2. **Add to environment**:
```env
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

3. **Add tracking code**:
```typescript
// src/lib/analytics.ts
export function initAnalytics() {
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID;
  
  if (!trackingId || !import.meta.env.PROD) return;
  
  // Load GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  document.head.appendChild(script);
  
  // Initialize
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', trackingId);
}

// Track page views
export function trackPageView(path: string) {
  if (typeof window.gtag === 'function') {
    window.gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
      page_path: path,
    });
  }
}

// Track events
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}
```

4. **Initialize in app**:
```typescript
// src/main.tsx
import { initAnalytics } from './lib/analytics';

initAnalytics();
```

### Sentry (Error Tracking)

1. **Install Sentry**:
```bash
bun add @sentry/react
```

2. **Configure**:
```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0,
  });
}
```

### Vercel Analytics

```bash
# Install
bun add @vercel/analytics

# Add to app
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Web Vitals Monitoring

```typescript
// src/lib/web-vitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

export function initWebVitals() {
  onCLS(console.log); // Cumulative Layout Shift
  onFID(console.log); // First Input Delay
  onFCP(console.log); // First Contentful Paint
  onLCP(console.log); // Largest Contentful Paint
  onTTFB(console.log); // Time to First Byte
}
```

---

## Troubleshooting

### Build Issues

**Error: Out of memory**
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 bun run build
```

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install
```

**Type errors**
```bash
# Run type check
bun run type-check

# Fix errors and rebuild
```

### Deployment Issues

**404 on routes**
- Ensure SPA routing configured (redirects to index.html)
- Check `_redirects` or `vercel.json` configuration

**Assets not loading**
- Check `base` path in `vite.config.ts`
- Verify asset paths are relative

**Environment variables not working**
- Ensure prefixed with `VITE_`
- Rebuild after adding variables
- Check platform-specific configuration

**SSL certificate errors**
- Wait for certificate provisioning (5-30 minutes)
- Verify DNS records are correct
- Check domain ownership

### Performance Issues

**Large bundle size**
```bash
# Analyze bundle
bun add -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({ open: true }),
  ],
});

# Build and open analysis
bun run build
```

**Slow loading**
- Enable code splitting
- Lazy load heavy components
- Optimize images
- Enable compression
- Use CDN for assets

---

## Post-Deployment

### Verification Checklist

- [ ] Site loads correctly
- [ ] All routes work
- [ ] Forms submit properly
- [ ] Data persists correctly
- [ ] Theme switching works
- [ ] Responsive design looks good
- [ ] SSL certificate valid
- [ ] Analytics tracking works
- [ ] Error tracking works
- [ ] Performance metrics acceptable

### Maintenance

**Regular Tasks**:
- Monitor error logs (Sentry)
- Check performance metrics
- Review analytics data
- Update dependencies monthly
- Test on new browser versions
- Backup user data (if backend added)

**Updates**:
```bash
# Update dependencies
bun update

# Test locally
bun run dev
bun run build
bun run preview

# Deploy
git push origin main
```

---

## Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Web.dev Performance](https://web.dev/performance/)
- [Google Analytics](https://analytics.google.com/)
- [Sentry Documentation](https://docs.sentry.io/)

---

*Last Updated: October 18, 2025*
*Version: 1.0.0*
