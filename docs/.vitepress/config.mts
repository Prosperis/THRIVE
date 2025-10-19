import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: 'Thrive Documentation',
    description: 'Comprehensive job application tracking system',
    base: '/thrive/docs/',
    
    head: [
      ['link', { rel: 'icon', href: '/thrive/vite.svg' }],
      ['meta', { name: 'theme-color', content: '#3b82f6' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:locale', content: 'en' }],
      ['meta', { property: 'og:title', content: 'Thrive Documentation' }],
      ['meta', { property: 'og:site_name', content: 'Thrive' }],
      ['meta', { property: 'og:url', content: 'https://adriandarian.github.io/thrive/docs/' }],
    ],

    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: '/vite.svg',
      
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/getting-started/quick-start' },
        { text: 'API', link: '/api-reference/complete-api' },
        { 
          text: 'v1.0.0',
          items: [
            { text: 'Changelog', link: '/development-history/progress' },
            { text: 'Live App', link: 'https://adriandarian.github.io/thrive/' }
          ]
        }
      ],

      sidebar: {
        '/getting-started/': [
          {
            text: 'Getting Started',
            items: [
              { text: 'Quick Start', link: '/getting-started/quick-start' },
              { text: 'Setup Checklist', link: '/getting-started/setup-checklist' }
            ]
          }
        ],
        '/user-guide/': [
          {
            text: 'User Guide',
            items: [
              { text: 'Overview', link: '/user-guide/overview' }
            ]
          }
        ],
        '/developer-guide/': [
          {
            text: 'Developer Guide',
            items: [
              { text: 'Overview', link: '/developer-guide/overview' },
              { text: 'Scripts Reference', link: '/developer-guide/scripts' }
            ]
          }
        ],
        '/api-reference/': [
          {
            text: 'API Reference',
            items: [
              { text: 'Complete API', link: '/api-reference/complete-api' }
            ]
          }
        ],
        '/deployment/': [
          {
            text: 'Deployment',
            items: [
              { text: 'GitHub Pages', link: '/deployment/github-pages' },
              { text: 'Deployment Checklist', link: '/deployment/deployment-checklist' },
              { text: 'Monitoring & Analytics', link: '/deployment/monitoring-and-analytics' }
            ]
          }
        ],
        '/testing/': [
          {
            text: 'Testing',
            items: [
              { text: 'Accessibility Testing', link: '/testing/accessibility-testing' },
              { text: 'Cross-Browser Testing', link: '/testing/cross-browser-testing' }
            ]
          }
        ],
        '/troubleshooting/': [
          {
            text: 'Troubleshooting',
            items: [
              { text: 'Common Issues', link: '/troubleshooting/common-issues' }
            ]
          }
        ],
        '/development-history/': [
          {
            text: 'Development History',
            items: [
              { text: 'Project Completion', link: '/development-history/project-completion' },
              { text: 'Phase Summaries', link: '/development-history/phase-summaries' },
              { text: 'Project Plan', link: '/development-history/project-plan' },
              { text: 'Progress', link: '/development-history/progress' }
            ]
          }
        ]
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/adriandarian/thrive' }
      ],

      search: {
        provider: 'local'
      },

      editLink: {
        pattern: 'https://github.com/adriandarian/thrive/edit/main/docs/:path',
        text: 'Edit this page on GitHub'
      },

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2025 Adrian Darian'
      }
    },

    // Mermaid config
    mermaid: {
      // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
    },

    markdown: {
      theme: {
        light: 'github-light',
        dark: 'github-dark'
      },
      lineNumbers: true
    },

    ignoreDeadLinks: true
  })
)
