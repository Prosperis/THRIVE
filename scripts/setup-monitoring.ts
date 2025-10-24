#!/usr/bin/env bun

/**
 * Setup script for monitoring and analytics
 * Run with: bun run scripts/setup-monitoring.ts
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message: string, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(`${COLORS.blue}${question}${COLORS.reset} `);
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
}

async function main() {
  log('\n🚀 Monitoring & Analytics Setup\n', COLORS.green);
  log('This script will help you configure Sentry and analytics.\n');

  // Check if .env.production exists
  const envPath = join(process.cwd(), '.env.production');
  let envContent = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : '';

  // Sentry setup
  log('📊 Sentry Error Tracking', COLORS.yellow);
  const useSentry = await prompt('Enable Sentry? (y/n):');

  if (useSentry.toLowerCase() === 'y') {
    log('\n1. Create a free account at https://sentry.io');
    log('2. Create a new React project');
    log('3. Copy your DSN\n');

    const sentryDsn = await prompt('Enter your Sentry DSN:');
    if (sentryDsn) {
      envContent += `\n# Sentry Error Tracking\nVITE_SENTRY_DSN=${sentryDsn}\nVITE_SENTRY_ENVIRONMENT=production\n`;
      log('✓ Sentry DSN added to .env.production', COLORS.green);
    }
  }

  // Analytics setup
  log('\n📈 Analytics', COLORS.yellow);
  log('Choose an analytics provider:');
  log('1. Plausible (Privacy-friendly, recommended)');
  log('2. Google Analytics 4');
  log('3. None\n');

  const analyticsChoice = await prompt('Enter choice (1/2/3):');

  if (analyticsChoice === '1') {
    log('\n1. Create account at https://plausible.io');
    log('2. Add domain: adriandarian.github.io/thrive');
    log('3. Copy the script snippet\n');

    const domain = await prompt('Enter your Plausible domain:');
    if (domain) {
      envContent += `\n# Plausible Analytics\nVITE_PLAUSIBLE_DOMAIN=${domain}\nVITE_ENABLE_ANALYTICS=true\n`;
      log('✓ Plausible configured', COLORS.green);
    }
  } else if (analyticsChoice === '2') {
    const gaId = await prompt('Enter your Google Analytics Tracking ID (G-XXXXXXXXXX):');
    if (gaId) {
      envContent += `\n# Google Analytics\nVITE_GA_TRACKING_ID=${gaId}\nVITE_ENABLE_ANALYTICS=true\n`;
      log('✓ Google Analytics configured', COLORS.green);
    }
  }

  // Write .env.production
  if (envContent.trim()) {
    writeFileSync(envPath, envContent);
    log('\n✓ Configuration saved to .env.production', COLORS.green);
  }

  // GitHub Secrets reminder
  log('\n📝 Next Steps:', COLORS.yellow);
  log('\n1. Add GitHub Secrets:');
  log('   - Go to: Settings → Secrets and variables → Actions');
  log('   - Add: VITE_SENTRY_DSN (if using Sentry)');
  log('   - Add: VITE_GA_TRACKING_ID (if using GA)');
  log('   - Add: SENTRY_AUTH_TOKEN (for source maps)');

  log('\n2. Install packages:');
  if (useSentry.toLowerCase() === 'y') {
    log('   bun add @sentry/react @sentry/vite-plugin');
  }
  if (analyticsChoice === '2') {
    log('   bun add react-ga4');
  }
  log('   bun add web-vitals');

  log('\n3. Update your code:');
  log('   - See docs/monitoring-analytics.md for integration guide');
  log('   - Initialize Sentry in src/main.tsx');
  log('   - Add analytics script to index.html');

  log('\n4. Deploy:');
  log('   git add .');
  log('   git commit -m "Configure monitoring and analytics"');
  log('   git push origin main');

  log('\n✨ Setup complete!\n', COLORS.green);
  process.exit(0);
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}\n`, COLORS.red);
  process.exit(1);
});
