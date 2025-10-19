# Thrive API Reference

Complete API reference for all components, hooks, stores, and utilities in Thrive.

## Table of Contents

1. [Stores](#stores)
2. [Hooks](#hooks)
3. [Components](#components)
4. [Utilities](#utilities)
5. [Types](#types)

---

## Stores

### Application Store

```typescript
import { useApplicationStore } from '@/store/applicationStore';
```

#### State

```typescript
interface ApplicationStore {
  applications: Application[];
}
```

#### Actions

##### `addApplication(application: Application): void`

Add a new application to the store.

```typescript
const addApplication = useApplicationStore((state) => state.addApplication);
addApplication({
  id: '1',
  position: 'Software Engineer',
  company: 'Tech Corp',
  status: 'applied',
  appliedDate: '2025-10-01',
});
```

##### `updateApplication(id: string, updates: Partial<Application>): void`

Update an existing application.

```typescript
const updateApplication = useApplicationStore((state) => state.updateApplication);
updateApplication('1', { status: 'interview' });
```

##### `deleteApplication(id: string): void`

Delete an application by ID.

```typescript
const deleteApplication = useApplicationStore((state) => state.deleteApplication);
deleteApplication('1');
```

##### `getApplicationById(id: string): Application | undefined`

Get a single application by ID.

```typescript
const getApplicationById = useApplicationStore((state) => state.getApplicationById);
const application = getApplicationById('1');
```

##### `getApplicationsByStatus(status: ApplicationStatus): Application[]`

Get all applications with a specific status.

```typescript
const getApplicationsByStatus = useApplicationStore((state) => state.getApplicationsByStatus);
const appliedApps = getApplicationsByStatus('applied');
```

##### `getApplicationsByCompany(company: string): Application[]`

Get all applications for a specific company.

```typescript
const getApplicationsByCompany = useApplicationStore((state) => state.getApplicationsByCompany);
const techCorpApps = getApplicationsByCompany('Tech Corp');
```

---

### Interview Store

```typescript
import { useInterviewStore } from '@/store/interviewStore';
```

#### State

```typescript
interface InterviewStore {
  interviews: Interview[];
}
```

#### Actions

##### `addInterview(interview: Interview): void`

Add a new interview.

```typescript
const addInterview = useInterviewStore((state) => state.addInterview);
addInterview({
  id: '1',
  applicationId: 'app-1',
  type: 'technical',
  date: '2025-10-20T14:00:00Z',
  duration: 60,
  isRemote: true,
  status: 'scheduled',
});
```

##### `updateInterview(id: string, updates: Partial<Interview>): void`

Update an interview.

```typescript
const updateInterview = useInterviewStore((state) => state.updateInterview);
updateInterview('1', { status: 'completed' });
```

##### `deleteInterview(id: string): void`

Delete an interview.

```typescript
const deleteInterview = useInterviewStore((state) => state.deleteInterview);
deleteInterview('1');
```

##### `getInterviewsByApplication(applicationId: string): Interview[]`

Get all interviews for a specific application.

```typescript
const getInterviewsByApplication = useInterviewStore((state) => state.getInterviewsByApplication);
const interviews = getInterviewsByApplication('app-1');
```

##### `getUpcomingInterviews(): Interview[]`

Get all upcoming (scheduled) interviews sorted by date.

```typescript
const getUpcomingInterviews = useInterviewStore((state) => state.getUpcomingInterviews);
const upcoming = getUpcomingInterviews();
```

##### `getPastInterviews(): Interview[]`

Get all past (completed or cancelled) interviews.

```typescript
const getPastInterviews = useInterviewStore((state) => state.getPastInterviews);
const past = getPastInterviews();
```

---

### Company Store

```typescript
import { useCompanyStore } from '@/store/companyStore';
```

#### State

```typescript
interface CompanyStore {
  companies: Company[];
}
```

#### Actions

##### `addCompany(company: Company): void`

Add a new company.

```typescript
const addCompany = useCompanyStore((state) => state.addCompany);
addCompany({
  id: '1',
  name: 'Tech Corp',
  website: 'https://techcorp.com',
  industry: 'Technology',
});
```

##### `updateCompany(id: string, updates: Partial<Company>): void`

Update a company.

```typescript
const updateCompany = useCompanyStore((state) => state.updateCompany);
updateCompany('1', { rating: 5 });
```

##### `deleteCompany(id: string): void`

Delete a company.

```typescript
const deleteCompany = useCompanyStore((state) => state.deleteCompany);
deleteCompany('1');
```

##### `getCompanyById(id: string): Company | undefined`

Get a company by ID.

```typescript
const getCompanyById = useCompanyStore((state) => state.getCompanyById);
const company = getCompanyById('1');
```

##### `getCompaniesByIndustry(industry: string): Company[]`

Get all companies in a specific industry.

```typescript
const getCompaniesByIndustry = useCompanyStore((state) => state.getCompaniesByIndustry);
const techCompanies = getCompaniesByIndustry('Technology');
```

---

### Document Store

```typescript
import { useDocumentStore } from '@/store/documentStore';
```

#### State

```typescript
interface DocumentStore {
  documents: Document[];
}
```

#### Actions

##### `addDocument(document: Document): void`

Add a new document.

```typescript
const addDocument = useDocumentStore((state) => state.addDocument);
addDocument({
  id: '1',
  name: 'Resume 2025.pdf',
  type: 'resume',
  fileType: 'application/pdf',
  size: 102400,
  url: 'blob:...',
  version: 1,
  uploadedAt: new Date().toISOString(),
});
```

##### `updateDocument(id: string, updates: Partial<Document>): void`

Update a document.

```typescript
const updateDocument = useDocumentStore((state) => state.updateDocument);
updateDocument('1', { tags: ['software', 'senior'] });
```

##### `deleteDocument(id: string): void`

Delete a document.

```typescript
const deleteDocument = useDocumentStore((state) => state.deleteDocument);
deleteDocument('1');
```

##### `getDocumentsByType(type: DocumentType): Document[]`

Get all documents of a specific type.

```typescript
const getDocumentsByType = useDocumentStore((state) => state.getDocumentsByType);
const resumes = getDocumentsByType('resume');
```

##### `getDocumentsByApplication(applicationId: string): Document[]`

Get all documents linked to an application.

```typescript
const getDocumentsByApplication = useDocumentStore((state) => state.getDocumentsByApplication);
const docs = getDocumentsByApplication('app-1');
```

---

### Settings Store

```typescript
import { useSettingsStore } from '@/store/settingsStore';
```

#### State

```typescript
interface SettingsStore {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  profile: UserProfile;
}
```

#### Actions

##### `setTheme(theme: 'light' | 'dark' | 'system'): void`

Set the theme preference.

```typescript
const setTheme = useSettingsStore((state) => state.setTheme);
setTheme('dark');
```

##### `updateNotificationSettings(settings: Partial<NotificationSettings>): void`

Update notification preferences.

```typescript
const updateNotificationSettings = useSettingsStore((state) => state.updateNotificationSettings);
updateNotificationSettings({
  interviewReminders: true,
  reminderTime: 60, // 1 hour before
});
```

##### `updateProfile(updates: Partial<UserProfile>): void`

Update user profile information.

```typescript
const updateProfile = useSettingsStore((state) => state.updateProfile);
updateProfile({
  name: 'John Doe',
  email: 'john@example.com',
});
```

---

## Hooks

### useApplications

```typescript
import { useApplications } from '@/hooks/useApplications';
```

Custom hook that provides application-related functionality with computed values.

```typescript
function MyComponent() {
  const {
    applications,
    activeApplications,
    archivedApplications,
    stats,
    addApplication,
    updateApplication,
    deleteApplication,
  } = useApplications();
  
  return (
    <div>
      <p>Total: {stats.total}</p>
      <p>Active: {stats.active}</p>
      <p>Response Rate: {stats.responseRate}%</p>
    </div>
  );
}
```

#### Returns

```typescript
{
  applications: Application[];
  activeApplications: Application[];
  archivedApplications: Application[];
  stats: {
    total: number;
    active: number;
    interviews: number;
    offers: number;
    responseRate: number;
    interviewRate: number;
    offerRate: number;
  };
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
}
```

---

### useInterviews

```typescript
import { useInterviews } from '@/hooks/useInterviews';
```

Custom hook for interview management with computed values.

```typescript
function MyComponent() {
  const {
    interviews,
    upcomingInterviews,
    pastInterviews,
    interviewsByDate,
    addInterview,
    updateInterview,
    deleteInterview,
  } = useInterviews();
  
  return (
    <div>
      <p>Upcoming: {upcomingInterviews.length}</p>
    </div>
  );
}
```

#### Returns

```typescript
{
  interviews: Interview[];
  upcomingInterviews: Interview[];
  pastInterviews: Interview[];
  interviewsByDate: Record<string, Interview[]>;
  addInterview: (interview: Interview) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
}
```

---

### useCompanies

```typescript
import { useCompanies } from '@/hooks/useCompanies';
```

Custom hook for company management.

```typescript
function MyComponent() {
  const {
    companies,
    companiesWithApplications,
    addCompany,
    updateCompany,
    deleteCompany,
  } = useCompanies();
  
  return <div>{companies.length} companies</div>;
}
```

#### Returns

```typescript
{
  companies: Company[];
  companiesWithApplications: (Company & { applicationCount: number })[];
  addCompany: (company: Company) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
}
```

---

### useDocuments

```typescript
import { useDocuments } from '@/hooks/useDocuments';
```

Custom hook for document management.

```typescript
function MyComponent() {
  const {
    documents,
    documentsByType,
    addDocument,
    updateDocument,
    deleteDocument,
    uploadDocument,
  } = useDocuments();
  
  return <div>{documents.length} documents</div>;
}
```

#### Returns

```typescript
{
  documents: Document[];
  documentsByType: Record<DocumentType, Document[]>;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  uploadDocument: (file: File, type: DocumentType) => Promise<Document>;
}
```

---

### useLocalStorage

```typescript
import { useLocalStorage } from '@/hooks/useLocalStorage';
```

Custom hook for localStorage with TypeScript typing.

```typescript
function MyComponent() {
  const [value, setValue, removeValue] = useLocalStorage('key', defaultValue);
  
  return (
    <button onClick={() => setValue('new value')}>
      Update
    </button>
  );
}
```

#### Parameters

- `key: string` - localStorage key
- `defaultValue: T` - Default value if key doesn't exist

#### Returns

```typescript
[
  value: T,
  setValue: (value: T) => void,
  removeValue: () => void
]
```

---

### useTheme

```typescript
import { useTheme } from '@/hooks/useTheme';
```

Custom hook for theme management.

```typescript
function MyComponent() {
  const { theme, setTheme, systemTheme, effectiveTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Current: {effectiveTheme}
    </button>
  );
}
```

#### Returns

```typescript
{
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  systemTheme: 'light' | 'dark';
  effectiveTheme: 'light' | 'dark';
}
```

---

### useNotifications

```typescript
import { useNotifications } from '@/hooks/useNotifications';
```

Custom hook for notification management.

```typescript
function MyComponent() {
  const { addNotification, removeNotification, clearNotifications } = useNotifications();
  
  const handleSuccess = () => {
    addNotification({
      type: 'success',
      message: 'Application added successfully',
    });
  };
  
  return <button onClick={handleSuccess}>Add</button>;
}
```

#### Returns

```typescript
{
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}
```

---

## Components

### UI Components

#### Button

```typescript
import { Button } from '@/components/ui/button';

<Button variant="default" size="default" onClick={handleClick}>
  Click me
</Button>
```

**Props**:
- `variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'`
- `size?: 'default' | 'sm' | 'lg' | 'icon'`
- `asChild?: boolean`
- Standard button props

---

#### Card

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>
```

---

#### Dialog

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

---

#### Input

```typescript
import { Input } from '@/components/ui/input';

<Input
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

#### Select

```typescript
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

#### Table

```typescript
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

#### Badge

```typescript
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

---

#### EmptyState

```typescript
import { EmptyState } from '@/components/ui/empty-state';
import { Inbox } from 'lucide-react';

<EmptyState
  icon={Inbox}
  title="No applications yet"
  description="Get started by adding your first job application"
  primaryAction={{
    label: 'Add Application',
    onClick: handleAdd,
  }}
  secondaryAction={{
    label: 'Learn More',
    onClick: handleLearnMore,
  }}
/>
```

**Props**:
- `icon: LucideIcon` - Icon to display
- `title: string` - Main heading
- `description?: string` - Description text
- `primaryAction?: { label: string; onClick: () => void }` - Primary action button
- `secondaryAction?: { label: string; onClick: () => void }` - Secondary action button

---

#### ErrorState

```typescript
import { ErrorState } from '@/components/ui/error-state';

<ErrorState
  title="Failed to load applications"
  description="There was an error loading your applications. Please try again."
  onRetry={handleRetry}
  mode="card" // or "alert"
/>
```

**Props**:
- `title: string` - Error title
- `description?: string` - Error description
- `onRetry?: () => void` - Retry callback
- `mode?: 'card' | 'alert'` - Display mode

---

#### Loading Skeletons

```typescript
import { CardSkeleton, TableSkeleton, ListSkeleton, DashboardSkeleton } from '@/components/ui/loading-skeletons';

// Card skeleton
<CardSkeleton />

// Table skeleton
<TableSkeleton rows={5} columns={4} />

// List skeleton
<ListSkeleton items={3} />

// Dashboard skeleton
<DashboardSkeleton />
```

---

### Accessibility Components

#### SkipNav

```typescript
import { SkipNav } from '@/components/a11y/SkipNav';

// In root layout
<SkipNav />
```

Provides skip navigation links for keyboard users.

---

#### VisuallyHidden

```typescript
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';

<VisuallyHidden>
  Screen reader only content
</VisuallyHidden>
```

Hides content visually while keeping it accessible to screen readers.

---

#### FocusTrap

```typescript
import { FocusTrap } from '@/components/a11y/FocusTrap';

<FocusTrap active={isModalOpen} onClose={handleClose}>
  <div>Modal content</div>
</FocusTrap>
```

**Props**:
- `active: boolean` - Whether focus trap is active
- `onClose?: () => void` - Callback when Escape is pressed
- `children: React.ReactNode` - Content to trap focus within

---

#### LiveRegion

```typescript
import { LiveRegion, useAnnouncer } from '@/components/a11y/LiveRegion';

// In component
function MyComponent() {
  const announce = useAnnouncer();
  
  const handleAction = () => {
    // Do something
    announce('Action completed successfully');
  };
  
  return <button onClick={handleAction}>Do Action</button>;
}

// In root layout
<GlobalAnnouncer />
```

---

### Application Components

#### ApplicationForm

```typescript
import { ApplicationForm } from '@/components/applications/ApplicationForm';

<ApplicationForm
  application={existingApplication} // Optional, for editing
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

**Props**:
- `application?: Application` - Existing application for editing
- `onSubmit: (application: Application) => void` - Submit callback
- `onCancel?: () => void` - Cancel callback

---

#### ApplicationList

```typescript
import { ApplicationList } from '@/components/applications/ApplicationList';

<ApplicationList
  applications={applications}
  onSelect={handleSelect}
  selectedId={selectedId}
/>
```

**Props**:
- `applications: Application[]` - Applications to display
- `onSelect?: (application: Application) => void` - Select callback
- `selectedId?: string` - Currently selected application ID

---

#### ApplicationBoard

```typescript
import { ApplicationBoard } from '@/components/applications/ApplicationBoard';

<ApplicationBoard
  applications={applications}
  onStatusChange={handleStatusChange}
/>
```

**Props**:
- `applications: Application[]` - Applications to display
- `onStatusChange: (id: string, status: ApplicationStatus) => void` - Status change callback

---

#### StatusBadge

```typescript
import { StatusBadge } from '@/components/applications/StatusBadge';

<StatusBadge status="applied" />
```

**Props**:
- `status: ApplicationStatus` - Status to display

---

### Analytics Components

#### AnalyticsDashboard

```typescript
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

<AnalyticsDashboard applications={applications} interviews={interviews} />
```

---

#### MetricCard

```typescript
import { MetricCard } from '@/components/analytics/MetricCard';

<MetricCard
  title="Total Applications"
  value={120}
  trend={12}
  trendLabel="vs last month"
  icon={FileText}
/>
```

**Props**:
- `title: string` - Metric title
- `value: number | string` - Metric value
- `trend?: number` - Trend percentage (positive or negative)
- `trendLabel?: string` - Trend label
- `icon?: LucideIcon` - Icon to display

---

## Utilities

### Class Name Utility

```typescript
import { cn } from '@/lib/utils';

const className = cn(
  'base-class',
  condition && 'conditional-class',
  { 'object-class': condition },
  'another-class'
);
```

Combines and merges Tailwind classes intelligently.

---

### Date Utilities

```typescript
import { formatDate, formatDateTime, formatRelativeTime } from '@/lib/utils';

formatDate('2025-10-18'); // "October 18, 2025"
formatDateTime('2025-10-18T14:30:00Z'); // "October 18, 2025 at 2:30 PM"
formatRelativeTime('2025-10-18'); // "today", "2 days ago", etc.
```

---

### ID Generation

```typescript
import { generateId } from '@/lib/utils';

const id = generateId(); // "550e8400-e29b-41d4-a716-446655440000"
```

---

### Debounce

```typescript
import { debounce } from '@/lib/utils';

const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 300);

<Input onChange={(e) => debouncedSearch(e.target.value)} />
```

---

### Browser Detection

```typescript
import { detectBrowser, isBrowserSupported, isTouchDevice, addBrowserClasses } from '@/lib/browser-detection';

// Detect browser
const browser = detectBrowser();
console.log(browser.name, browser.version, browser.os);

// Check support
if (!isBrowserSupported()) {
  showWarning();
}

// Check touch support
if (isTouchDevice()) {
  enableTouchFeatures();
}

// Add classes to HTML
addBrowserClasses();
// Adds: browser-chrome os-windows device-desktop
```

---

### Accessibility Utilities

```typescript
import { 
  announceToScreenReader, 
  getStatusAriaLabel,
  prefersReducedMotion,
  createFormFieldProps 
} from '@/lib/accessibility';

// Announce to screen reader
announceToScreenReader('Application saved successfully');

// Get ARIA label for status
const label = getStatusAriaLabel('applied'); // "Application submitted"

// Check reduced motion preference
if (prefersReducedMotion()) {
  disableAnimations();
}

// Generate form field props
const fieldProps = createFormFieldProps('email', 'Email address', 'Enter your email', true);
// Returns: { id, name, 'aria-label', 'aria-describedby', 'aria-required' }
```

---

### Keyboard Navigation

```typescript
import { Keys, isActionKey, handleListKeyDown, makeKeyboardAccessible } from '@/lib/keyboard';

// Check if key is action key (Enter/Space)
if (isActionKey(event)) {
  performAction();
}

// Handle list keyboard navigation
<div onKeyDown={(e) => handleListKeyDown(e, items, selectedIndex, setSelectedIndex)}>
  {items.map((item, index) => (
    <div key={index} tabIndex={index === selectedIndex ? 0 : -1}>
      {item}
    </div>
  ))}
</div>

// Make element keyboard accessible
<div 
  {...makeKeyboardAccessible(handleClick, 'Click to view details')}
>
  Content
</div>
```

---

### Export Utilities

```typescript
import { exportToCSV, exportToJSON, exportToPDF } from '@/lib/export';

// Export to CSV
exportToCSV(applications, 'applications.csv');

// Export to JSON
exportToJSON({ applications, interviews, companies }, 'data.json');

// Export to PDF
await exportToPDF(applications, 'applications.pdf');
```

---

## Types

### Application Types

```typescript
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

interface Application {
  id: string;
  position: string;
  company: string;
  status: ApplicationStatus;
  appliedDate: string;
  location?: string;
  jobType?: 'remote' | 'hybrid' | 'onsite';
  salaryRange?: SalaryRange;
  description?: string;
  url?: string;
  notes?: Note[];
  documents?: string[];
  contacts?: Contact[];
  createdAt: string;
  updatedAt: string;
}
```

---

### Interview Types

```typescript
type InterviewType =
  | 'phone-screen'
  | 'video-call'
  | 'onsite'
  | 'technical'
  | 'behavioral'
  | 'panel'
  | 'final';

type InterviewStatus = 'scheduled' | 'completed' | 'cancelled';

interface Interview {
  id: string;
  applicationId: string;
  type: InterviewType;
  date: string;
  duration: number;
  location?: string;
  isRemote: boolean;
  meetingLink?: string;
  interviewers?: Interviewer[];
  notes?: string;
  preparation?: string;
  followUpDate?: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
}
```

---

### Company Types

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

---

### Document Types

```typescript
type DocumentType =
  | 'resume'
  | 'cover-letter'
  | 'portfolio'
  | 'certification'
  | 'reference'
  | 'other';

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
```

---

### Notification Types

```typescript
type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: string;
}
```

---

*Last Updated: October 18, 2025*
*Version: 1.0.0*
