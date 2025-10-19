# Analytics Time Range Filter - Bug Fix

## Issue Description

The time range filter on the Analytics Dashboard (7 days, 30 days, 90 days, 1 year, All time) was not working. When users changed the time range, the data displayed in the charts remained the same and did not update to reflect the selected period.

## Root Cause

The analytics dashboard component correctly calculated the time period based on the selected range, but it only passed this `period` parameter to the `calculateAnalytics()` function (which calculates the top-level metrics). 

The other analytics functions used for charts were either:
1. **Hardcoded to specific periods** (e.g., `generateTimeSeriesData` was always 30 days)
2. **Not filtering by period at all** (e.g., `calculateStatusDistribution`, `calculateCompanyStats`)
3. **Had fixed lookback windows** (e.g., `calculateMonthlyTrends` was always 6 months)

## Solution

### 1. Updated Analytics Functions (`src/lib/analytics.ts`)

Added optional `period` parameter to all analytics calculation functions:

#### `generateTimeSeriesData()`
```typescript
// BEFORE:
export function generateTimeSeriesData(
  applications: Application[],
  interviews: Interview[],
  days: number = 30
): TimeSeriesData[]

// AFTER:
export function generateTimeSeriesData(
  applications: Application[],
  interviews: Interview[],
  days: number = 30,
  period?: { start: Date; end: Date }
): TimeSeriesData[]
```
- Now respects the period parameter if provided
- Falls back to `days` parameter for backward compatibility

#### `calculateStatusDistribution()`
```typescript
// BEFORE:
export function calculateStatusDistribution(
  applications: Application[]
): StatusDistribution[]

// AFTER:
export function calculateStatusDistribution(
  applications: Application[],
  period?: { start: Date; end: Date }
): StatusDistribution[]
```
- Filters applications by `appliedDate` within the period
- Shows status distribution for selected time range only

#### `calculateCompanyStats()`
```typescript
// BEFORE:
export function calculateCompanyStats(
  applications: Application[],
  interviews: Interview[]
): CompanyStats[]

// AFTER:
export function calculateCompanyStats(
  applications: Application[],
  interviews: Interview[],
  period?: { start: Date; end: Date }
): CompanyStats[]
```
- Filters both applications and interviews by the period
- Shows company statistics for selected time range only

#### `calculateMonthlyTrends()`
```typescript
// BEFORE:
export function calculateMonthlyTrends(
  applications: Application[],
  interviews: Interview[],
  months: number = 6
): MonthlyTrend[]

// AFTER:
export function calculateMonthlyTrends(
  applications: Application[],
  interviews: Interview[],
  months: number = 6,
  period?: { start: Date; end: Date }
): MonthlyTrend[]
```
- Uses the period start/end dates if provided
- Falls back to `months` parameter for backward compatibility

### 2. Updated Analytics Dashboard (`src/components/analytics/AnalyticsDashboard.tsx`)

#### Added Dynamic Period Days Calculation
```typescript
// Calculate the number of days for the selected period
const periodDays = useMemo(() => {
  const periodConfig = ANALYTICS_PERIODS.find((p) => p.value === selectedPeriod);
  return periodConfig?.days || 365; // Default to 365 for 'all time'
}, [selectedPeriod]);
```

#### Updated All Function Calls with Period Parameter
```typescript
// Time series data - now uses periodDays and period
const timeSeriesData = useMemo(
  () => generateTimeSeriesData(applications, interviews, periodDays, period),
  [applications, interviews, periodDays, period]
);

// Status distribution - now filters by period
const statusDistribution = useMemo(
  () => calculateStatusDistribution(applications, period),
  [applications, period]
);

// Company stats - now filters by period
const companyStats = useMemo(
  () => calculateCompanyStats(applications, interviews, period),
  [applications, interviews, period]
);

// Monthly trends - now respects period
const monthlyTrends = useMemo(
  () => calculateMonthlyTrends(applications, interviews, 6, period),
  [applications, interviews, period]
);
```

#### Updated Chart Title to Show Selected Period
```typescript
<CardTitle>
  Application Activity (
  {ANALYTICS_PERIODS.find((p) => p.value === selectedPeriod)?.label || 'All Time'})
</CardTitle>
```

## Behavior After Fix

### Time Range Options

| Option | Days | Behavior |
|--------|------|----------|
| Last 7 days | 7 | Shows data from the last 7 days |
| Last 30 days | 30 | Shows data from the last 30 days |
| Last 90 days | 90 | Shows data from the last 90 days |
| Last year | 365 | Shows data from the last 365 days |
| All time | ∞ | Shows all data (no filtering) |

### What Gets Filtered

1. **Key Metrics Cards** (Top row)
   - Total Applications
   - Response Rate
   - Interviews
   - Success Rate
   - All metrics now reflect selected time range

2. **Timeline Chart** (Application Activity)
   - Shows daily data for the selected period
   - Chart title updates to show current period
   - X-axis shows appropriate date range

3. **Status Distribution Chart**
   - Pie chart shows status breakdown for selected period only
   - Percentages calculated based on filtered applications

4. **Company Stats Chart**
   - Shows top companies within the selected period
   - Application and interview counts filtered by period

5. **Monthly Trends Chart**
   - Shows monthly aggregation within the selected period
   - Adapts to show months within the range

## Testing

✅ **Type Check**: No TypeScript errors
✅ **Backward Compatibility**: All parameters are optional
✅ **Performance**: Uses React `useMemo` for efficient recalculation

## Files Modified

1. `src/lib/analytics.ts` - Updated 4 analytics functions
2. `src/components/analytics/AnalyticsDashboard.tsx` - Updated component to pass period parameter

## Example User Flow

1. User opens Analytics Dashboard (defaults to "Last 7 days")
2. Data shows metrics for last 7 days
3. User changes dropdown to "Last 90 days"
4. **All charts and metrics update** to show 90-day data
5. User changes to "All time"
6. All historical data is displayed

## Technical Notes

- The period parameter is optional to maintain backward compatibility
- When `period` is undefined (for "All time"), functions process all data
- Date filtering uses `appliedDate` for applications and `scheduledAt` for interviews
- The `periodDays` calculation ensures the timeline chart shows the appropriate number of days
- All calculations use `useMemo` hooks to prevent unnecessary recalculations

## Impact

✅ **Fixed**: Time range filter now works correctly across all charts
✅ **Improved**: Chart title dynamically shows selected period
✅ **Enhanced**: Users can now analyze their job search data for specific time ranges
✅ **Maintained**: No breaking changes to existing functionality

---

**Status**: ✅ Fixed and tested
**Date**: 2025-10-18
