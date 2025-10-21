# Phase 1.7: Migration Testing Checklist

## ✅ Phase 1 Completion Status

### Phase 1.1-1.6: Completed
- ✅ Unified Company type (60+ fields)
- ✅ Enhanced companiesStore (12 new actions)
- ✅ Added company-specific constants
- ✅ Created migration script
- ✅ Updated CompanyResearchHub to use new store
- ✅ 7 commits created

### Phase 1.7: Migration Testing (In Progress)

## Testing Instructions

### 1. Check Migration Logs
**Location:** Browser DevTools Console  
**What to look for:**
```
[Company Migration] Starting automatic migration check...
[Company Migration] Found X company notes to migrate
[Company Migration] Successfully migrated X companies
[Company Migration] Migration completed successfully
```

**Or if already migrated:**
```
[Company Migration] Migration already completed, skipping
```

### 2. Verify localStorage
**Open DevTools → Application → Local Storage → http://localhost:5173**

Check for these keys:
- `companies-migration-completed`: Should be `"true"` after migration
- `companies-storage`: Should contain your companies data
- `interview-prep-storage`: Old store (should still exist but no longer used)

### 3. Test CRUD Operations

#### Create a New Company
1. Navigate to Companies page
2. Click "Add Company" button
3. Fill in required fields:
   - Company Name (required)
   - Founded year
   - Company size
   - Industry (comma-separated)
   - Remote policy (select)
   - Notes
   - Links (website, LinkedIn, etc.)
   - Ratings (1-5 stars for each category)
   - Pros/Cons (one per line)
   - Tech stack
   - Interview details
   - Salary range
4. Click "Save"
5. **Expected:** Company card appears in the list

#### Read/View Companies
1. Check that all migrated companies appear
2. Verify all fields display correctly:
   - Company name
   - Founded year
   - Size
   - Industry badges
   - Remote policy badge
   - Researched status
   - Ratings (star displays)
   - Links (clickable)
   - Notes content
   - Pros/Cons lists
   - Tech stack badges
   - Interview info
   - Salary range

#### Update a Company
1. Click "Edit" button on a company card
2. Modify several fields
3. Click "Save"
4. **Expected:** Changes persist after page refresh

#### Delete a Company
1. Click "Delete" button on a company card
2. **Expected:** Company removed from list
3. Refresh page
4. **Expected:** Company still deleted (persisted)

### 4. Test Filtering & Search

#### Search
1. Use search bar at top
2. Type company name
3. **Expected:** List filters to matching companies

#### Filter by Status
1. Use status filter dropdown
2. Select "Researching"
3. **Expected:** Only researching companies shown

#### Filter by Remote Policy
1. Use remote policy filter
2. Select "Full Remote"
3. **Expected:** Only full-remote companies shown

#### Sort
1. Use sort dropdown
2. Select "Recently Added"
3. **Expected:** Companies sorted by creation date (newest first)
4. Select "Company A-Z"
5. **Expected:** Companies sorted alphabetically

### 5. Test Stats Cards

Check that stats update correctly:
- **Total Companies:** Shows correct count
- **Researched:** Count of companies with researched=true
- **High Priority:** Count (if priority field is used)
- **Linked to Apps:** Count of companies with applicationIds.length > 0

### 6. Test Application Linking

1. Edit a company
2. Use "Link to Application" dropdown
3. Select an existing application
4. Save
5. **Expected:** Company card shows linked application badge/info

### 7. Test Migration Flag

To test migration doesn't run twice:
1. Open DevTools Console
2. Run: `localStorage.removeItem('companies-migration-completed')`
3. Refresh page
4. **Expected:** Migration runs again but checks for duplicates
5. Check console: Should see "Skipping duplicate company: [name]"

### 8. Test Data Persistence

1. Create a new company with all fields filled
2. Close browser tab completely
3. Reopen http://localhost:5173/companies
4. **Expected:** New company still exists with all data intact

### 9. Check for Errors

**Browser Console:**
- No red errors
- No React warnings about keys or props
- No Radix UI warnings about empty values

**TypeScript:**
```bash
bun run build
```
- Should complete without errors

## Known Issues (Pre-Phase 2)

These are expected and will be fixed in later phases:

1. ❌ No table view (Phase 2)
2. ❌ No advanced filtering toolbar (Phase 2)
3. ❌ No bulk operations UI (Phase 2)
4. ❌ Form is not using React Hook Form + Zod (Phase 3)
5. ❌ No currency dropdown in form (Phase 3)
6. ❌ Large 1000+ line component not split (Phase 2)
7. ❌ No tags support in UI (Phase 4)
8. ❌ No company comparison feature (Phase 5)
9. ❌ No export/analytics (Phase 6)

## Success Criteria for Phase 1.7

✅ All CRUD operations work correctly  
✅ Migration runs successfully (or skips if already completed)  
✅ Data persists across browser sessions  
✅ No console errors  
✅ No TypeScript compilation errors  
✅ Search and filters work  
✅ Stats update correctly  
✅ Application linking works  

## If Tests Pass → Ready for Phase 2!

Once all tests pass, Phase 1 is complete and we can begin:

**Phase 2: UI Modernization - Layout & Toolbar**
- Create CompaniesToolbar component
- Add table view with TanStack Table
- Add advanced filtering
- Extract CompanyCard component
- Split into smaller components
