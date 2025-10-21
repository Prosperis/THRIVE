# Documents Page - Phase Roadmap

## Overview
This document outlines the remaining features and enhancements needed for the Documents page, organized into implementation phases.

---

## ✅ Completed Features

- [x] Modern chip-based filter UI with lucide icons
- [x] Filter popover positioned to right side
- [x] Condensed filter spacing and layout
- [x] Document type selection in upload dialog
- [x] File upload with base64 storage to IndexedDB
- [x] PDF rendering for uploaded files
- [x] Separate UI for uploaded PDFs (no format conversion tabs)
- [x] Edit button disabled for uploaded PDFs
- [x] Download button handles both uploaded and generated files
- [x] Responsive PDF width calculation
- [x] "Uploaded File" badge in document header
- [x] Clean uploaded PDF viewer UI
- [x] Drag-to-link documents with applications
- [x] Version history timeline view
- [x] Recently deleted section with restore/permanent delete
- [x] Basic search and filtering by type, usage, date, version
- [x] Multiple document format support (PDF, Markdown, Rich Text, Plain Text)

---

## 🚀 Phase 1: Custom Folders & Organization
**Priority**: HIGH  
**Estimated Time**: 8-12 hours  
**Target**: Next Sprint

### Features
- [ ] **1.1 Custom Folder Creation**
  - [ ] Create new folder dialog
  - [ ] Folder name input with validation
  - [ ] Folder icon picker (lucide-react icons)
  - [ ] Folder color picker (7 preset colors)
  - [ ] Folder creation with metadata (createdAt, updatedAt)
  - [ ] Add to IndexedDB schema

- [ ] **1.2 Folder Management**
  - [ ] Rename folder functionality
  - [ ] Delete folder (move documents to "Uncategorized")
  - [ ] Delete folder confirmation dialog
  - [ ] Folder settings/edit dialog
  - [ ] Default folders (cannot delete: Resumes, Cover Letters)

- [ ] **1.3 Folder UI in Sidebar**
  - [ ] Display custom folders in accordion
  - [ ] Folder expand/collapse state
  - [ ] Document count badge per folder
  - [ ] Empty folder state
  - [ ] "+ New Folder" button in sidebar header
  - [ ] Folder context menu (rename, delete, settings)

- [ ] **1.4 Nested Folders**
  - [ ] Support up to 3 levels of nesting
  - [ ] Parent-child folder relationships
  - [ ] Indented folder display
  - [ ] Breadcrumb navigation in folder view
  - [ ] Move folder into another folder

- [ ] **1.5 Document-to-Folder Assignment**
  - [ ] Add `folderId` field to Document type
  - [ ] Folder dropdown in create/edit document dialog
  - [ ] Move document to folder action
  - [ ] Bulk move documents to folder
  - [ ] "Uncategorized" folder for unassigned documents

- [ ] **1.6 Drag & Drop Organization**
  - [ ] Drag documents between folders
  - [ ] Drag documents onto folder in sidebar
  - [ ] Visual drop zone feedback
  - [ ] Prevent invalid drops
  - [ ] Drag to reorder documents within folder
  - [ ] Drag to reorder folders

- [ ] **1.7 Folder-Based Filtering**
  - [ ] Filter documents by selected folder
  - [ ] "All Folders" view option
  - [ ] Folder filter chip in filter popover
  - [ ] Show folder path in document metadata
  - [ ] Search within specific folder

### Data Model
```typescript
interface Folder {
  id: string;
  name: string;
  icon?: string; // lucide icon name
  color?: string; // preset color
  parentId?: string; // for nested folders
  order: number; // for custom sorting
  isDefault: boolean; // cannot delete
  createdAt: Date;
  updatedAt: Date;
}

interface Document {
  // ... existing fields
  folderId?: string; // null = "Uncategorized"
}
```

### Database Schema
```typescript
// Add to db.ts
folders: '++id, name, parentId, order, createdAt, updatedAt',
```

---

## 🏷️ Phase 2: Document Tagging System
**Priority**: MEDIUM  
**Estimated Time**: 6-8 hours  
**Target**: Sprint +1

### Features
- [ ] **2.1 Tag Management**
  - [ ] Create tag dialog with color picker
  - [ ] Tag name input with validation
  - [ ] Predefined tags (Technical, Creative, Executive, etc.)
  - [ ] Custom tag creation
  - [ ] Edit/delete tags
  - [ ] Tag list in settings

- [ ] **2.2 Document Tagging UI**
  - [ ] Tag selector in create/edit document dialog
  - [ ] Multi-select tag dropdown
  - [ ] Tag badges on document cards
  - [ ] Add/remove tags from document detail view
  - [ ] Quick tag from context menu
  - [ ] Tag suggestions based on document content

- [ ] **2.3 Tag Filtering**
  - [ ] Filter by tags in filter popover
  - [ ] Multi-tag filtering (AND/OR logic)
  - [ ] Tag filter chips
  - [ ] Tag-based search
  - [ ] Show document count per tag

- [ ] **2.4 Tag Analytics**
  - [ ] Most used tags
  - [ ] Tags usage chart
  - [ ] Documents per tag statistics
  - [ ] Tag performance metrics

### Data Model
```typescript
interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  usageCount: number;
}

interface Document {
  // ... existing fields
  tags?: string[]; // Array of tag IDs
}
```

---

## ⚡ Phase 3: Bulk Operations
**Priority**: MEDIUM  
**Estimated Time**: 5-7 hours  
**Target**: Sprint +2

### Features
- [ ] **3.1 Multi-Select Mode**
  - [ ] Checkbox on document cards
  - [ ] "Select All" option
  - [ ] "Select None" option
  - [ ] Select by filter criteria
  - [ ] Selection count indicator
  - [ ] Exit selection mode

- [ ] **3.2 Bulk Actions Toolbar**
  - [ ] Appears when documents selected
  - [ ] Bulk delete with confirmation
  - [ ] Bulk move to folder
  - [ ] Bulk add tags
  - [ ] Bulk remove tags
  - [ ] Bulk link to applications
  - [ ] Bulk export (download as ZIP)

- [ ] **3.3 Bulk Delete**
  - [ ] Confirmation dialog with count
  - [ ] Move to Recently Deleted
  - [ ] Success toast with undo option
  - [ ] Bulk permanent delete

- [ ] **3.4 Bulk Move**
  - [ ] Folder selector dialog
  - [ ] Move to existing folder
  - [ ] Create new folder and move
  - [ ] Progress indicator for large operations

- [ ] **3.5 Bulk Tag Management**
  - [ ] Add tags to multiple documents
  - [ ] Remove tags from multiple documents
  - [ ] Replace tags across documents

- [ ] **3.6 Bulk Export**
  - [ ] Export selected documents as ZIP
  - [ ] Include metadata file (JSON)
  - [ ] Format selection (PDF, Markdown, etc.)
  - [ ] Preserve folder structure in export

---

## 📝 Phase 4: Document Templates
**Priority**: MEDIUM  
**Estimated Time**: 6-10 hours  
**Target**: Sprint +3

### Features
- [ ] **4.1 Pre-Built Templates**
  - [ ] Software Engineer Resume template
  - [ ] Executive Resume template
  - [ ] Academic CV template
  - [ ] Cover Letter - Technical template
  - [ ] Cover Letter - Creative template
  - [ ] Portfolio template
  - [ ] 10+ industry-specific templates

- [ ] **4.2 Template Library**
  - [ ] Template gallery view
  - [ ] Template preview cards
  - [ ] Template categories
  - [ ] Template search
  - [ ] Template ratings/popularity
  - [ ] Template metadata (industry, role, experience level)

- [ ] **4.3 Template Selection UI**
  - [ ] "Use Template" button in create dialog
  - [ ] Template picker dialog
  - [ ] Template preview before selection
  - [ ] Customize template fields
  - [ ] Fill in placeholder variables

- [ ] **4.4 Custom Template Creation**
  - [ ] "Save as Template" option
  - [ ] Template name and description
  - [ ] Define template variables/placeholders
  - [ ] Template category selection
  - [ ] Template sharing (future: community templates)

- [ ] **4.5 Template Management**
  - [ ] My Templates section
  - [ ] Edit template content
  - [ ] Delete custom templates
  - [ ] Duplicate template
  - [ ] Template version control

### Data Model
```typescript
interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'resume' | 'cv' | 'cover-letter' | 'portfolio' | 'other';
  content: string;
  variables: { name: string; placeholder: string }[];
  isBuiltIn: boolean;
  isPublic: boolean;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  tags?: string[];
}
```

---

## 📊 Phase 5: Version Comparison Tools
**Priority**: MEDIUM  
**Estimated Time**: 5-8 hours  
**Target**: Sprint +4

### Features
- [ ] **5.1 Version Diff View**
  - [ ] Side-by-side version comparison
  - [ ] Inline diff highlighting
  - [ ] Added lines (green)
  - [ ] Removed lines (red)
  - [ ] Modified lines (yellow)
  - [ ] Word-level diff granularity

- [ ] **5.2 Version Comparison UI**
  - [ ] "Compare Versions" button in history tab
  - [ ] Version selector (compare v1 vs v3)
  - [ ] Diff view mode (side-by-side, unified, split)
  - [ ] Navigate between changes
  - [ ] Export diff as PDF

- [ ] **5.3 Version Rollback**
  - [ ] "Restore this version" button
  - [ ] Confirmation dialog
  - [ ] Create new version from old version
  - [ ] Rollback creates new version (preserves history)

- [ ] **5.4 Version Comments**
  - [ ] Add comment to version on save
  - [ ] View version comments in timeline
  - [ ] Edit version comments
  - [ ] Version change summary

- [ ] **5.5 Version Branching**
  - [ ] Create branch from version
  - [ ] Branch naming
  - [ ] Switch between branches
  - [ ] Merge branches
  - [ ] Branch visualization

### Implementation
```typescript
// Use diff library
import { diffLines, diffWords } from 'diff';
// Or use react-diff-viewer
import ReactDiffViewer from 'react-diff-viewer-continued';
```

---

## 📈 Phase 6: Advanced Analytics Dashboard
**Priority**: LOW  
**Estimated Time**: 8-12 hours  
**Target**: Sprint +5

### Features
- [ ] **6.1 Document Usage Statistics**
  - [ ] Total documents count
  - [ ] Documents by type (chart)
  - [ ] Documents by folder (chart)
  - [ ] Most/least used documents
  - [ ] Recently created documents
  - [ ] Recently updated documents

- [ ] **6.2 Success Metrics**
  - [ ] Interview rate per document
  - [ ] Offer rate per document
  - [ ] Response rate per document
  - [ ] Average time to response
  - [ ] Best performing documents
  - [ ] A/B testing insights

- [ ] **6.3 Version Analytics**
  - [ ] Total versions created
  - [ ] Average versions per document
  - [ ] Most edited documents
  - [ ] Version creation timeline
  - [ ] Major vs minor version ratio

- [ ] **6.4 Application Linking Analytics**
  - [ ] Documents linked to applications
  - [ ] Unlinked documents
  - [ ] Most linked document
  - [ ] Link success rate
  - [ ] Documents per application (average)

- [ ] **6.5 Analytics Visualizations**
  - [ ] Document type pie chart
  - [ ] Usage over time line chart
  - [ ] Success rate bar chart
  - [ ] Tag cloud visualization
  - [ ] Folder distribution chart

- [ ] **6.6 Export Analytics**
  - [ ] Export as PDF report
  - [ ] Export as CSV
  - [ ] Export as JSON
  - [ ] Share analytics link
  - [ ] Schedule analytics emails

### Implementation
```typescript
// Use charting library (already have recharts)
import { LineChart, BarChart, PieChart } from 'recharts';
```

---

## 🔍 Phase 7: Enhanced Search
**Priority**: MEDIUM  
**Estimated Time**: 6-8 hours  
**Target**: Sprint +6

### Features
- [ ] **7.1 Full-Text Search**
  - [ ] Search document content (not just names)
  - [ ] Search in all formats (Markdown, Rich Text, Plain)
  - [ ] Highlight search terms in results
  - [ ] Search result snippets with context

- [ ] **7.2 Advanced Search Filters**
  - [ ] File size range filter
  - [ ] Date range picker (created, modified)
  - [ ] Linked/unlinked filter
  - [ ] Tag filter (multiple tags)
  - [ ] Folder filter
  - [ ] MIME type filter

- [ ] **7.3 Search Suggestions**
  - [ ] Autocomplete document names
  - [ ] Recent searches
  - [ ] Popular searches
  - [ ] Suggested tags
  - [ ] Typo correction

- [ ] **7.4 Fuzzy Search**
  - [ ] Approximate string matching
  - [ ] Handle misspellings
  - [ ] Phonetic search
  - [ ] "Did you mean...?" suggestions

- [ ] **7.5 Search Within Folder**
  - [ ] Scope search to current folder
  - [ ] Search in nested folders
  - [ ] Folder path filter
  - [ ] Search breadcrumb

- [ ] **7.6 Saved Searches**
  - [ ] Save search criteria
  - [ ] Quick access to saved searches
  - [ ] Edit saved searches
  - [ ] Delete saved searches

### Implementation
```typescript
// Use Fuse.js for fuzzy search
import Fuse from 'fuse.js';

const fuse = new Fuse(documents, {
  keys: ['name', 'content', 'tags'],
  threshold: 0.3, // Fuzzy matching tolerance
});
```

---

## 🌐 Phase 8: Document Sharing & Export
**Priority**: LOW  
**Estimated Time**: 6-10 hours  
**Target**: Sprint +7

### Features
- [ ] **8.1 Document Thumbnails**
  - [ ] Generate PDF thumbnails
  - [ ] Thumbnail cache in IndexedDB
  - [ ] Thumbnail in document cards
  - [ ] Thumbnail in search results
  - [ ] Thumbnail preview on hover
  - [ ] Regenerate thumbnail on update

- [ ] **8.2 Quick Preview**
  - [ ] Preview popover on hover
  - [ ] First page preview for PDFs
  - [ ] Content preview for text documents
  - [ ] Preview in link dialog
  - [ ] Preview in search results

- [ ] **8.3 Bulk Export Enhancements**
  - [ ] Export entire folder as ZIP
  - [ ] Export with metadata (JSON manifest)
  - [ ] Include version history in export
  - [ ] Export selected format (PDF, Markdown, etc.)
  - [ ] Preserve folder structure

- [ ] **8.4 External Sharing** (Future)
  - [ ] Generate shareable link
  - [ ] Link expiration settings
  - [ ] Password protection
  - [ ] View/download permissions
  - [ ] Track link views
  - [ ] Revoke shared links

---

## 📅 Implementation Timeline

| Phase | Feature | Priority | Estimated Time | Target Sprint |
|-------|---------|----------|----------------|---------------|
| 1 | Custom Folders & Organization | HIGH | 8-12 hrs | Next |
| 2 | Document Tagging System | MEDIUM | 6-8 hrs | +1 |
| 3 | Bulk Operations | MEDIUM | 5-7 hrs | +2 |
| 4 | Document Templates | MEDIUM | 6-10 hrs | +3 |
| 5 | Version Comparison Tools | MEDIUM | 5-8 hrs | +4 |
| 6 | Advanced Analytics Dashboard | LOW | 8-12 hrs | +5 |
| 7 | Enhanced Search | MEDIUM | 6-8 hrs | +6 |
| 8 | Document Sharing & Export | LOW | 6-10 hrs | +7 |

**Total Estimated Time**: 50-75 hours  
**Estimated Completion**: 8-10 sprints (assuming 2-week sprints)

---

## 🎯 Success Metrics

### Phase 1 Success Criteria
- [ ] Users can create at least 3 custom folders
- [ ] Users can drag documents between folders
- [ ] Folder-based filtering works seamlessly
- [ ] 90% of documents are organized in folders

### Phase 2 Success Criteria
- [ ] Users create average of 5+ tags
- [ ] 70% of documents have at least 1 tag
- [ ] Tag filtering improves search time by 50%

### Phase 3 Success Criteria
- [ ] Bulk operations complete in <2 seconds for 100 documents
- [ ] Users perform bulk operations 3x more than individual operations
- [ ] Zero data loss during bulk operations

### Phase 4 Success Criteria
- [ ] 80% of new documents use templates
- [ ] Users create 2+ custom templates
- [ ] Template usage increases document creation speed by 60%

### Phase 5 Success Criteria
- [ ] Version comparison loads in <1 second
- [ ] Users compare versions before rollback 90% of the time
- [ ] Version comments used in 50% of version saves

### Phase 6 Success Criteria
- [ ] Analytics dashboard loads in <2 seconds
- [ ] Users check analytics at least weekly
- [ ] Success metrics help improve document performance by 30%

### Phase 7 Success Criteria
- [ ] Full-text search returns results in <500ms
- [ ] Fuzzy search reduces "no results" by 70%
- [ ] Saved searches used in 40% of search sessions

### Phase 8 Success Criteria
- [ ] Thumbnails generate in <2 seconds
- [ ] Export completes in <5 seconds for 50 documents
- [ ] Shared links accessed 5+ times per month

---

## 🔗 Dependencies

### External Libraries Needed
- `fuse.js` - Fuzzy search (Phase 7)
- `react-diff-viewer-continued` - Version diff view (Phase 5)
- `jszip` - Bulk export as ZIP (Phase 3, 8)
- `pdfjs-dist` - PDF thumbnail generation (Phase 8) *(already installed)*
- `recharts` - Analytics charts (Phase 6) *(may already be installed)*

### Database Schema Updates
- Add `folders` table (Phase 1)
- Add `tags` table (Phase 2)
- Add `templates` table (Phase 4)
- Add `folderId` to documents (Phase 1)
- Add `tags[]` to documents (Phase 2)

---

## 📝 Notes

- All phases are designed to be implemented independently
- Each phase includes comprehensive testing requirements
- UI/UX patterns should be consistent with existing design
- Performance benchmarks must be met before phase completion
- User feedback should guide priority adjustments

---

**Last Updated**: October 20, 2025  
**Status**: Planning Phase  
**Next Action**: Begin Phase 1 - Custom Folders & Organization
