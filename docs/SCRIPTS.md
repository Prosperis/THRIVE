# Available Scripts

## Current Scripts (Phase 0-1)

These scripts are currently available and working:

```bash
# Development
bun dev              # Start development server (Vite)
bun build            # Build for production
bun preview          # Preview production build

# Code Quality
bun lint             # Run Biome linter
bun format           # Format code with Biome
bun check            # Run linter + formatter with auto-fix
bun type-check       # TypeScript type checking
```

## Future Scripts

These scripts will be added in later phases:

### Phase 9: Testing Setup
```bash
# Unit/Integration Testing (Vitest)
bun test             # Run tests
bun test:ui          # Run tests with UI
bun test:watch       # Run tests in watch mode
bun test:coverage    # Generate coverage report

# E2E Testing (Playwright)
bun test:e2e         # Run E2E tests
bun test:e2e:ui      # Run E2E tests with UI
```

### Phase 10: Storybook
```bash
# Component Documentation
bun storybook        # Start Storybook dev server
bun build-storybook  # Build Storybook for production
```

### Phase 11: CI/CD & Git Hooks
```bash
# Git Hooks (Husky)
bun prepare          # Install Husky git hooks
```

## Quick Reference

### Most Common Commands

```bash
# Start developing
bun dev

# Before committing
bun check            # Auto-fix linting and formatting issues
bun type-check       # Check for TypeScript errors

# Build for production
bun build
```

### Development Workflow

1. **Start dev server**: `bun dev`
2. **Make changes** to your code
3. **Check your code**: `bun check` (auto-fixes issues)
4. **Verify types**: `bun type-check`
5. **Build to test**: `bun build`
6. **Commit your changes**

## Script Details

### `bun dev`
- Starts Vite development server
- Hot Module Replacement (HMR) enabled
- Typically runs on http://localhost:5173

### `bun build`
- Runs TypeScript compiler (`tsc -b`)
- Builds optimized production bundle with Vite
- Output in `dist/` folder

### `bun preview`
- Serves production build locally
- Use to test production build before deployment

### `bun lint`
- Runs Biome linter
- Shows errors and warnings
- Does not auto-fix

### `bun format`
- Formats all files with Biome
- Auto-fixes formatting issues

### `bun check`
- Runs both linter and formatter
- Auto-fixes all fixable issues
- **Recommended before committing**

### `bun type-check`
- Runs TypeScript compiler without emitting files
- Catches type errors
- Faster than full build

## Adding New Scripts

When adding new scripts, update this file and the main README.md.

### Example: Adding a new script

```json
{
  "scripts": {
    "new-script": "command here"
  }
}
```

Then document it here with:
- What it does
- When to use it
- Any prerequisites

---

**Note**: This file will be updated as we progress through the development phases.
