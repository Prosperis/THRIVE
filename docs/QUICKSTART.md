# 🚀 Quick Start Guide - THRIVE Development

## You Are Here: Phase 0 Complete ✅

The project foundation is set up! Here's what to do next:

---

## ⚡ Immediate Next Steps (Phase 1)

### Step 1: Install Tailwind CSS (2 minutes)

```bash
# Initialize Tailwind
bunx tailwindcss init -p

# This creates:
# - tailwind.config.js
# - postcss.config.js
```

Then update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 2: Initialize shadcn/ui (3 minutes)

```bash
# Initialize shadcn/ui (interactive setup)
bunx shadcn@latest init

# Answer the prompts:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - Use src directory: Yes
# - React Server Components: No
# - Write to tailwind.config: Yes
# - Import alias: @/*
```

### Step 3: Install Essential Components (2 minutes)

```bash
# UI primitives
bunx shadcn@latest add button
bunx shadcn@latest add card
bunx shadcn@latest add badge
bunx shadcn@latest add input
bunx shadcn@latest add label
bunx shadcn@latest add select
bunx shadcn@latest add table
bunx shadcn@latest add dialog
bunx shadcn@latest add dropdown-menu
bunx shadcn@latest add form
bunx shadcn@latest add separator
bunx shadcn@latest add avatar
bunx shadcn@latest add tooltip
```

### Step 4: Create Basic App Shell (10 minutes)

Create `src/App.tsx`:

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">THRIVE</h1>
          <p className="text-sm text-muted-foreground">
            Target, Hunt, Reach, Interview, Validate, Employ
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to THRIVE</h2>
          <p className="text-muted-foreground mb-4">
            Your job application tracking system is ready to build!
          </p>
          <Button onClick={() => setCount(count + 1)}>
            Clicked {count} times
          </Button>
        </Card>
      </main>
    </div>
  );
}

export default App;
```

### Step 5: Test the App (1 minute)

```bash
# Start dev server
bun dev

# Open http://localhost:5173
# You should see the app with Tailwind styling!
```

---

## 📚 What's Already Set Up

✅ **Project Structure** - Organized folders for scalability
✅ **TypeScript** - Strict mode with path aliases
✅ **Biome** - Fast linting and formatting
✅ **Type Definitions** - All core entities defined
✅ **Utilities** - Helper functions ready to use
✅ **Constants** - App-wide constants configured

---

## 🎯 Development Workflow

### Daily Development

```bash
# 1. Start dev server
bun dev

# 2. Run checks (in another terminal)
bun check

# 3. Before committing
bun format
bun type-check
```

### Adding New Features

1. **Define types** in `src/types/`
2. **Create components** in `src/components/` or `src/features/`
3. **Add utilities** in `src/lib/utils/`
4. **Update constants** in `src/lib/constants.ts` if needed

---

## 📋 Phase-by-Phase Checklist

### Phase 1: Core UI Foundation (Current)
- [ ] Install Tailwind CSS
- [ ] Initialize shadcn/ui
- [ ] Install core components
- [ ] Create layout components
- [ ] Setup dark mode
- [ ] Create app shell

### Phase 2: Routing & Navigation (Next)
- [ ] Install TanStack Router
- [ ] Define routes
- [ ] Create route components
- [ ] Add navigation menu
- [ ] Implement breadcrumbs

### Phase 3: State Management (Then)
- [ ] Install Zustand
- [ ] Install TanStack Query
- [ ] Install Zod
- [ ] Create stores
- [ ] Setup query client
- [ ] Create mock data

---

## 🔑 Key Commands Reference

```bash
# Development
bun dev              # Start dev server
bun build            # Build for production
bun preview          # Preview production build

# Code Quality
bun lint             # Run Biome linter
bun format           # Format code with Biome
bun check            # Run linter with auto-fix
bun type-check       # TypeScript type checking

# Package Management
bun add <package>    # Add dependency
bun add -D <package> # Add dev dependency
bun remove <package> # Remove dependency
```

**Note**: Testing, Storybook, and Husky scripts will be added in later phases (9, 10, 11).
See [SCRIPTS.md](./SCRIPTS.md) for complete script documentation.

---

## 📖 Documentation Reference

- **Full Plan**: See `PROJECT_PLAN.md`
- **Scripts**: See `SCRIPTS.md` (available commands)
- **Setup Details**: See `SETUP_CHECKLIST.md`
- **Progress**: See `DEV_SUMMARY.md`
- **Types**: See `src/types/index.ts`

---

## 💡 Tips

1. **Use path aliases**: Import with `@/` instead of relative paths
2. **Check types**: Run `bun type-check` frequently
3. **Format often**: Run `bun format` before committing
4. **Read the plan**: Reference `PROJECT_PLAN.md` for feature details
5. **Follow the phases**: Don't skip ahead, build incrementally

---

## 🆘 Common Issues

### Import errors with @/ paths
- Make sure `tsconfig.app.json` has path aliases
- Restart TypeScript server in VS Code

### Biome not working
- Check `biome.json` exists
- Run `bun check` to see errors

### Dev server issues
- Clear `node_modules` and reinstall: `bun install`
- Check port 5173 isn't in use

---

## 🎨 Design System (Coming in Phase 1)

Colors will follow THRIVE stages:
- **Target**: Gray (scouting)
- **Hunting**: Blue (active research)
- **Applied**: Yellow (waiting)
- **Interviewing**: Purple (in process)
- **Offer**: Green (success)
- **Accepted**: Emerald (employed!)
- **Rejected**: Red
- **Withdrawn**: Slate

---

## 🚀 Ready to Code!

Start with Phase 1:
1. Run the Tailwind setup above
2. Initialize shadcn/ui
3. Create the app shell
4. Build your first component!

**Good luck building THRIVE! 🎯**
