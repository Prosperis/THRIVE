---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Thrive"
  text: "Job Application Tracker"
  tagline: Comprehensive system to manage your job search efficiently and increase your success rate
  image:
    src: /vite.svg
    alt: Thrive
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/quick-start
    - theme: alt
      text: User Guide
      link: /user-guide/overview
    - theme: alt
      text: View on GitHub
      link: https://github.com/adriandarian/thrive

features:
  - icon: 📊
    title: Application Tracking
    details: Track applications through 10 different status types with smart filtering and search capabilities
    link: /user-guide/overview#managing-applications
  
  - icon: 🎯
    title: Kanban Board
    details: Drag-and-drop interface for visual workflow management with real-time status updates
    link: /user-guide/overview#kanban-board
  
  - icon: 💼
    title: Interview Preparation
    details: 100+ interview questions across categories with STAR method framework and practice mode
    link: /user-guide/overview#interview-preparation
  
  - icon: 🏢
    title: Company Research
    details: Store comprehensive company information, culture notes, tech stack, and interview processes
    link: /user-guide/overview#company-research
  
  - icon: 📄
    title: Document Management
    details: Upload resumes, cover letters, portfolios with version control and tagging system
    link: /user-guide/overview#document-management
  
  - icon: 📈
    title: Analytics & Insights
    details: Visual funnel charts, status distribution, response rates, and custom date range filtering
    link: /user-guide/overview#analytics-insights
  
  - icon: 📤
    title: Data Export
    details: Export to CSV, JSON, or PDF with customizable fields and filtered options
    link: /user-guide/overview#data-export
  
  - icon: ♿
    title: Fully Accessible
    details: WCAG 2.1 AA compliant with keyboard navigation, screen reader optimization, and focus management
    link: /testing/accessibility-testing
  
  - icon: 🌐
    title: Cross-Browser Support
    details: Tested across Chrome, Firefox, Safari, and Edge with 400+ compatibility test points
    link: /testing/cross-browser-testing
  
  - icon: 🚀
    title: Production Ready
    details: Deployed on GitHub Pages with CI/CD, error tracking, and performance monitoring
    link: /deployment/github-pages

---

## Quick Links

::: tip Live Application
Try the live app at [adriandarian.github.io/thrive](https://adriandarian.github.io/thrive/)
:::

<div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
  <a href="/getting-started/quick-start" class="feature-card">
    <h3>🚀 Quick Start</h3>
    <p>Get up and running in 5 minutes</p>
  </a>
  
  <a href="/developer-guide/overview" class="feature-card">
    <h3>💻 Developer Guide</h3>
    <p>Technical documentation for developers</p>
  </a>
  
  <a href="/api-reference/complete-api" class="feature-card">
    <h3>📖 API Reference</h3>
    <p>Complete API documentation</p>
  </a>
  
  <a href="/troubleshooting/common-issues" class="feature-card">
    <h3>🔧 Troubleshooting</h3>
    <p>Common issues and solutions</p>
  </a>
</div>

<style>
.feature-card {
  flex: 1;
  min-width: 200px;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.feature-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.feature-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.dark .feature-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>

## Technology Stack

Built with modern technologies for performance and developer experience:

- **Frontend**: React 19, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **State**: Zustand with persistence
- **Routing**: TanStack Router
- **Charts**: Recharts
- **Runtime**: Bun

## Project Status

<div class="project-status">
  <div class="status-badge">
    <span class="status-icon">✅</span>
    <span class="status-text">Production Ready</span>
  </div>
  <div class="status-info">
    <div>Version: <strong>1.0.0</strong></div>
    <div>Last Updated: <strong>January 2025</strong></div>
  </div>
</div>

<style>
.project-status {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-green-soft);
  border-radius: 6px;
}

.status-icon {
  font-size: 1.2rem;
}

.status-text {
  font-weight: 600;
  color: var(--vp-c-green-dark);
}

.dark .status-text {
  color: var(--vp-c-green-light);
}

.status-info {
  display: flex;
  gap: 2rem;
}
</style>
