# Monitoring & Analytics Setup

## Overview

This guide covers setting up error tracking, performance monitoring, and user analytics for Thrive.

---

## Error Tracking with Sentry

### Installation

```bash
bun add @sentry/react @sentry/vite-plugin
```

### Configuration

1. **Create Sentry account:**
   - Sign up at [sentry.io](https://sentry.io)
   - Create a new project (React)
   - Copy your DSN

2. **Add environment variable** (`.env.production`):
   ```env
   VITE_SENTRY_DSN=https://your-public-key@o123456.ingest.sentry.io/123456
   VITE_SENTRY_ENVIRONMENT=production
   ```

3. **Initialize Sentry** in `src/main.tsx`:
   ```typescript
   import * as Sentry from '@sentry/react';

   if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
     Sentry.init({
       dsn: import.meta.env.VITE_SENTRY_DSN,
       environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production',
       integrations: [
         Sentry.browserTracingIntegration(),
         Sentry.replayIntegration({
           maskAllText: false,
           blockAllMedia: false,
         }),
       ],
       tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring
       replaysSessionSampleRate: 0.1, // 10% of sessions
       replaysOnErrorSampleRate: 1.0, // 100% when errors occur
       beforeSend(event, hint) {
         // Filter out errors from browser extensions
         if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
           frame => frame.filename?.includes('extension://')
         )) {
           return null;
         }
         return event;
       },
     });
   }
   ```

4. **Add source maps** (already configured in `vite.config.ts`):
   ```typescript
   import { sentryVitePlugin } from '@sentry/vite-plugin';

   export default defineConfig({
     build: {
       sourcemap: true,
     },
     plugins: [
       // ... other plugins
       sentryVitePlugin({
         org: 'your-org',
         project: 'thrive',
         authToken: process.env.SENTRY_AUTH_TOKEN,
       }),
     ],
   });
   ```

5. **Add GitHub Secrets:**
   - `SENTRY_AUTH_TOKEN` - Create at Sentry → Settings → Auth Tokens
   - `VITE_SENTRY_DSN` - Your project DSN

### Error Boundaries

Wrap critical components with Sentry error boundaries:

```typescript
import * as Sentry from '@sentry/react';

function App() {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
      showDialog
    >
      <YourApp />
    </Sentry.ErrorBoundary>
  );
}
```

### Custom Error Tracking

```typescript
import * as Sentry from '@sentry/react';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'applications',
      action: 'create',
    },
    extra: {
      applicationId: application.id,
    },
  });
}
```

---

## Analytics with Plausible (Privacy-Friendly)

### Why Plausible?

- No cookies, GDPR compliant
- Simple, lightweight (<1KB)
- Real-time dashboard
- No personal data collection

### Setup

1. **Create account** at [plausible.io](https://plausible.io)
   - Add your domain: `adriandarian.github.io/thrive`

2. **Add script** to `index.html`:
   ```html
   <script defer data-domain="adriandarian.github.io/thrive" src="https://plausible.io/js/script.js"></script>
   ```

3. **Track custom events:**
   ```typescript
   // src/lib/analytics.ts
   export const trackEvent = (eventName: string, props?: Record<string, any>) => {
     if (window.plausible) {
       window.plausible(eventName, { props });
     }
   };

   // Usage
   trackEvent('Application Created', {
     company: company.name,
     status: 'applied',
   });
   ```

4. **Track outbound links** automatically:
   ```html
   <script defer data-domain="adriandarian.github.io/thrive" src="https://plausible.io/js/script.outbound-links.js"></script>
   ```

### Key Events to Track

```typescript
// Application events
trackEvent('Application Created');
trackEvent('Application Updated', { field: 'status' });
trackEvent('Application Deleted');

// Interview events
trackEvent('Interview Scheduled');
trackEvent('Interview Completed');

// Document events
trackEvent('Resume Uploaded');
trackEvent('Document Generated');

// Feature usage
trackEvent('Template Used', { template: templateName });
trackEvent('Tag Applied', { tag: tagName });
trackEvent('Note Created');
```

---

## Alternative: Google Analytics 4

If you prefer Google Analytics:

1. **Create GA4 property**
2. **Install package:**
   ```bash
   bun add react-ga4
   ```

3. **Initialize** in `src/main.tsx`:
   ```typescript
   import ReactGA from 'react-ga4';

   if (import.meta.env.PROD && import.meta.env.VITE_GA_TRACKING_ID) {
     ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID, {
       gaOptions: {
         anonymize_ip: true,
       },
     });
   }
   ```

4. **Track page views:**
   ```typescript
   import { useEffect } from 'react';
   import { useLocation } from '@tanstack/react-router';
   import ReactGA from 'react-ga4';

   export function usePageTracking() {
     const location = useLocation();

     useEffect(() => {
       if (import.meta.env.PROD) {
         ReactGA.send({ hitType: 'pageview', page: location.pathname });
       }
     }, [location]);
   }
   ```

---

## Performance Monitoring

### Web Vitals

Track Core Web Vitals automatically:

```bash
bun add web-vitals
```

```typescript
// src/lib/vitals.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  if (window.plausible) {
    window.plausible('Web Vitals', {
      props: {
        metric: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
      },
    });
  }

  // Also send to Sentry
  if (window.Sentry) {
    window.Sentry.captureMessage(`Web Vital: ${metric.name}`, {
      level: 'info',
      extra: metric,
    });
  }
}

// Track metrics
onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

### Performance Observer

Monitor long tasks and slow renders:

```typescript
// src/lib/performance.ts
if (import.meta.env.PROD) {
  // Monitor long tasks (>50ms)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) {
        console.warn('Long task detected:', entry);
        // Report to monitoring service
      }
    }
  });

  observer.observe({ entryTypes: ['longtask'] });
}
```

### Bundle Size Monitoring

Add bundle size checks to CI:

```bash
bunx vite-bundle-visualizer
```

Set size budgets in `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 500, // KB
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep chunks under 200KB
        },
      },
    },
  },
});
```

---

## User Session Recording

### LogRocket (Optional)

For detailed session replay:

1. **Install:**
   ```bash
   bun add logrocket logrocket-react
   ```

2. **Initialize:**
   ```typescript
   import LogRocket from 'logrocket';
   import setupLogRocketReact from 'logrocket-react';

   if (import.meta.env.PROD && import.meta.env.VITE_LOGROCKET_APP_ID) {
     LogRocket.init(import.meta.env.VITE_LOGROCKET_APP_ID);
     setupLogRocketReact(LogRocket);

     // Connect to Sentry
     LogRocket.getSessionURL((sessionURL) => {
       Sentry.configureScope((scope) => {
         scope.setExtra('sessionURL', sessionURL);
       });
     });
   }
   ```

---

## Dashboard & Alerts

### Sentry Alerts

Configure alerts for:

- New error types
- Error rate spikes (>100 errors/hour)
- Slow page loads (LCP >2.5s)
- Failed transactions

### Plausible Dashboard

Monitor:

- Daily active users
- Popular pages
- Traffic sources
- Browser/OS breakdown
- Goal conversions

### Custom Dashboard

Create a unified monitoring dashboard:

```typescript
// src/pages/admin/monitoring.tsx
export function MonitoringDashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Error Rate (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <iframe src="https://sentry.io/..." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <iframe src="https://plausible.io/..." />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Privacy & Compliance

### GDPR Compliance

1. **Add privacy policy** explaining data collection
2. **Use cookie-less analytics** (Plausible)
3. **Anonymize IPs** in Sentry
4. **Allow opt-out:**

```typescript
// src/lib/analytics.ts
export function optOutOfAnalytics() {
  localStorage.setItem('analytics-opt-out', 'true');
  window.plausible = () => {}; // Disable tracking
}

export function hasOptedOut() {
  return localStorage.getItem('analytics-opt-out') === 'true';
}
```

### User Consent

Add a consent banner (if using cookies):

```typescript
import { useState, useEffect } from 'react';

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('analytics-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('analytics-consent', 'true');
    setShow(false);
    // Initialize analytics
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 w-full bg-background border-t p-4">
      <p>We use analytics to improve your experience.</p>
      <Button onClick={accept}>Accept</Button>
    </div>
  );
}
```

---

## Monitoring Checklist

- [ ] Sentry configured for error tracking
- [ ] Source maps uploaded to Sentry
- [ ] Analytics tracking page views
- [ ] Custom events tracked
- [ ] Web Vitals monitored
- [ ] Performance budgets set
- [ ] Alerts configured
- [ ] Privacy policy updated
- [ ] GDPR compliance verified
- [ ] Opt-out mechanism implemented

---

## Testing Monitoring

### Test Sentry

```typescript
// Trigger test error
if (import.meta.env.DEV) {
  throw new Error('Sentry Test Error');
}
```

### Test Analytics

```typescript
// Trigger test event
trackEvent('Test Event', { source: 'manual' });
```

### Verify Setup

1. Check Sentry dashboard for test error
2. Check Plausible for real-time visitor
3. Verify source maps working (stack traces readable)
4. Test error boundaries
5. Monitor performance metrics

---

## Resources

- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/guides/react/
- **Plausible Docs:** https://plausible.io/docs
- **Web Vitals:** https://web.dev/vitals/
- **Performance API:** https://developer.mozilla.org/en-US/docs/Web/API/Performance
