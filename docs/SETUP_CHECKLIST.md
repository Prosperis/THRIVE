# Phase 0 Setup Checklist

## ✅ Completed

- [x] Initialize Vite + React + TypeScript project
- [x] Install and configure Bun
- [x] Install and configure Biome for linting/formatting
- [x] Configure TypeScript with strict mode
- [x] Setup path aliases (@/ imports)
- [x] Create folder structure
- [x] Define TypeScript types for core entities
- [x] Update README with project info
- [x] Create PROJECT_PLAN.md with phased approach

## 🚧 In Progress

- [ ] Install core dependencies
- [ ] Configure git hooks with Husky
- [ ] Create environment configuration
- [ ] Setup basic App component
- [ ] Test dev server

## 📋 To Do

### Core Dependencies to Install

```bash
# UI & Styling (Phase 1)
bun add tailwindcss autoprefixer postcss
bun add class-variance-authority clsx tailwind-merge
bun add @radix-ui/react-slot

# State Management (Phase 3)
bun add zustand
bun add @tanstack/react-query
bun add zod

# Routing (Phase 2)
bun add @tanstack/react-router
bun add -D @tanstack/router-plugin @tanstack/router-devtools

# Forms (Phase 5)
bun add @tanstack/react-form

# Tables (Phase 4)
bun add @tanstack/react-table

# Virtual Scrolling (Phase 7)
bun add @tanstack/react-virtual

# Animations (Phase 8)
bun add framer-motion

# Drag & Drop (Phase 8)
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Testing (Phase 9)
bun add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
bun add -D @playwright/test

# Storybook (Phase 10)
# Will be installed via storybook init

# Git Hooks (Phase 11)
bun add -D husky lint-staged

# Date utilities
bun add date-fns

# Icons
bun add lucide-react
```

## 🔧 Configuration Files to Create

- [ ] `.env.example` - Environment variables template
- [ ] `.env` - Local environment (git-ignored)
- [ ] `tailwind.config.js` - Tailwind configuration
- [ ] `postcss.config.js` - PostCSS configuration
- [ ] `components.json` - shadcn/ui configuration
- [ ] `.husky/pre-commit` - Git pre-commit hook
- [ ] `vitest.config.ts` - Vitest configuration
- [ ] `playwright.config.ts` - Playwright configuration

## 📝 Initial Components to Create

- [ ] `src/lib/utils.ts` - Utility functions (cn helper)
- [ ] `src/App.tsx` - Main App component
- [ ] `src/main.tsx` - Entry point
- [ ] `src/index.css` - Global styles with Tailwind

## 🎯 Phase 0 Goals

By the end of Phase 0, we should have:
1. ✅ A running React dev server
2. ✅ TypeScript configured with strict mode
3. ✅ Biome linting and formatting working
4. ✅ Project structure established
5. ✅ Type definitions for core entities
6. 🚧 All tooling configured and ready
7. 🚧 Basic app shell rendering

## Next Steps (Phase 1)

Once Phase 0 is complete, move to Phase 1:
- Install and configure Tailwind CSS
- Initialize shadcn/ui
- Create base layout components
- Implement design system
- Setup dark mode

---

**Status**: In Progress
**Started**: October 17, 2025
**Target Completion**: TBD
