# Install Script for THRIVE Application
# Run this with: bun run scripts/install-dependencies.ps1

Write-Host "🚀 Installing dependencies for THRIVE..." -ForegroundColor Green

# Phase 0 & 1: Core UI Dependencies
Write-Host "`n📦 Installing UI & Styling packages..." -ForegroundColor Cyan
bun add clsx tailwind-merge class-variance-authority
bun add tailwindcss autoprefixer postcss
bun add @radix-ui/react-slot

# Icons
Write-Host "`n🎨 Installing icons..." -ForegroundColor Cyan
bun add lucide-react

# Utilities
Write-Host "`n🔧 Installing utilities..." -ForegroundColor Cyan
bun add date-fns

# Development tools
Write-Host "`n🛠️  Installing development tools..." -ForegroundColor Cyan
bun add -D @types/node

Write-Host "`n✅ Core dependencies installed!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Initialize Tailwind CSS: bunx tailwindcss init -p"
Write-Host "2. Initialize shadcn/ui: bunx shadcn@latest init"
Write-Host "3. Run dev server: bun dev"
