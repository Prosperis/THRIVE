# Documents Organization System

## Overview

The Documents page features an accordion-based sidebar that provides a collapsible, organized view of all your job application documents.

## Current Structure

### Accordion Sections

#### 1. **Resumes** 📄
- Expandable/collapsible section
- Shows count badge
- Lists all resume and CV documents
- Empty state with "Create Resume" button
- Document metadata: version number and last updated date

#### 2. **Cover Letters** ✉️
- Expandable/collapsible section
- Shows count badge
- Lists all cover letter documents
- Empty state with "Create Cover Letter" button
- Document metadata: version number and last updated date

#### 3. **Recently Deleted** 🗑️
- Only visible when there are deleted documents
- Shows documents deleted within the last N days (configurable in Settings)
- Visual distinction with destructive color scheme
- Actions per document:
  - **Restore**: Recover the document
  - **Delete Forever**: Permanently remove from database

## User Interface

### Accordion Benefits

✅ **Space Efficient**: Collapse sections you're not using  
✅ **Clear Organization**: Visual separation between document types  
✅ **Quick Navigation**: Expand multiple sections at once  
✅ **Always Accessible**: All documents just one click away  
✅ **Visual Feedback**: Active document highlighted  

### Default State

By default, both "Resumes" and "Cover Letters" sections are expanded for easy access.

### Document Items

Each document in the list shows:
- Document name (truncated if too long)
- Version number (e.g., "v1", "v2")
- Last updated date
- Active indicator (dot) if currently selected

## Settings Integration

### Auto-Delete Configuration

In **Settings > Data Management**:

- **Auto-Delete Days**: Documents in "Recently Deleted" older than this will be permanently deleted
- **Recently Deleted Days**: How many days to show documents in the "Recently Deleted" section

Default: 7 days for both settings

## Future Enhancements

### 1. Custom Folders 📁

**Vision**: Allow users to create their own organizational structure

```
Documents/
├── 📁 Tech Jobs
│   ├── Resume - Software Engineer.md
│   └── Cover Letter - Google.md
├── 📁 Finance Roles
│   ├── Resume - Financial Analyst.md
│   └── Cover Letter - Goldman Sachs.md
├── 📁 Generic Templates
│   └── Resume - Master Copy.md
└── 📁 Recently Deleted
```

**Features**:
- Create/rename/delete custom folders
- Drag-and-drop documents between folders
- Nested folders (up to 3 levels)
- Folder-specific filtering
- Quick search within folders

### 2. Document-Application Linking 🔗

**Vision**: Link documents to specific job applications

**Benefits**:
- Track which resume/cover letter was used for each application
- Quick access to application-specific documents
- Reuse documents across multiple applications
- Analytics: See which resume versions get the most responses

**UI Concept**:
```typescript
interface Document {
  // ... existing fields
  linkedApplications?: string[]; // Array of application IDs
  usageCount?: number; // How many applications use this doc
  lastUsed?: Date; // When last linked to an application
}
```

**Display**:
- Badge showing "Used in 3 applications"
- Click to see list of linked applications
- From application page, select existing document or create new

### 3. Smart Filtering 🔍

**Filters**:
- By folder
- By date range (created/modified)
- By usage (linked vs. unlinked)
- By version number
- By file type (Markdown, PDF, Rich Text)
- By tags (future feature)

### 4. Document Tags 🏷️

**Vision**: Add flexible categorization beyond folders

**Examples**:
- Industry: Tech, Finance, Healthcare
- Role Type: Senior, Junior, Management
- Status: Draft, Finalized, Archived
- Target: FAANG, Startup, Enterprise

### 5. Templates Library 📋

**Vision**: Pre-built professional templates

**Features**:
- Industry-specific resume templates
- Cover letter templates
- Quick customization
- Template marketplace (community-contributed)

### 6. Version Comparison 🔄

**Vision**: See what changed between document versions

**Features**:
- Side-by-side diff view
- Highlight changes (additions/deletions)
- Restore specific version
- Branch from old version

### 7. Collaboration 👥

**Vision**: Get feedback on documents

**Features**:
- Share document with mentors/friends
- Inline comments and suggestions
- Track changes mode
- Accept/reject suggestions

### 8. Export Options 📤

**Enhanced exports**:
- Bulk export all documents
- Export folder with structure
- Multiple format conversions
- Custom styling/themes for PDFs

## Technical Implementation

### Current Stack

```typescript
// Accordion from shadcn/ui
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Default open sections
<Accordion 
  type="multiple" 
  defaultValue={["resumes", "cover-letters"]}
>
  <AccordionItem value="resumes">
    {/* Resumes content */}
  </AccordionItem>
  <AccordionItem value="cover-letters">
    {/* Cover letters content */}
  </AccordionItem>
  <AccordionItem value="recently-deleted">
    {/* Deleted docs content */}
  </AccordionItem>
</Accordion>
```

### Future Data Model

```typescript
interface Folder {
  id: string;
  name: string;
  parentId?: string; // For nested folders
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Document {
  id: string;
  name: string;
  type: 'resume' | 'cv' | 'cover-letter' | 'other';
  folderId?: string; // Link to folder
  tags?: string[];
  linkedApplications?: string[];
  version: number;
  versions?: DocumentVersion[]; // Version history
  // ... other existing fields
}

interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: string;
  createdAt: Date;
  createdBy?: string;
  comment?: string; // Version description
}

interface DocumentLink {
  id: string;
  documentId: string;
  applicationId: string;
  linkedAt: Date;
  notes?: string;
}
```

### Drag-and-Drop Implementation

Using `@dnd-kit` (already in project):

```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

// Enable dragging documents between folders
// Enable reordering within folders
// Visual feedback during drag
```

## User Workflows

### Creating Custom Folder
1. Click "+ New Folder" button
2. Enter folder name
3. Optional: Choose icon and color
4. Folder appears in sidebar

### Moving Document to Folder
1. Drag document from list
2. Hover over target folder
3. Folder highlights
4. Drop to move

### Linking Document to Application
1. From Applications page, click on application
2. In application detail, click "Attach Document"
3. Dialog shows all available documents
4. Select document or create new
5. Document link saved, count updates

### Viewing Document Usage
1. Hover over document in sidebar
2. Tooltip shows: "Used in 3 applications"
3. Click document to see details
4. "Linked Applications" section shows list
5. Click application to navigate

## Best Practices

### Organization Tips

1. **Use Folders**: Group by job type, company, or status
2. **Version Consistently**: Update version when making significant changes
3. **Link Documents**: Always link documents to applications for tracking
4. **Regular Cleanup**: Review and delete outdated versions
5. **Descriptive Names**: Use clear, searchable document names

### Naming Conventions

**Resumes**:
- `Resume - Software Engineer - 2025`
- `Resume - Senior Dev - FAANG Focus`
- `CV - Academic Positions`

**Cover Letters**:
- `Cover Letter - Google - SWE`
- `Cover Letter - Startup - CTO Role`
- `Cover Letter - Generic Tech`

**Folders**:
- `🎯 Active Applications`
- `📁 Archive - 2024`
- `⭐ Templates`

## Migration Path

For implementing these features incrementally:

**Phase 1** (Current): ✅ Accordion-based organization  
**Phase 2**: Custom folders + drag-and-drop  
**Phase 3**: Document-application linking  
**Phase 4**: Tags and advanced filtering  
**Phase 5**: Templates library  
**Phase 6**: Version comparison  
**Phase 7**: Collaboration features  

Each phase builds on the previous, allowing gradual rollout while maintaining stability.
