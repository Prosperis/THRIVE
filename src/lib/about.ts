export const CHANGELOG = [
  {
    version: '1.0.0',
    date: '2025-01-18',
    changes: [
      {
        type: 'feature' as const,
        description: 'Initial release of Thrive job application tracker',
      },
      {
        type: 'feature' as const,
        description: 'Complete application management with status tracking',
      },
      {
        type: 'feature' as const,
        description: 'Interview scheduling and management system',
      },
      {
        type: 'feature' as const,
        description: 'Document storage and organization',
      },
      {
        type: 'feature' as const,
        description: 'Analytics dashboard with visualizations',
      },
      {
        type: 'feature' as const,
        description: 'Kanban board for visual status management',
      },
      {
        type: 'feature' as const,
        description: 'CSV and JSON import/export functionality',
      },
      {
        type: 'feature' as const,
        description: 'Automatic backup system with scheduling',
      },
      {
        type: 'feature' as const,
        description: 'Comprehensive settings and customization options',
      },
      {
        type: 'feature' as const,
        description: 'Dark mode support with system theme detection',
      },
      {
        type: 'feature' as const,
        description: 'Multi-language support (EN, ES, FR, DE)',
      },
      {
        type: 'feature' as const,
        description: 'Smooth animations and transitions',
      },
      {
        type: 'feature' as const,
        description: 'Offline-first architecture with IndexedDB',
      },
    ],
  },
];

export const KEYBOARD_SHORTCUTS = [
  {
    category: 'Navigation',
    shortcuts: [
      { keys: ['Ctrl', 'K'], description: 'Quick search' },
      { keys: ['Alt', '1'], description: 'Go to Dashboard' },
      { keys: ['Alt', '2'], description: 'Go to Applications' },
      { keys: ['Alt', '3'], description: 'Go to Interviews' },
      { keys: ['Alt', '4'], description: 'Go to Documents' },
      { keys: ['Alt', '5'], description: 'Go to Analytics' },
      { keys: ['Alt', 'S'], description: 'Go to Settings' },
    ],
  },
  {
    category: 'Applications',
    shortcuts: [
      { keys: ['N'], description: 'New application' },
      { keys: ['E'], description: 'Edit selected' },
      { keys: ['Del'], description: 'Delete selected' },
      { keys: ['Ctrl', 'A'], description: 'Select all' },
      { keys: ['Escape'], description: 'Clear selection' },
      { keys: ['Ctrl', 'F'], description: 'Focus search' },
    ],
  },
  {
    category: 'Data Management',
    shortcuts: [
      { keys: ['Ctrl', 'I'], description: 'Import data' },
      { keys: ['Ctrl', 'E'], description: 'Export data' },
      { keys: ['Ctrl', 'B'], description: 'Create backup' },
      { keys: ['Ctrl', 'S'], description: 'Save (auto-save enabled)' },
    ],
  },
  {
    category: 'Views',
    shortcuts: [
      { keys: ['V', 'T'], description: 'Switch to table view' },
      { keys: ['V', 'K'], description: 'Switch to kanban view' },
      { keys: ['Ctrl', '+'], description: 'Zoom in' },
      { keys: ['Ctrl', '-'], description: 'Zoom out' },
      { keys: ['Ctrl', '0'], description: 'Reset zoom' },
    ],
  },
  {
    category: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Ctrl', ','], description: 'Open settings' },
      { keys: ['Ctrl', 'T'], description: 'Toggle theme' },
      { keys: ['Ctrl', 'R'], description: 'Refresh data' },
    ],
  },
];

export const HELP_RESOURCES = [
  {
    title: 'Getting Started',
    icon: 'BookOpen',
    description: 'Learn the basics of using Thrive to track your job applications',
    link: '#',
  },
  {
    title: 'User Guide',
    icon: 'Book',
    description: 'Comprehensive guide covering all features and functionality',
    link: '#',
  },
  {
    title: 'Video Tutorials',
    icon: 'Video',
    description: 'Watch step-by-step video tutorials',
    link: '#',
  },
  {
    title: 'FAQ',
    icon: 'HelpCircle',
    description: 'Frequently asked questions and answers',
    link: '#',
  },
  {
    title: 'Report a Bug',
    icon: 'Bug',
    description: 'Found an issue? Let us know',
    link: 'https://github.com/adriandarian/thrive/issues',
  },
  {
    title: 'Feature Requests',
    icon: 'Lightbulb',
    description: 'Suggest new features or improvements',
    link: 'https://github.com/adriandarian/thrive/discussions',
  },
];

export const CREDITS = [
  {
    category: 'Libraries & Frameworks',
    items: [
      { name: 'React', description: 'UI Framework', url: 'https://react.dev' },
      { name: 'TypeScript', description: 'Type-safe JavaScript', url: 'https://typescriptlang.org' },
      { name: 'Vite', description: 'Build tool', url: 'https://vitejs.dev' },
      { name: 'TanStack Router', description: 'Type-safe routing', url: 'https://tanstack.com/router' },
      { name: 'TanStack Table', description: 'Headless table library', url: 'https://tanstack.com/table' },
      { name: 'Zustand', description: 'State management', url: 'https://zustand-demo.pmnd.rs' },
      { name: 'Dexie.js', description: 'IndexedDB wrapper', url: 'https://dexie.org' },
      { name: 'Framer Motion', description: 'Animation library', url: 'https://framer.com/motion' },
    ],
  },
  {
    category: 'UI Components',
    items: [
      { name: 'Radix UI', description: 'Accessible components', url: 'https://radix-ui.com' },
      { name: 'Shadcn/ui', description: 'Component collection', url: 'https://ui.shadcn.com' },
      { name: 'Lucide Icons', description: 'Icon library', url: 'https://lucide.dev' },
      { name: 'Sonner', description: 'Toast notifications', url: 'https://sonner.emilkowal.ski' },
      { name: 'Recharts', description: 'Charting library', url: 'https://recharts.org' },
    ],
  },
  {
    category: 'Development Tools',
    items: [
      { name: 'Bun', description: 'JavaScript runtime', url: 'https://bun.sh' },
      { name: 'Biome', description: 'Linter and formatter', url: 'https://biomejs.dev' },
      { name: '@dnd-kit', description: 'Drag and drop', url: 'https://dndkit.com' },
    ],
  },
];
