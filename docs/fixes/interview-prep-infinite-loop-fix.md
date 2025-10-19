# Interview Prep Infinite Loop Fix

## Issue Description

**Error**: "Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops."

**Trigger**: Clicking on the "Prep" tab in the navigation bar would cause the application to crash with the above error.

## Root Cause

The issue was in `InterviewPrepPage.tsx` on line 13:

```tsx
const stats = useInterviewPrepStore((state) => state.getStats());
```

### The Problem

1. `getStats()` is a function that calculates and returns statistics
2. Every time it's called, it returns a **new object** (even if the values are the same)
3. Zustand's selector compares the return value by reference
4. Since the object reference is always different, Zustand thinks the state changed
5. This triggers a re-render
6. The re-render calls `getStats()` again
7. Which returns a new object with a different reference
8. Which triggers another re-render
9. **Infinite loop** ⚠️

### Why This Happens

In JavaScript, objects are compared by reference, not by value:

```javascript
{} === {} // false - different references!
```

So even though the stats values might be identical, the object is recreated each time, creating a new reference.

## Solution

Instead of calling `getStats()` in the Zustand selector, we:

1. **Extract the raw data** using stable Zustand selectors
2. **Calculate stats using `useMemo`** which only recalculates when dependencies change

### Before (Broken)

```tsx
export function InterviewPrepPage() {
  const [activeTab, setActiveTab] = useState('questions');
  const stats = useInterviewPrepStore((state) => state.getStats()); // ❌ Creates infinite loop
  
  return (
    // ...
  );
}
```

### After (Fixed)

```tsx
export function InterviewPrepPage() {
  const [activeTab, setActiveTab] = useState('questions');
  
  // ✅ Get stable references to raw data
  const questions = useInterviewPrepStore((state) => state.questions);
  const answers = useInterviewPrepStore((state) => state.answers);
  const companyNotes = useInterviewPrepStore((state) => state.companyNotes);
  const challenges = useInterviewPrepStore((state) => state.challenges);
  const practiceSessions = useInterviewPrepStore((state) => state.practiceSessions);
  
  // ✅ Calculate stats with useMemo - only recalculates when data changes
  const stats = useMemo(() => {
    // ... calculation logic moved here from store
  }, [questions, answers, companyNotes, challenges, practiceSessions]);
  
  return (
    // ...
  );
}
```

## How useMemo Solves This

`useMemo` memoizes the calculation:
- It stores the result
- Only recalculates when dependencies change
- Returns the **same object reference** if dependencies haven't changed
- Breaks the infinite loop cycle

## Technical Details

### Files Modified
- `src/components/interview-prep/InterviewPrepPage.tsx`

### Changes Made

1. **Added `useMemo` import** from React
2. **Extracted raw data selectors** (questions, answers, companyNotes, challenges, practiceSessions)
3. **Moved stats calculation** from `getStats()` into a `useMemo` hook
4. **Added proper dependencies** to useMemo array

### Why We Keep getStats() in the Store

Even though we're not using it in this component anymore, `getStats()` is kept in the store because:
- It might be used elsewhere in the application
- It's a useful utility function
- No need to break other components that might use it safely

## Benefits of This Fix

1. ✅ **No More Infinite Loop**: Component renders normally
2. ✅ **Better Performance**: Stats only recalculate when data actually changes
3. ✅ **Stable References**: React's reconciliation works properly
4. ✅ **Predictable Behavior**: useMemo dependencies are explicit
5. ✅ **Maintainable**: Clear what data the stats depend on

## Testing

- ✅ TypeScript compilation: **Passed**
- ✅ Clicking "Prep" tab: **Works without error**
- ✅ Stats display correctly: **Yes**
- ✅ Stats update when data changes: **Yes**

## Best Practices Learned

### ❌ Don't Do This in Zustand Selectors

```tsx
// Bad - returns new object every time
const data = useStore((state) => state.computeData());
const data = useStore((state) => ({ a: state.a, b: state.b })); // new object!
const data = useStore((state) => state.items.map(...)); // new array!
```

### ✅ Do This Instead

```tsx
// Good - stable references
const items = useStore((state) => state.items);
const a = useStore((state) => state.a);
const b = useStore((state) => state.b);

// Then use useMemo for derived data
const data = useMemo(() => {
  return items.map(/* transform */);
}, [items]);
```

### Or Use Zustand's Shallow Comparison

```tsx
import { shallow } from 'zustand/shallow';

const { a, b } = useStore(
  (state) => ({ a: state.a, b: state.b }),
  shallow // shallow comparison for objects
);
```

## Related Issues

This pattern can cause infinite loops in:
- Any computed/derived state returned from selectors
- Object literals in selectors: `(state) => ({ x: state.x })`
- Array transformations in selectors: `(state) => state.items.map(...)`
- Function calls that return new objects: `(state) => state.getX()`

## Prevention

To prevent this issue in the future:

1. **Keep selectors simple** - return primitive values or direct state references
2. **Use useMemo** for computed values in components
3. **Use shallow comparison** from Zustand for object selectors
4. **Test navigation** thoroughly when adding new store selectors

---

**Status**: ✅ Fixed
**Date**: 2025-10-18
**Severity**: Critical (caused app crash)
**Impact**: Interview Prep page now loads without errors
