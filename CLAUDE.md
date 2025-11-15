# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

THRIVE is a comprehensive job application tracking system (Target, Hunt, Reach, Interview, Validate, Employ) built as a client-side single-page application. It manages the entire job search journey from application to offer with features including application tracking, interview preparation, company research, document management, and analytics.

**Live Demo**: https://adriandarian.github.io/thrive/

## Development Commands

### Essential Commands
```bash
# Install dependencies
bun install

# Start development server (http://localhost:5173)
bun dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type checking
bun run type-check

# Linting
bun run lint

# Format code
bun run format

# Fix linting + formatting issues
bun run check
```

### Deployment
```bash
# Deploy to GitHub Pages
bun run deploy

# Automatic deployment happens via GitHub Actions on push to main
```

## Architecture

### Tech Stack Core
- **Runtime**: Bun (package manager and runtime)
- **Framework**: React 19 with TypeScript 5.6
- **Build Tool**: Vite 7
- **Database**: Dexie (IndexedDB wrapper) for client-side storage
- **Routing**: TanStack Router (type-safe, file-based routing)
- **State Management**: Zustand (global state) + TanStack Query (server/async state)
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Linting/Formatting**: Biome (replaces ESLint + Prettier)

### Key Libraries
- **UI Components**: Radix UI primitives + shadcn/ui
- **Tables**: TanStack Table with virtual scrolling (TanStack Virtual)
- **Forms**: TanStack Form + Zod validation
- **Animations**: Framer Motion
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Drag & Drop**: dnd-kit

### Directory Structure
```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components (auto-generated, be careful editing)
│   └── layout/      # Layout components (header, nav, etc.)
├── routes/          # TanStack Router route files
│   ├── __root.tsx   # Root layout
│   ├── index.tsx    # Landing/dashboard
│   ├── applications.tsx
│   ├── interviews.tsx
│   ├── documents.tsx
│   ├── analytics.tsx
│   └── settings.tsx
├── stores/          # Zustand state stores (one per feature)
│   ├── applicationsStore.ts
│   ├── interviewsStore.ts
│   ├── documentsStore.ts
│   ├── uiStore.ts
│   └── settingsStore.ts
├── lib/             # Core utilities and database
│   ├── db.ts        # Dexie database schema and instance
│   └── utils.ts     # Helper functions
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── assets/          # Static assets
```

### Data Flow Architecture

**Client-Side Database (Dexie/IndexedDB)**:
- All data stored locally in the browser
- No backend server - fully offline-capable
- Schema defined in `src/lib/db.ts` with 5 tables:
  - `applications`: Job applications with status tracking
  - `interviews`: Interview schedules linked to applications
  - `documents`: Resumes, cover letters, portfolios
  - `companies`: Company research and profiles
  - `contacts`: Recruiter/hiring manager contacts

**State Management Pattern**:
1. **Zustand stores** (`src/stores/*`) manage app state and business logic
2. Each store typically handles:
   - CRUD operations for a domain (applications, interviews, etc.)
   - Optimistic updates to Dexie database
   - Derived state and computed values
3. **TanStack Query** is NOT heavily used since there's no backend
4. Components read from stores via hooks like `useApplicationsStore()`

### Routing Pattern

Uses TanStack Router file-based routing:
- Route files in `src/routes/` define both route and component
- Type-safe routing with generated route tree (`routeTree.gen.ts` - auto-generated, don't edit)
- Base path set to `/THRIVE/` for GitHub Pages deployment (see `vite.config.ts`)

### Styling Patterns

- **Tailwind CSS 4** with custom configuration
- **shadcn/ui components** in `src/components/ui/` (installed via CLI, treat as generated code)
- Dark mode support via `dark:` Tailwind variant
- Responsive design using Tailwind breakpoints (`sm:`, `md:`, `lg:`, etc.)
- Custom theme colors defined in `tailwind.config.js` (if exists) or `src/index.css`

## Important Patterns & Conventions

### Database Operations
Always use Dexie through the centralized `db` instance from `src/lib/db.ts`:
```typescript
import { db } from '@/lib/db';

// Add
await db.applications.add(newApplication);

// Update
await db.applications.update(id, updates);

// Query with indexes
await db.applications.where('status').equals('Applied').toArray();
```

### Store Pattern
Zustand stores follow a consistent pattern:
```typescript
export const useExampleStore = create<ExampleStore>((set, get) => ({
  items: [],

  // Actions that mutate state AND sync to Dexie
  addItem: async (item) => {
    await db.items.add(item);
    set({ items: [...get().items, item] });
  },

  // Initialize from database
  initialize: async () => {
    const items = await db.items.toArray();
    set({ items });
  },
}));
```

### Code Style (Biome)
- Single quotes for strings, double quotes for JSX
- Semicolons required
- 2-space indentation
- 100 character line width
- Import type enforcement (use `import type { ... }`)
- Run `bun run check` to auto-fix most issues

### Path Aliases
Use path aliases defined in `vite.config.ts`:
```typescript
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { useApplicationsStore } from '@/stores';
```

## GitHub Pages Deployment

- Base path is `/THRIVE/` (uppercase, see `vite.config.ts`)
- Deployed via GitHub Actions on push to `main` (see `.github/workflows/deploy.yml`)
- Manual deployment: `bun run deploy`
- Build output goes to `dist/`

## Testing Approach

- No test files are currently configured
- When adding tests, use Vitest (referenced in docs but not set up)
- Playwright for E2E tests (also referenced but not implemented)

## Common Gotchas

1. **Auto-generated files**: Never manually edit:
   - `src/routeTree.gen.ts` (TanStack Router)
   - `src/components/ui/*` components (shadcn - regenerate via CLI instead)

2. **Base path**: All routing must account for `/THRIVE/` base path when deployed to GitHub Pages

3. **Dexie schema**: Changing the schema requires incrementing version and writing migration:
   ```typescript
   db.version(2).stores({
     applications: '++id, companyId, ..., newField'
   });
   ```

4. **Import from index**: Many stores export from `src/stores/index.ts`, use that barrel export

5. **Biome vs ESLint**: This project uses Biome, not ESLint. Don't add ESLint config.

## Key Files to Understand

- **`src/lib/db.ts`**: Database schema - understand the data model here first
- **`vite.config.ts`**: Build config, base path, aliases, chunk optimization
- **`src/routes/__root.tsx`**: Root layout, global providers, theme setup
- **`biome.json`**: Linting and formatting rules
- **`src/stores/applicationsStore.ts`**: Example of the store pattern (most complex feature)

## Adding New Features

1. **New route**: Create file in `src/routes/` (e.g., `newfeature.tsx`), router auto-detects
2. **New data entity**: Add table to `src/lib/db.ts` and create corresponding store in `src/stores/`
3. **New UI component**: Use shadcn CLI (`bunx shadcn-ui@latest add <component>`) for base components
4. **New type**: Add to `src/types/` or colocate with feature

## Performance Considerations

- Virtual scrolling is used for large tables (TanStack Virtual)
- Manual chunk splitting in `vite.config.ts` separates React, TanStack, and UI vendors
- IndexedDB queries should use indexes defined in schema
- Lazy load heavy components with `React.lazy()` if needed
