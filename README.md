# THRIVE - Job Application Tracker

**Target, Hunt, Reach, Interview, Validate, Employ**

A comprehensive job application tracking system to manage your entire job search journey from targeting companies to employment.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Run linting and formatting
bun check

# Run tests
bun test
```

## 📋 Project Status

Currently in **Phase 0: Project Setup & Configuration**

See [docs/PROJECT_PLAN.md](./docs/PROJECT_PLAN.md) for detailed development roadmap.

## 📚 Documentation

- **[Quick Start Guide](./docs/QUICKSTART.md)** - Get started immediately
- **[Project Plan](./docs/PROJECT_PLAN.md)** - Full 13-phase roadmap
- **[Development Summary](./docs/DEV_SUMMARY.md)** - Current progress & status
- **[Setup Checklist](./docs/SETUP_CHECKLIST.md)** - Phase 0 completion tracking

See [docs/](./docs/) for all documentation.

## 🎯 Features (Planned)

- 📊 **Application Dashboard**: Track all applications with status, dates, and details
- 📝 **Document Management**: Store and version resumes, CVs, cover letters
- 🎯 **Company Tracking**: Research notes, contacts, interview details
- 📅 **Timeline View**: Visual representation of application journey
- 🔔 **Reminders**: Follow-ups, interviews, deadlines
- 📈 **Analytics**: Application success rates, response times, insights

## 🛠️ Tech Stack

### Core
- **React 19** with **TypeScript**
- **Bun** - Runtime and package manager
- **Vite** - Build tool

### UI & Styling
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Re-usable component library
- **Radix UI** - Accessible primitives
- **Framer Motion** - Animations

### State & Data
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state
- **TanStack Form** - Form management
- **TanStack Table** - Headless tables
- **TanStack Virtual** - Virtual scrolling
- **Zustand** - Client state
- **Zod** - Schema validation

### Developer Tools
- **Biome** - Linter & formatter
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Storybook** - Component docs
- **Husky** - Git hooks

## 📁 Project Structure

```
thrive/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # shadcn components
│   │   └── layout/      # Layout components
│   ├── features/        # Feature-based modules
│   │   ├── applications/
│   │   ├── documents/
│   │   └── dashboard/
│   ├── lib/             # Utilities and helpers
│   ├── hooks/           # Custom React hooks
│   ├── stores/          # Zustand stores
│   ├── types/           # TypeScript types
│   ├── routes/          # Route components
│   └── assets/          # Static assets
├── public/              # Public assets
└── tests/               # Test files
```

## 📝 Development Phases

1. ✅ **Phase 0**: Project Setup & Configuration
2. **Phase 1**: Core UI Foundation (Tailwind, shadcn)
3. **Phase 2**: Routing & Navigation
4. **Phase 3**: State Management & Data Layer
5. **Phase 4**: Applications Dashboard
6. **Phase 5**: Application Forms
7. **Phase 6**: Documents Management
8. **Phase 7**: Virtual Scrolling & Performance
9. **Phase 8**: Animations & UX Polish
10. **Phase 9**: Testing Setup
11. **Phase 10**: Storybook & Component Library
12. **Phase 11**: CI/CD & Quality Gates
13. **Phase 12**: Advanced Features

See [PROJECT_PLAN.md](./docs/PROJECT_PLAN.md) for detailed breakdown.

## 🤝 Contributing

This is a personal project, but suggestions and ideas are welcome!

## 📄 License

MIT
