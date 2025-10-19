# Troubleshooting Guide

This guide documents known issues, their solutions, and debugging tips for the Thrive application.

## Table of Contents

1. [Analytics Issues](#analytics-issues)
   - [Time Range Filter Not Working](#time-range-filter-not-working)
   - [Empty Charts](#empty-charts)
2. [Performance Issues](#performance-issues)
   - [Infinite Loop / Maximum Update Depth](#infinite-loop--maximum-update-depth)
3. [Build Issues](#build-issues)
   - [Missing Dependencies](#missing-dependencies)
4. [Common Issues](#common-issues)
5. [Debugging Tips](#debugging-tips)

---

## Analytics Issues

### Time Range Filter Not Working

**Symptom**: Time range dropdown (7 days, 30 days, 90 days, 1 year, All time) doesn't update charts.

**Root Cause**: Analytics functions weren't receiving the period parameter from the time range selector.

**Solution**: ✅ **FIXED**

The analytics functions have been updated to accept an optional `period` parameter:
- `generateTimeSeriesData()`
- `calculateStatusDistribution()`
- `calculateCompanyStats()`
- `calculateMonthlyTrends()`

All charts now properly filter data based on the selected time range.

**How to Verify**: 
1. Open Analytics Dashboard
2. Change time range dropdown
3. All charts should update to show data for that period

---

### Empty Charts

**Symptom**: Status Distribution and Top Companies charts appear blank/empty.

**Root Cause**: Charts were rendering even when no data was available, leaving users confused.

**Solution**: ✅ **FIXED**

Added comprehensive empty state handling for all charts:

| Chart | Empty State Icon | Message |
|-------|-----------------|---------|
| Status Distribution | Target | "No application data available" |
| Status Details | BarChart3 | "No status data to display" |
| Top Companies | Building2 | "No company data available" |
| Timeline | Calendar | "No activity data for this period" |
| Monthly Trends | TrendingUp | "No monthly trend data available" |
| Response Rate | Percent | "No response rate data available" |

Each empty state includes helpful guidance on how to populate the chart with data.

**How to Verify**:
1. Open Analytics Dashboard with no applications
2. Each chart should show a clear empty state with icon and message
3. Add some applications and verify charts populate

---

## Performance Issues

### Infinite Loop / Maximum Update Depth

**Symptom**: 
```
Error: Maximum update depth exceeded. This can happen when a component 
repeatedly calls setState inside componentWillUpdate or componentDidUpdate.
```

Occurs when clicking the "Prep" tab in navigation.

**Root Cause**: 
The Interview Prep page was calling `getStats()` in a Zustand selector, which returns a new object on every call. Since objects are compared by reference in JavaScript, this created an infinite render loop:

```tsx
// ❌ Bad - creates infinite loop
const stats = useInterviewPrepStore((state) => state.getStats());
```

**Solution**: ✅ **FIXED**

Extracted raw data with stable selectors and used `useMemo` for calculations:

```tsx
// ✅ Good - stable references
const questions = useInterviewPrepStore((state) => state.questions);
const answers = useInterviewPrepStore((state) => state.answers);
// ... other stable selectors

const stats = useMemo(() => {
  // Calculate stats here
}, [questions, answers, /* other dependencies */]);
```

**How to Verify**:
1. Click "Prep" tab in navigation
2. Page should load without errors
3. Statistics should display correctly

**Best Practices to Avoid This**:

❌ **Don't do this in Zustand selectors:**
```tsx
// Returns new object every time
const data = useStore((state) => state.computeData());
const data = useStore((state) => ({ a: state.a, b: state.b }));
const data = useStore((state) => state.items.map(...));
```

✅ **Do this instead:**
```tsx
// Get stable references
const items = useStore((state) => state.items);

// Use useMemo for derived data
const data = useMemo(() => {
  return items.map(/* transform */);
}, [items]);
```

---

## Build Issues

### Missing Dependencies

**Symptom**:
```
error TS2307: Cannot find module 'date-fns' or its corresponding 
type declarations.
```

Build fails with TypeScript errors about missing modules.

**Root Cause**: Required dependencies not installed in `package.json`.

**Solution**: ✅ **FIXED**

Installed missing `date-fns` package:

```bash
bun add date-fns
```

**Common Missing Dependencies and Their Purpose**:

| Package | Purpose | Install Command |
|---------|---------|-----------------|
| `date-fns` | Date formatting and manipulation | `bun add date-fns` |
| `gh-pages` | GitHub Pages deployment | `bun add -D gh-pages` |
| `@types/*` | TypeScript type definitions | `bun add -D @types/package-name` |

**How to Verify**:
```bash
bun run type-check  # Should pass
bun run build       # Should succeed
```

**Prevention**:
1. Always check `package.json` when adding imports
2. Run builds regularly during development
3. Use CI/CD to catch missing dependencies early
4. Commit `bun.lock` to track exact versions

---

## Common Issues

### Data Not Persisting

**Symptom**: Application data disappears after page reload.

**Possible Causes**:
1. Browser storage full
2. Private/incognito mode
3. Browser clearing storage
4. Storage quota exceeded

**Solutions**:
1. Check browser console for storage errors
2. Clear browser storage and try again
3. Use regular (non-private) browsing mode
4. Export data regularly as backup

### Slow Performance

**Symptom**: Application feels sluggish with many applications.

**Solutions**:
1. Use filters to reduce displayed items
2. Enable pagination if available
3. Archive old applications
4. Export and clear old data

### Import Errors

**Symptom**: Unable to import data or imported data appears incorrectly.

**Solutions**:
1. Verify CSV format matches expected structure
2. Check for required columns (title, company, status, etc.)
3. Ensure dates are in correct format
4. Remove special characters that might break parsing

---

## Debugging Tips

### Enable Debug Mode

Add this to browser console for verbose logging:
```javascript
localStorage.setItem('DEBUG', 'thrive:*');
```

### Check State

Inspect Zustand state in React DevTools:
1. Install React DevTools browser extension
2. Open DevTools → Components tab
3. Look for Zustand store in component tree

### Clear All Data

⚠️ **Warning**: This deletes everything!

```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Export Before Debugging

Always export your data before trying fixes:
1. Go to Export page
2. Click "Export All Data"
3. Save CSV/PDF to safe location

### Check Browser Compatibility

Verify you're using a supported browser:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### TypeScript Errors

If you see TypeScript errors during development:

```bash
# Check for type errors
bun run type-check

# Lint the codebase
bun run lint

# Fix auto-fixable issues
bun run lint:fix
```

### Network Issues

If analytics or monitoring isn't working:
1. Check browser console for network errors
2. Verify Sentry DSN is correct
3. Check Google Analytics tracking ID
4. Ensure ad blockers aren't interfering

---

## Getting More Help

If you encounter an issue not covered here:

1. **Search GitHub Issues**: [github.com/adriandarian/thrive/issues](https://github.com/adriandarian/thrive/issues)
2. **Check Developer Guide**: [Developer-Guide](Developer-Guide)
3. **Review API Reference**: [API-Reference](API-Reference)
4. **Open New Issue**: Provide:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots/error messages if applicable

---

## Fix Status Legend

- ✅ **FIXED** - Issue resolved in current version
- 🔄 **IN PROGRESS** - Fix is being worked on
- 📋 **PLANNED** - Fix scheduled for future release
- ⚠️ **KNOWN ISSUE** - Issue exists, workaround available

---

**Last Updated**: January 2025
