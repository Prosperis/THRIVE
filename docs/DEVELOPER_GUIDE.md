# Thrive Developer Documentation

## Overview

Thrive is a modern job application tracking system built with React 19, TypeScript, Bun, and Vite. This documentation provides technical details for developers working on or extending Thrive.

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Setup & Installation](#setup--installation)
4. [Architecture](#architecture)
5. [State Management](#state-management)
6. [Routing](#routing)
7. [UI Components](#ui-components)
8. [Data Models](#data-models)
9. [Utilities & Helpers](#utilities--helpers)
10. [Testing](#testing)
11. [Build & Deployment](#build--deployment)
12. [Contributing](#contributing)
13. [API Reference](#api-reference)

---

## Technology Stack

### Core Technologies

- **React 19**: Latest React with concurrent features
- **TypeScript 5.6**: Strict mode enabled
- **Bun 1.x**: JavaScript runtime and package manager
- **Vite 5.x**: Build tool and dev server
- **TanStack Router 1.x**: Type-safe routing

### UI & Styling

- **Tailwind CSS 3.x**: Utility-first CSS framework
- **shadcn/ui**: Accessible component library
- **Radix UI**: Headless UI primitives
- **Lucide Icons**: Icon library

### State & Data

- **Zustand 4.x**: Lightweight state management
- **Zustand Persist**: State persistence middleware
- **Recharts**: Charting library for analytics

### Development Tools

- **Biome**: Linting and formatting
- **TypeScript ESLint**: Additional TypeScript rules
- **Vitest**: Unit testing framework
- **Testing Library**: Component testing utilities

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Project Structure

```
thrive/
├── docs/                          # Documentation
│   ├── USER_GUIDE.md             # User documentation
│   ├── DEVELOPER_GUIDE.md        # This file
│   ├── API_REFERENCE.md          # API documentation
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── accessibility-checklist.md
│   ├── cross-browser-testing-checklist.md
│   └── phase-*.md                # Phase implementation summaries
│
├── public/                        # Static assets
│   └── vite.svg
│
├── src/
│   ├── components/               # React components
│   │   ├── a11y/                # Accessibility components
│   │   │   ├── FocusTrap.tsx
│   │   │   ├── LiveRegion.tsx
│   │   │   ├── SkipNav.tsx
│   │   │   └── VisuallyHidden.tsx
│   │   │
│   │   ├── applications/        # Application management
│   │   │   ├── ApplicationBoard.tsx
│   │   │   ├── ApplicationCard.tsx
│   │   │   ├── ApplicationDetails.tsx
│   │   │   ├── ApplicationFilters.tsx
│   │   │   ├── ApplicationForm.tsx
│   │   │   ├── ApplicationList.tsx
│   │   │   ├── ApplicationSearch.tsx
│   │   │   └── StatusBadge.tsx
│   │   │
│   │   ├── analytics/           # Analytics components
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── ApplicationFunnel.tsx
│   │   │   ├── ApplicationsOverTime.tsx
│   │   │   ├── InterviewSuccessRate.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── ResponseRateByCompany.tsx
│   │   │   └── StatusDistribution.tsx
│   │   │
│   │   ├── companies/           # Company research
│   │   │   ├── CompanyCard.tsx
│   │   │   ├── CompanyDetails.tsx
│   │   │   ├── CompanyForm.tsx
│   │   │   ├── CompanyList.tsx
│   │   │   └── CompanySearch.tsx
│   │   │
│   │   ├── dashboard/           # Dashboard components
│   │   │   ├── ActivityTimeline.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── QuickStats.tsx
│   │   │   ├── RecentApplications.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── UpcomingInterviews.tsx
│   │   │
│   │   ├── documents/           # Document management
│   │   │   ├── DocumentCard.tsx
│   │   │   ├── DocumentList.tsx
│   │   │   ├── DocumentUpload.tsx
│   │   │   └── DocumentViewer.tsx
│   │   │
│   │   ├── export/              # Data export
│   │   │   ├── ExportOptions.tsx
│   │   │   ├── ExportPreview.tsx
│   │   │   └── ExportProgress.tsx
│   │   │
│   │   ├── interviews/          # Interview management
│   │   │   ├── InterviewCalendar.tsx
│   │   │   ├── InterviewCard.tsx
│   │   │   ├── InterviewDetails.tsx
│   │   │   ├── InterviewForm.tsx
│   │   │   └── InterviewList.tsx
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── prep/                # Interview prep
│   │   │   ├── QuestionBank.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── QuestionCategories.tsx
│   │   │   └── QuestionSearch.tsx
│   │   │
│   │   ├── settings/            # Settings
│   │   │   ├── AppearanceSettings.tsx
│   │   │   ├── DataSettings.tsx
│   │   │   ├── NotificationSettings.tsx
│   │   │   └── ProfileSettings.tsx
│   │   │
│   │   └── ui/                  # Shared UI components (shadcn/ui)
│   │       ├── alert.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── empty-state.tsx
│   │       ├── error-state.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── loading-skeletons.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── skeleton.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       └── toast.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useApplications.ts
│   │   ├── useCompanies.ts
│   │   ├── useDocuments.ts
│   │   ├── useInterviews.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useNotifications.ts
│   │   └── useTheme.ts
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── accessibility.ts     # Accessibility helpers
│   │   ├── browser-detection.ts # Browser detection
│   │   ├── constants.ts         # App constants
│   │   ├── export.ts            # Data export utilities
│   │   ├── keyboard.ts          # Keyboard navigation
│   │   ├── responsive-testing.ts # Responsive utilities
│   │   └── utils.ts             # General utilities
│   │
│   ├── routes/                  # Route components
│   │   ├── __root.tsx           # Root layout
│   │   ├── analytics.tsx        # Analytics page
│   │   ├── applications.tsx     # Applications page
│   │   ├── companies.tsx        # Companies page
│   │   ├── dashboard.tsx        # Dashboard page
│   │   ├── documents.tsx        # Documents page
│   │   ├── export.tsx           # Export page
│   │   ├── index.tsx            # Home page
│   │   ├── interviews.tsx       # Interviews page
│   │   ├── prep.tsx             # Interview prep page
│   │   └── settings.tsx         # Settings page
│   │
│   ├── store/                   # Zustand stores
│   │   ├── applicationStore.ts  # Application state
│   │   ├── companyStore.ts      # Company state
│   │   ├── documentStore.ts     # Document state
│   │   ├── interviewStore.ts    # Interview state
│   │   ├── notificationStore.ts # Notification state
│   │   └── settingsStore.ts     # Settings state
│   │
│   ├── styles/                  # Global styles
│   │   ├── browser-fixes.css    # Browser-specific fixes
│   │   └── globals.css          # Global CSS + Tailwind
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── application.ts       # Application types
│   │   ├── company.ts           # Company types
│   │   ├── document.ts          # Document types
│   │   ├── interview.ts         # Interview types
│   │   ├── interviewPrep.ts     # Interview prep types
│   │   └── notification.ts      # Notification types
│   │
│   ├── main.tsx                 # App entry point
│   └── routeTree.gen.ts         # Generated route tree
│
├── .gitignore
├── biome.json                   # Biome configuration
├── components.json              # shadcn/ui configuration
├── index.html
├── package.json
├── postcss.config.js            # PostCSS configuration
├── README.md
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.node.json
└── vite.config.ts               # Vite configuration
```

---

## Setup & Installation

### Prerequisites

- **Bun**: v1.0.0 or higher
- **Node.js**: v18.0.0 or higher (for compatibility)
- **Git**: For version control

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/yourusername/thrive.git
cd thrive

# Install dependencies
bun install

# Start development server
bun run dev

# Open in browser
# Navigate to http://localhost:5173
```

### Available Scripts

```bash
# Development
bun run dev          # Start dev server with hot reload
bun run build        # Build for production
bun run preview      # Preview production build
bun run lint         # Run Biome linter
bun run format       # Format code with Biome
bun run type-check   # TypeScript type checking

# Testing (when implemented)
bun test             # Run unit tests
bun test:watch       # Run tests in watch mode
bun test:coverage    # Generate coverage report
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration (if backend is added)
VITE_API_URL=http://localhost:3000/api

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# Build Configuration
VITE_APP_VERSION=1.0.0
```

---

## Architecture

### Design Principles

1. **Component-Based**: Modular, reusable components
2. **Type-Safe**: Strict TypeScript throughout
3. **Accessible**: WCAG 2.1 AA compliance
4. **Performant**: Code splitting, lazy loading, memoization
5. **Maintainable**: Clear structure, documentation, conventions

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Zustand Store Action
    ↓
State Update
    ↓
Component Re-render
    ↓
LocalStorage Persistence (via middleware)
```

### Folder-by-Feature Structure

Components are organized by feature (applications, interviews, etc.) rather than by type (containers, presentational). This makes it easier to find related code and manage features independently.

### Code Splitting

Routes are automatically code-split by TanStack Router. Additional components can be lazy-loaded:

```typescript
import { lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

---

## State Management

### Zustand Store Pattern

All stores follow a consistent pattern:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
  // State
  items: Item[];
  
  // Actions
  addItem: (item: Item) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      
      // Actions
      addItem: (item) => 
        set((state) => ({ items: [...state.items, item] })),
      
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'store-name',
      version: 1,
    }
  )
);
```

### Available Stores

#### Application Store (`store/applicationStore.ts`)

```typescript
interface ApplicationStore {
  applications: Application[];
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  getApplicationById: (id: string) => Application | undefined;
  getApplicationsByStatus: (status: ApplicationStatus) => Application[];
}
```

#### Interview Store (`store/interviewStore.ts`)

```typescript
interface InterviewStore {
  interviews: Interview[];
  addInterview: (interview: Interview) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  getInterviewsByApplication: (appId: string) => Interview[];
  getUpcomingInterviews: () => Interview[];
}
```

#### Company Store (`store/companyStore.ts`)

```typescript
interface CompanyStore {
  companies: Company[];
  addCompany: (company: Company) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  getCompanyById: (id: string) => Company | undefined;
}
```

### Store Usage in Components

```typescript
function MyComponent() {
  // Select specific state
  const applications = useApplicationStore((state) => state.applications);
  const addApplication = useApplicationStore((state) => state.addApplication);
  
  // Or select multiple
  const { applications, addApplication } = useApplicationStore();
  
  // Derived state (memoized automatically)
  const activeApps = useApplicationStore((state) =>
    state.applications.filter((app) => app.status === 'active')
  );
  
  return (
    <button onClick={() => addApplication(newApp)}>
      Add Application
    </button>
  );
}
```

---

## Routing

### TanStack Router

Thrive uses file-based routing with TanStack Router for type-safe navigation.

### Route Structure

```
routes/
├── __root.tsx           # Root layout (wraps all routes)
├── index.tsx            # / (home/dashboard)
├── applications.tsx     # /applications
├── interviews.tsx       # /interviews
├── companies.tsx        # /companies
├── documents.tsx        # /documents
├── analytics.tsx        # /analytics
├── prep.tsx             # /prep
├── export.tsx           # /export
└── settings.tsx         # /settings
```

### Creating a New Route

1. **Create route file** in `src/routes/`:

```typescript
// src/routes/new-page.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/new-page')({
  component: NewPageComponent,
});

function NewPageComponent() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

2. **Router automatically picks it up** (no manual registration needed)

3. **Navigate to `/new-page`**

### Navigation

```typescript
import { Link, useNavigate } from '@tanstack/react-router';

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <>
      {/* Declarative navigation */}
      <Link to="/applications">Applications</Link>
      
      {/* Programmatic navigation */}
      <button onClick={() => navigate({ to: '/interviews' })}>
        Go to Interviews
      </button>
    </>
  );
}
```

### Route Parameters

```typescript
// Route with parameter
export const Route = createFileRoute('/applications/$appId')({
  component: ApplicationDetailsComponent,
});

function ApplicationDetailsComponent() {
  const { appId } = Route.useParams();
  
  return <div>Application ID: {appId}</div>;
}
```

### Search Params

```typescript
export const Route = createFileRoute('/applications')({
  component: ApplicationsComponent,
  validateSearch: (search) => ({
    status: search.status as string | undefined,
    page: Number(search.page ?? 1),
  }),
});

function ApplicationsComponent() {
  const { status, page } = Route.useSearch();
  
  return <div>Status: {status}, Page: {page}</div>;
}
```

---

## UI Components

### shadcn/ui Components

Thrive uses shadcn/ui components, which are customizable and accessible. Components are copied into `src/components/ui/` for full control.

### Adding a New shadcn Component

```bash
# Add a component
bunx shadcn@latest add button

# Add multiple components
bunx shadcn@latest add card dialog input
```

### Component Patterns

#### Compound Components

```typescript
// Card with subcomponents
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function MyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>Content</CardContent>
    </Card>
  );
}
```

#### Controlled vs Uncontrolled

```typescript
// Controlled
function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

// Uncontrolled (with ref)
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = () => {
    console.log(inputRef.current?.value);
  };
  
  return <Input ref={inputRef} />;
}
```

#### Composition

```typescript
// Compose smaller components
function ApplicationCard({ application }: Props) {
  return (
    <Card>
      <CardHeader>
        <StatusBadge status={application.status} />
        <CardTitle>{application.position}</CardTitle>
      </CardHeader>
      <CardContent>
        <CompanyInfo company={application.company} />
        <DateInfo date={application.appliedDate} />
      </CardContent>
    </Card>
  );
}
```

### Custom Hooks

Create reusable logic with custom hooks:

```typescript
// useApplications.ts
export function useApplications() {
  const applications = useApplicationStore((state) => state.applications);
  const addApplication = useApplicationStore((state) => state.addApplication);
  
  const activeApplications = useMemo(
    () => applications.filter((app) => app.status !== 'rejected'),
    [applications]
  );
  
  return {
    applications,
    activeApplications,
    addApplication,
  };
}

// Usage in component
function MyComponent() {
  const { activeApplications, addApplication } = useApplications();
  
  return <div>{activeApplications.length} active</div>;
}
```

---

## Data Models

### Application

```typescript
interface Application {
  id: string;
  position: string;
  company: string;
  status: ApplicationStatus;
  appliedDate: string;
  location?: string;
  jobType?: 'remote' | 'hybrid' | 'onsite';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  description?: string;
  url?: string;
  notes?: Note[];
  documents?: string[]; // Document IDs
  contacts?: Contact[];
  createdAt: string;
  updatedAt: string;
}

type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'screening'
  | 'phone-interview'
  | 'interview'
  | 'assessment'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';
```

### Interview

```typescript
interface Interview {
  id: string;
  applicationId: string;
  type: InterviewType;
  date: string;
  duration: number; // minutes
  location?: string;
  isRemote: boolean;
  meetingLink?: string;
  interviewers?: Interviewer[];
  notes?: string;
  preparation?: string;
  followUpDate?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

type InterviewType =
  | 'phone-screen'
  | 'video-call'
  | 'onsite'
  | 'technical'
  | 'behavioral'
  | 'panel'
  | 'final';
```

### Company

```typescript
interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  description?: string;
  culture?: string;
  benefits?: string[];
  techStack?: string[];
  interviewProcess?: string;
  notes?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Document

```typescript
interface Document {
  id: string;
  name: string;
  type: DocumentType;
  fileType: string;
  size: number;
  url: string;
  applicationIds?: string[];
  tags?: string[];
  version: number;
  uploadedAt: string;
  updatedAt: string;
}

type DocumentType =
  | 'resume'
  | 'cover-letter'
  | 'portfolio'
  | 'certification'
  | 'reference'
  | 'other';
```

---

## Utilities & Helpers

### General Utilities (`lib/utils.ts`)

```typescript
// Class name utility (for Tailwind)
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}

// ID generation
export function generateId(): string {
  return crypto.randomUUID();
}

// Debounce
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

### Accessibility Utilities (`lib/accessibility.ts`)

```typescript
// Screen reader announcements
export function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
}

// Generate accessible labels
export function getStatusAriaLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    wishlist: 'On wishlist',
    applied: 'Application submitted',
    screening: 'In screening process',
    // ... etc
  };
  return labels[status];
}
```

### Export Utilities (`lib/export.ts`)

```typescript
// Export to CSV
export function exportToCSV(data: Application[]): void {
  const csv = convertToCSV(data);
  downloadFile(csv, 'applications.csv', 'text/csv');
}

// Export to JSON
export function exportToJSON(data: any): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, 'applications.json', 'application/json');
}

// Export to PDF
export function exportToPDF(data: Application[]): Promise<void> {
  // PDF generation logic
}
```

### Browser Detection (`lib/browser-detection.ts`)

```typescript
// Detect browser
export function detectBrowser(): BrowserInfo {
  // Returns browser name, version, OS, device type
}

// Check if browser is supported
export function isBrowserSupported(): boolean {
  const browser = detectBrowser();
  const minVersions = {
    chrome: 90,
    firefox: 88,
    safari: 14,
    edge: 90,
  };
  return browser.majorVersion >= minVersions[browser.name];
}
```

---

## Testing

### Testing Setup

```bash
# Install testing dependencies (if not already installed)
bun add -d vitest @testing-library/react @testing-library/jest-dom
bun add -d @testing-library/user-event happy-dom
```

### Unit Testing

```typescript
// ApplicationCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ApplicationCard } from './ApplicationCard';

describe('ApplicationCard', () => {
  const mockApplication = {
    id: '1',
    position: 'Software Engineer',
    company: 'Test Company',
    status: 'applied',
    appliedDate: '2025-10-01',
  };
  
  it('renders application details', () => {
    render(<ApplicationCard application={mockApplication} />);
    
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });
  
  it('shows correct status badge', () => {
    render(<ApplicationCard application={mockApplication} />);
    
    expect(screen.getByText('Applied')).toBeInTheDocument();
  });
});
```

### Integration Testing

```typescript
// ApplicationList.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApplicationList } from './ApplicationList';

describe('ApplicationList', () => {
  it('filters applications by status', async () => {
    const user = userEvent.setup();
    render(<ApplicationList />);
    
    const filterButton = screen.getByRole('button', { name: /filter/i });
    await user.click(filterButton);
    
    const appliedFilter = screen.getByRole('checkbox', { name: /applied/i });
    await user.click(appliedFilter);
    
    // Assert filtered results
  });
});
```

### Store Testing

```typescript
// applicationStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useApplicationStore } from './applicationStore';

describe('Application Store', () => {
  it('adds an application', () => {
    const { result } = renderHook(() => useApplicationStore());
    
    const newApp = {
      id: '1',
      position: 'Developer',
      company: 'Test Corp',
      status: 'applied',
      appliedDate: '2025-10-01',
    };
    
    act(() => {
      result.current.addApplication(newApp);
    });
    
    expect(result.current.applications).toHaveLength(1);
    expect(result.current.applications[0]).toEqual(newApp);
  });
});
```

---

## Build & Deployment

### Production Build

```bash
# Build for production
bun run build

# Preview production build locally
bun run preview
```

### Build Output

```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other chunks]
├── index.html
└── vite.svg
```

### Build Optimization

**Automatic Optimizations**:
- Code splitting by route
- Tree shaking
- Minification
- Asset optimization
- CSS purging (unused Tailwind classes)

**Manual Optimizations**:
- Lazy load heavy components
- Use React.memo for expensive renders
- Implement virtualization for long lists
- Optimize images (WebP format)

### Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy to Vercel**:

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel
```

---

## Contributing

### Code Style

- **TypeScript**: Strict mode, explicit types
- **Formatting**: Biome (runs on commit)
- **Naming**: camelCase for variables, PascalCase for components
- **Files**: kebab-case for files, PascalCase for components

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/my-feature
```

### Commit Messages

Follow Conventional Commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Build process or auxiliary tools

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Update documentation
5. Run `bun run lint` and `bun run type-check`
6. Create PR with clear description
7. Wait for review and approval

---

## API Reference

See [API_REFERENCE.md](./API_REFERENCE.md) for detailed API documentation of all components, hooks, stores, and utilities.

---

## Performance Tips

### Optimization Strategies

1. **Memoization**:
```typescript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

2. **Callback Memoization**:
```typescript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

3. **Component Memoization**:
```typescript
const MemoizedComponent = React.memo(MyComponent);
```

4. **Virtualization** (for long lists):
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
```

5. **Code Splitting**:
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Performance Monitoring

Use React DevTools Profiler to identify performance bottlenecks:

1. Open React DevTools
2. Go to Profiler tab
3. Start recording
4. Perform actions
5. Stop recording
6. Analyze render times

---

## Troubleshooting

### Common Issues

**Build fails with TypeScript errors**:
- Run `bun run type-check` to see errors
- Fix type errors before building

**Hot reload not working**:
- Check Vite config
- Restart dev server
- Clear `.vite` cache

**Store not persisting**:
- Check localStorage is enabled
- Check store configuration
- Verify persist middleware setup

**Route not found**:
- Ensure route file is in `src/routes/`
- Check route file naming
- Restart dev server

---

## Resources

### Documentation

- [React 19 Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [TanStack Router](https://tanstack.com/router)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Tools

- [Bun](https://bun.sh/)
- [Vite](https://vitejs.dev/)
- [Biome](https://biomejs.dev/)

---

*Last Updated: October 18, 2025*
*Version: 1.0.0*
