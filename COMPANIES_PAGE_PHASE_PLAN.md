# Companies Page - Phase Plan & Roadmap

**Current Date:** October 21, 2025  
**Status:** Planning Phase  
**Priority:** High

---

## Executive Summary

The Companies page currently exists in **two different implementations**:
1. **CompanyResearchHub** (`src/components/interview-prep/CompanyResearchHub.tsx`) - 1107 lines, stores data in `interviewPrepStore` as `companyNotes`
2. **CompanyDialog/CompanyForm** (`src/components/features/companies/`) - Uses `companiesStore` and `Company` type

This creates **data inconsistency** and a **fragmented user experience**. The page needs consolidation, modernization, and feature parity with the recently improved Applications page.

---

## Current State Analysis

### ✅ What's Working

#### CompanyResearchHub (Current Active Component)
- **Rich data model** with comprehensive fields:
  - Basic info (name, founded, size, industry, remote policy)
  - Company links (website, LinkedIn, Glassdoor, careers, news)
  - Ratings system (6 categories: overall, work-life, compensation, career, management, culture)
  - Interview information (difficulty, experience, process details)
  - Culture notes, tech stack, benefits
  - Pros/cons lists
  - Salary range with currency
  - Employee reviews, news, competitor comparison
- **Search and filter** functionality (by name, industry, researched status)
- **Statistics cards** (total, researched, with applications, avg rating)
- **Application linking** (connects to applications store)
- **Card-based layout** with visual hierarchy
- **External links** to company resources

#### CompanyDialog/CompanyForm (Features Directory)
- **React Hook Form** with Zod validation
- **Clean form architecture** using shadcn/ui components
- **Industry and size dropdowns** from constants
- **Simpler data model** focused on core information
- **Better form UX** with proper validation messages

### ❌ Issues & Problems

#### Critical Issues
1. **Duplicate Stores:** `interviewPrepStore.companyNotes` vs `companiesStore.companies`
2. **Type Mismatch:** `CompanyPrepNote` vs `Company` interfaces
3. **Inconsistent Data:** Two sources of truth for company data
4. **Unused Components:** CompanyDialog/CompanyForm not integrated into route
5. **Store Migration Needed:** `companiesStore` exists but isn't used by active page

#### UI/UX Issues
1. **No unified toolbar** like Applications page
2. **Card layout only** - no table view or list view options
3. **Massive dialog form** (1000+ lines in dialog, hard to navigate)
4. **No bulk operations** (can't delete/export multiple companies)
5. **Limited filtering** (only search text and researched status)
6. **No sorting options** beyond hardcoded (researched → name)
7. **No pagination** for large company lists
8. **Text inputs for arrays** (tech stack, benefits, pros/cons as comma/newline separated)
9. **No visual indicators** for data completeness or quality
10. **No quick actions** (no context menu on cards)

#### Missing Features (compared to Applications page)
1. **No table view** with sortable columns
2. **No bulk selection** with checkboxes
3. **No advanced filters** (industry, size, rating, salary range)
4. **No saved filters** functionality
5. **No export options** (CSV, JSON, PDF)
6. **No import functionality**
7. **No data table toolbar** with view controls
8. **No scroll indicators**
9. **No sticky headers** (N/A for cards, but needed if table view added)
10. **No empty states** for filtered results (has basic empty state only)

#### Data Model Issues
1. **Salary currency as text input** (should be dropdown like Applications)
2. **Tech stack, benefits, pros/cons as text fields** (should use TagInput)
3. **No tags field** for custom categorization
4. **No priority field** for company tracking
5. **No status field** (e.g., "researching", "applied", "interviewing", "rejected")
6. **Rating inputs are numbers** (could be star pickers for better UX)
7. **No document linking** (company research documents, annual reports, etc.)
8. **No contact linking** (should connect to contacts at the company)

#### Technical Debt
1. **1107-line component** needs splitting into smaller components
2. **Form uses manual FormData** instead of React Hook Form
3. **No TypeScript validation** for form inputs
4. **Inline dialog content** (should be separate component)
5. **No loading states** during operations
6. **No error handling** for failed operations
7. **No optimistic updates**
8. **No keyboard shortcuts**

---

## Phase Roadmap

### Phase 0: Pre-Planning (Current Phase)
**Goal:** Analyze, document, and plan the migration strategy

**Tasks:**
- [x] Document current implementations
- [x] Identify data model conflicts
- [x] Create phase plan document
- [ ] Decision: Which store/type to keep?
- [ ] Plan data migration strategy
- [ ] Identify breaking changes

**Deliverables:**
- This document
- Migration strategy decision
- Data migration script (if needed)

---

### Phase 1: Foundation & Consolidation
**Goal:** Unify the data model and remove duplication

**Estimated Time:** 4-6 hours

#### 1.1 Data Model Unification
- [ ] **Decide on unified Company type**
  - Option A: Extend `Company` interface with `CompanyPrepNote` fields
  - Option B: Create new `CompanyResearch` type merging both
  - Recommendation: **Option A** - Keep `Company`, add research fields
- [ ] Update `Company` interface in `types/index.ts`
- [ ] Add missing fields:
  - `researched: boolean`
  - `companyLinks: { website, linkedin, glassdoor, careers, news }`
  - `ratings: { overall, workLifeBalance, compensation, careerGrowth, management, culture }`
  - `interviewDifficulty: 'easy' | 'medium' | 'hard'`
  - `interviewExperience: 'positive' | 'neutral' | 'negative'`
  - `interviewProcess: string`
  - `salaryRange: { min, max, currency }`
  - `employeeReviews: string`
  - `newsAndUpdates: string`
  - `competitorComparison: string`
  - `remotePolicy: 'full-remote' | 'hybrid' | 'on-site' | 'flexible'`
  - `founded: string`
  - `cultureNotes: string`
  - `status: 'target' | 'researching' | 'applied' | 'interviewing' | 'rejected' | 'not-interested'`
  - `priority: 'low' | 'medium' | 'high'`
  - `tags: string[]`
  - `contactIds: string[]` (link to contacts)
  - `documentIds: string[]` (link to research documents)

#### 1.2 Store Consolidation
- [ ] Migrate `companyNotes` data to `companiesStore`
- [ ] Create migration script in `scripts/migrate-company-data.ts`
- [ ] Remove `companyNotes` from `interviewPrepStore`
- [ ] Update all imports and references
- [ ] Add new actions to `companiesStore`:
  - `toggleResearched(id: string)`
  - `updateRating(id, category, value)`
  - `linkApplication(companyId, applicationId)`
  - `unlinkApplication(companyId, applicationId)`
  - `linkContact(companyId, contactId)`
  - `linkDocument(companyId, documentId)`

#### 1.3 Constants & Configuration
- [ ] Add to `lib/constants.ts`:
  - `COMPANY_STATUSES` (similar to APPLICATION_STATUSES)
  - `COMPANY_PRIORITIES`
  - `REMOTE_POLICIES` (move from component)
  - `INTERVIEW_DIFFICULTIES` (move from component)
  - `INTERVIEW_EXPERIENCES` (move from component)
  - `COMPANY_RATING_CATEGORIES`
- [ ] Add salary currencies (16 options like Applications)

**Deliverables:**
- Unified `Company` type with all fields
- Single source of truth in `companiesStore`
- Migration script
- Updated constants

---

### Phase 2: UI Modernization - Layout & Toolbar
**Goal:** Match Applications page quality with unified toolbar and view options

**Estimated Time:** 6-8 hours

#### 2.1 Create CompaniesToolbar Component
Similar to `ApplicationsToolbar`, create `src/components/features/companies/CompaniesToolbar.tsx`:
- [ ] **View toggle** (Cards / Table / List)
- [ ] **Add Company button** (opens dialog)
- [ ] **Search bar** (searches name, industry, location, notes)
- [ ] **Filter controls:**
  - Status dropdown (researching, applied, etc.)
  - Priority dropdown
  - Industry multi-select
  - Size dropdown
  - Remote policy dropdown
  - Rating range slider (1-5 stars)
  - Researched status toggle
  - Date range picker (created date)
- [ ] **Sort dropdown:**
  - Name (A-Z, Z-A)
  - Created date (newest, oldest)
  - Updated date (newest, oldest)
  - Overall rating (high to low, low to high)
  - Company size (largest to smallest)
  - Applications count
- [ ] **Bulk actions dropdown** (when items selected):
  - Delete selected
  - Mark as researched / not researched
  - Update priority
  - Update status
  - Export selected
- [ ] **Export button:**
  - Export all as CSV
  - Export all as JSON
  - Export selected
- [ ] **Clear filters button**

#### 2.2 Create UnifiedFilters Component
`src/components/features/companies/UnifiedFilters.tsx`:
- [ ] Collapsible filter panel
- [ ] All filter controls from toolbar
- [ ] Active filter badges with clear button
- [ ] Filter presets (e.g., "Top Rated", "Actively Researching", "Applied Companies")

#### 2.3 Create View Components

**Card View** (enhance existing):
- [ ] Extract to `src/components/features/companies/CompanyCard.tsx`
- [ ] Add checkbox for bulk selection
- [ ] Add context menu (right-click):
  - Edit
  - Delete
  - Duplicate
  - Mark researched
  - Open website
  - View applications
  - Link document
- [ ] Add quick action buttons
- [ ] Add data completeness indicator
- [ ] Add hover effects and animations

**Table View** (new):
- [ ] Create `src/components/features/companies/CompaniesTable.tsx`
- [ ] Use TanStack Table like Applications
- [ ] Columns:
  - Checkbox (bulk select)
  - Company Name (sortable, clickable)
  - Industry (badge)
  - Size (sortable)
  - Location
  - Status (badge with color)
  - Priority (badge)
  - Rating (star display, sortable)
  - Researched (checkmark icon)
  - Applications (count, clickable)
  - Remote Policy (icon + text)
  - Actions (edit/delete buttons)
- [ ] Sticky headers
- [ ] Row click opens details dialog
- [ ] Context menu on rows
- [ ] Scroll indicators

**List View** (new):
- [ ] Create `src/components/features/companies/CompanyList.tsx`
- [ ] Compact rows with key info
- [ ] Checkbox for selection
- [ ] Quick view expandable details
- [ ] Infinite scroll or pagination

#### 2.4 Update Route
- [ ] Update `src/routes/companies.tsx`
- [ ] Add view state management
- [ ] Integrate toolbar
- [ ] Add view switcher
- [ ] Add loading states
- [ ] Add error boundaries

**Deliverables:**
- Unified toolbar with all controls
- Three view options (Card, Table, List)
- Advanced filtering and sorting
- Bulk operations support

---

### Phase 3: Form Improvements
**Goal:** Modernize company form with better UX and validation

**Estimated Time:** 6-8 hours

#### 3.1 Restructure CompanyForm
- [ ] Convert to React Hook Form with Zod validation
- [ ] Split into tabbed interface:
  - **Tab 1: Basic Info** (name, website, industry, size, location, founded, remote policy)
  - **Tab 2: Research** (description, culture notes, tech stack, benefits, salary range)
  - **Tab 3: Analysis** (pros, cons, ratings, notes)
  - **Tab 4: Interview** (difficulty, experience, process, employee reviews)
  - **Tab 5: Links & Connections** (company links, applications, contacts, documents)
  - **Tab 6: Market Intel** (news, competitors, industry trends)
- [ ] Add progress indicator (fields completed)
- [ ] Add auto-save functionality
- [ ] Add keyboard shortcuts (Ctrl+S to save, Esc to cancel)

#### 3.2 Enhanced Form Fields
- [ ] **Currency dropdown** (like Applications) for salary
- [ ] **TagInput component** for:
  - Tech stack (chips)
  - Benefits (chips)
  - Industry tags (chips)
  - Custom tags (chips)
- [ ] **Star rating picker** for all rating categories (instead of number input)
- [ ] **Status dropdown** with descriptions
- [ ] **Priority dropdown** with colors
- [ ] **Remote policy dropdown** with icons
- [ ] **Interview difficulty** with color badges
- [ ] **Interview experience** with emojis
- [ ] **Date picker** for founded year (calendar or year picker)
- [ ] **Company size dropdown** (predefined ranges)
- [ ] **Industry multi-select** with search

#### 3.3 Smart Features
- [ ] **Auto-populate from website** (scrape company info if possible)
- [ ] **Duplicate detection** (warn if similar company name exists)
- [ ] **Related applications** section (show/link existing applications)
- [ ] **Related contacts** section (show/link contacts at company)
- [ ] **Document attachment** (link research docs, annual reports, etc.)
- [ ] **Rich text editor** for longer fields (culture notes, employee reviews)
- [ ] **Link preview** for company URLs (show favicon, title)
- [ ] **Validation warnings** for incomplete critical fields

#### 3.4 Dialog Improvements
- [ ] Resize dialog (make wider, taller)
- [ ] Add "Save & Add Another" button
- [ ] Add "Save & View" button (save and go to detail view)
- [ ] Add unsaved changes warning
- [ ] Add field-level error messages
- [ ] Add tooltips for field explanations
- [ ] Fix dropdown positioning (like Applications status fix)

**Deliverables:**
- Tabbed form interface
- React Hook Form with Zod validation
- TagInput for array fields
- Star rating pickers
- Smart auto-complete features

---

### Phase 4: Advanced Features
**Goal:** Add power-user features and integrations

**Estimated Time:** 8-10 hours

#### 4.1 Company Detail View
- [ ] Create `src/components/features/companies/CompanyDetailView.tsx`
- [ ] Full-page or side panel view
- [ ] Sections:
  - **Overview** (summary, key stats, quick actions)
  - **Research Notes** (expandable sections for each category)
  - **Ratings & Reviews** (visual rating display, pros/cons)
  - **Applications** (list of linked applications with status)
  - **Contacts** (list of contacts at company)
  - **Documents** (attached research materials)
  - **Interview Intel** (process, questions, tips)
  - **Timeline** (activity log, updates, applications)
  - **Competitor Analysis** (compare with similar companies)
- [ ] Edit mode toggle
- [ ] Quick action buttons
- [ ] Share/export company profile

#### 4.2 Bulk Operations
- [ ] Multi-select with checkboxes (all views)
- [ ] Bulk delete with confirmation
- [ ] Bulk update:
  - Status
  - Priority
  - Researched flag
  - Tags
- [ ] Bulk export:
  - CSV (selected fields)
  - JSON (full data)
  - PDF (formatted profiles)
- [ ] Select all / deselect all
- [ ] Select by filter (e.g., "Select all researched companies")

#### 4.3 Import/Export
- [ ] **Import companies from:**
  - CSV file (with field mapping)
  - JSON file
  - LinkedIn export
  - Glassdoor favorites
- [ ] **Export companies as:**
  - CSV (customizable columns)
  - JSON (full data)
  - PDF (company profiles)
  - Markdown (research notes)
- [ ] Import validation and error handling
- [ ] Duplicate detection during import
- [ ] Import preview before commit

#### 4.4 Search & Filter Enhancements
- [ ] **Saved filters** (like Applications page)
  - Save current filter state
  - Name and organize saved filters
  - Quick access to saved filters
  - Share filters (export filter config)
- [ ] **Advanced search:**
  - Full-text search across all fields
  - Boolean operators (AND, OR, NOT)
  - Field-specific search (e.g., "industry:technology")
  - Search in linked applications
  - Search in linked contacts
- [ ] **Filter presets:**
  - "Top Prospects" (high rating, not applied)
  - "Active Applications" (has linked applications)
  - "Need Research" (not researched, no notes)
  - "Recently Added" (created in last 7 days)
  - "High Priority" (priority = high)
  - "Remote-Friendly" (remote policy = full-remote or flexible)

#### 4.5 Data Quality & Validation
- [ ] **Completeness score** (% of fields filled)
- [ ] **Quality indicators:**
  - Red: Missing critical info (name, industry)
  - Yellow: Incomplete research (<50% fields)
  - Green: Well-researched (>80% fields)
- [ ] **Duplicate detection:**
  - Fuzzy name matching
  - Website URL matching
  - Suggest merge candidates
- [ ] **Data enrichment suggestions:**
  - "Add salary range"
  - "Add tech stack"
  - "Link to applications"
  - "Add company links"
- [ ] **Stale data warnings:**
  - "Last updated 6 months ago"
  - "No recent activity"
  - Suggest review/update

#### 4.6 Integration Features
- [ ] **Link to applications:**
  - From company card/detail view
  - Show all applications for company
  - Quick add application to company
  - See application status timeline
- [ ] **Link to contacts:**
  - Show contacts at company
  - Quick add contact to company
  - See contact communication history
- [ ] **Link to documents:**
  - Attach research documents
  - Annual reports, product docs, etc.
  - Version tracking
  - Preview in modal
- [ ] **Link to interviews:**
  - Show interview history with company
  - Link interview prep notes
  - Track interview rounds

**Deliverables:**
- Comprehensive detail view
- Bulk operations
- Import/export functionality
- Saved filters
- Data quality indicators
- Full integration with Applications, Contacts, Documents

---

### Phase 5: Analytics & Insights
**Goal:** Add intelligence and insights to company research

**Estimated Time:** 6-8 hours

#### 5.1 Company Analytics Dashboard
- [ ] Create analytics section in Companies page
- [ ] **Metrics:**
  - Total companies tracked
  - Researched vs not researched
  - Average rating by category
  - Application success rate by company
  - Top industries (chart)
  - Company size distribution (chart)
  - Remote policy distribution (chart)
  - Salary range analysis
  - Time spent researching (if tracked)
- [ ] **Visualizations:**
  - Rating radar chart (6 categories)
  - Industry pie chart
  - Salary histogram
  - Application funnel by company
  - Research completeness gauge
  - Timeline of company additions

#### 5.2 Comparison Tools
- [ ] **Company comparison view:**
  - Select 2-5 companies
  - Side-by-side comparison table
  - Highlight differences
  - Compare ratings (radar overlay)
  - Compare pros/cons
  - Compare salary ranges
  - Compare application outcomes
- [ ] **Industry benchmarking:**
  - Compare company to industry average
  - Show percentile rankings
  - Highlight outliers

#### 5.3 Recommendations
- [ ] **Suggested companies to research:**
  - Based on applied industries
  - Based on tech stack match
  - Based on location preferences
  - Based on salary expectations
- [ ] **Next actions:**
  - "3 companies need research updates"
  - "5 companies have no linked applications"
  - "Review companies last updated >3 months ago"
- [ ] **Insights:**
  - "You apply most to mid-size companies"
  - "Remote companies have higher success rate"
  - "Tech companies average 3.2 interview rounds"

#### 5.4 Reports
- [ ] **Generate reports:**
  - Company research summary (PDF)
  - Industry analysis report
  - Interview intel report
  - Top prospects report
- [ ] **Scheduled reports:**
  - Weekly research digest
  - Monthly company updates
  - Quarterly industry trends

**Deliverables:**
- Analytics dashboard
- Comparison tools
- Recommendation engine
- Report generation

---

### Phase 6: Polish & Optimization
**Goal:** Performance, accessibility, and finishing touches

**Estimated Time:** 4-6 hours

#### 6.1 Performance Optimization
- [ ] **Lazy loading:**
  - Load company cards/rows on scroll
  - Infinite scroll or pagination
  - Virtual scrolling for large lists
- [ ] **Memoization:**
  - Memoize expensive filters
  - Memoize sort operations
  - Memoize computed values
- [ ] **Debouncing:**
  - Search input debounce (300ms)
  - Filter changes debounce
- [ ] **Caching:**
  - Cache filtered results
  - Cache search results
  - Invalidate on data change

#### 6.2 Accessibility (a11y)
- [ ] **Keyboard navigation:**
  - Tab through cards/rows
  - Arrow keys for navigation
  - Enter to open details
  - Escape to close dialogs
  - Keyboard shortcuts (documented)
- [ ] **Screen reader support:**
  - Proper ARIA labels
  - Announce filter changes
  - Announce sort changes
  - Announce bulk actions
  - Live regions for updates
- [ ] **Focus management:**
  - Focus trap in dialogs
  - Return focus on close
  - Visible focus indicators
  - Skip links
- [ ] **Color contrast:**
  - Check all text/background combos
  - Status badge colors
  - Rating colors
  - Chart colors

#### 6.3 Responsive Design
- [ ] **Mobile optimization:**
  - Simplified toolbar (hamburger menu)
  - Stack cards vertically
  - Touch-friendly targets
  - Swipe gestures (delete, edit)
  - Mobile-optimized dialog
- [ ] **Tablet optimization:**
  - 2-column card layout
  - Adjusted table columns
  - Touch and mouse support
- [ ] **Breakpoint testing:**
  - Test at 320px, 768px, 1024px, 1440px, 1920px
  - Adjust card widths
  - Responsive table (horizontal scroll)

#### 6.4 Error Handling & Edge Cases
- [ ] **Error states:**
  - Failed to load companies
  - Failed to save company
  - Failed to delete company
  - Network errors
  - Validation errors
- [ ] **Empty states:**
  - No companies yet (first time)
  - No results from search
  - No results from filters
  - No applications linked
  - No contacts linked
- [ ] **Loading states:**
  - Initial load skeleton
  - Skeleton cards/rows
  - Save in progress
  - Delete in progress
  - Export in progress
- [ ] **Edge cases:**
  - Very long company names
  - Very long notes
  - Missing required fields
  - Invalid URLs
  - Large dataset (1000+ companies)
  - Slow network

#### 6.5 Testing
- [ ] **Unit tests:**
  - Store actions
  - Filter functions
  - Sort functions
  - Form validation
  - Utility functions
- [ ] **Integration tests:**
  - Add company flow
  - Edit company flow
  - Delete company flow
  - Bulk operations
  - Import/export
- [ ] **E2E tests:**
  - Full user journey
  - Company research workflow
  - Application linking
  - Search and filter
- [ ] **Accessibility tests:**
  - Axe DevTools scan
  - Keyboard navigation
  - Screen reader testing

#### 6.6 Documentation
- [ ] Update user guide in docs/user-guide/
- [ ] Add companies page section
- [ ] Document keyboard shortcuts
- [ ] Document import/export formats
- [ ] Add troubleshooting section
- [ ] Create video tutorial (optional)

**Deliverables:**
- Optimized performance
- Full accessibility compliance
- Responsive across all devices
- Comprehensive error handling
- Complete test coverage
- Updated documentation

---

## Priority Ranking

### 🔴 Critical (Must Do First)
1. **Phase 1.1-1.2:** Data model unification and store consolidation
2. **Phase 2.1:** Create CompaniesToolbar
3. **Phase 3.1-3.2:** Form restructure and enhanced fields

### 🟡 High (Do Soon)
4. **Phase 2.2-2.3:** Unified filters and view components
5. **Phase 4.2-4.3:** Bulk operations and import/export
6. **Phase 4.5:** Data quality indicators

### 🟢 Medium (Nice to Have)
7. **Phase 4.1:** Company detail view
8. **Phase 4.4:** Search & filter enhancements
9. **Phase 5.1:** Analytics dashboard

### 🔵 Low (Future Enhancements)
10. **Phase 5.2-5.3:** Comparison tools and recommendations
11. **Phase 5.4:** Reports
12. **Phase 6:** Polish and optimization (ongoing)

---

## Success Criteria

### Phase 1 Complete When:
- [ ] Single `Company` type with all fields
- [ ] Single `companiesStore` with all data
- [ ] Migration script tested and run
- [ ] All imports updated
- [ ] No TypeScript errors
- [ ] Data accessible in dev tools

### Phase 2 Complete When:
- [ ] Toolbar matches Applications quality
- [ ] All three views (Card, Table, List) working
- [ ] Filtering and sorting functional
- [ ] Bulk select and actions work
- [ ] No layout bugs or overlaps

### Phase 3 Complete When:
- [ ] Form uses React Hook Form + Zod
- [ ] All enhanced fields working (TagInput, star pickers, etc.)
- [ ] Form validation catches all errors
- [ ] Tabbed interface improves UX
- [ ] Can create and edit companies without issues

### Phase 4 Complete When:
- [ ] Detail view shows all company info
- [ ] Bulk operations work on multiple companies
- [ ] Import/export handles CSV and JSON
- [ ] Saved filters persist and load
- [ ] All integrations (apps, contacts, docs) functional

### Phase 5 Complete When:
- [ ] Analytics dashboard shows insights
- [ ] Comparison tool compares 2+ companies
- [ ] Recommendations are relevant
- [ ] Reports generate correctly

### Phase 6 Complete When:
- [ ] Page loads quickly (<2s for 100 companies)
- [ ] Passes WCAG 2.1 AA compliance
- [ ] Works on mobile, tablet, desktop
- [ ] All error states handled gracefully
- [ ] Test coverage >80%
- [ ] Documentation complete

---

## Technical Decisions Needed

### Decision 1: Data Migration Strategy
**Question:** How to migrate existing `companyNotes` to `companiesStore`?

**Options:**
- A) Runtime migration on app load (check if old data exists, migrate once)
- B) Manual migration script the user runs
- C) Dual-mode support (read from both stores, write to new store)

**Recommendation:** Option A with localStorage flag to track migration

---

### Decision 2: View Persistence
**Question:** Should view preference (Card/Table/List) persist?

**Options:**
- A) Session-only (resets on page reload)
- B) LocalStorage (persists across sessions)
- C) User settings in DB (syncs across devices if implemented)

**Recommendation:** Option B - localStorage, easy to implement

---

### Decision 3: Form Dialog Size
**Question:** Should company form be full-screen or dialog?

**Options:**
- A) Keep as dialog (max-w-4xl)
- B) Full-screen modal on smaller screens
- C) Dedicated route `/companies/new` and `/companies/:id/edit`

**Recommendation:** Option B - responsive (dialog on desktop, full-screen on mobile)

---

### Decision 4: Rating UI
**Question:** Number input or star picker for ratings?

**Options:**
- A) Number input (current, precise)
- B) Star picker (visual, intuitive, but limited to 0.5 increments)
- C) Slider (continuous, but hard to be precise)

**Recommendation:** Option B - star picker with half-star support

---

### Decision 5: Tech Stack Input
**Question:** How to handle tech stack and similar array inputs?

**Options:**
- A) Comma-separated text input (current, simple)
- B) TagInput component (visual chips, like Applications tags)
- C) Multi-select dropdown (predefined list)

**Recommendation:** Option B for custom tags, Option C for predefined (benefits, industries)

---

## Dependencies & Blockers

### Blockers (Must Resolve First)
- **None** - Can start Phase 1 immediately

### Dependencies
- **Phase 2 depends on Phase 1** (need unified store)
- **Phase 3 depends on Phase 1** (need unified type)
- **Phase 4 depends on Phase 2 & 3** (need views and form)
- **Phase 5 depends on Phase 4** (need complete data)
- **Phase 6 is ongoing** (can start anytime)

### External Dependencies
- TagInput component (already created in Applications work)
- Calendar component (already exists)
- Currency dropdown constants (already exists)
- Data table component (already exists)
- Scroll indicator (already created)

---

## Estimated Timeline

**Total Estimated Time:** 34-46 hours

### Aggressive Schedule (Full-time work)
- **Week 1:** Phase 1 + Phase 2 (Days 1-3: Phase 1, Days 4-5: Phase 2)
- **Week 2:** Phase 3 + Phase 4 start (Days 1-3: Phase 3, Days 4-5: Phase 4)
- **Week 3:** Phase 4 complete + Phase 5 (Days 1-2: Phase 4, Days 3-5: Phase 5)
- **Week 4:** Phase 6 + Buffer for testing and fixes

### Relaxed Schedule (Part-time work, 2-3 hours/day)
- **Weeks 1-2:** Phase 1 (consolidation and data model)
- **Weeks 3-4:** Phase 2 (UI modernization)
- **Weeks 5-6:** Phase 3 (form improvements)
- **Weeks 7-9:** Phase 4 (advanced features)
- **Weeks 10-11:** Phase 5 (analytics)
- **Week 12:** Phase 6 (polish)

---

## Next Steps

### Immediate Actions (Today)
1. **Review this plan** - Discuss and approve phases
2. **Make Decision 1** - Choose data migration strategy
3. **Set up Phase 1 branch** - `git checkout -b feature/companies-phase-1`
4. **Start Phase 1.1** - Update `Company` interface

### This Week
1. Complete Phase 1 (consolidation)
2. Test data migration thoroughly
3. Begin Phase 2.1 (toolbar)

### Tracking
- Use GitHub Projects or similar to track phase progress
- Create issues for each phase
- Update this document as phases complete
- Hold review meeting after each phase

---

## References

### Related Files
- `src/routes/companies.tsx` - Current route
- `src/components/interview-prep/CompanyResearchHub.tsx` - Current active component
- `src/components/features/companies/CompanyDialog.tsx` - Unused dialog
- `src/components/features/companies/CompanyForm.tsx` - Unused form
- `src/stores/companiesStore.ts` - Target store
- `src/stores/interviewPrepStore.ts` - Current store (companyNotes)
- `src/types/index.ts` - Company type (line 189)
- `src/types/interviewPrep.ts` - CompanyPrepNote type (line 41)

### Inspiration (Recently Completed)
- `src/components/features/applications/ApplicationsToolbar.tsx`
- `src/components/features/applications/ApplicationsTable.tsx`
- `src/components/features/applications/ApplicationForm.tsx`
- `src/components/ui/tag-input.tsx`
- `src/components/ui/scroll-indicator.tsx`

---

**Document Version:** 1.0  
**Last Updated:** October 21, 2025  
**Author:** GitHub Copilot  
**Status:** Draft - Pending Review
