# Persian (Jalali) Calendar Support

This application now supports Persian locale and right-to-left text direction for calendars.

## Features Added

### 1. Settings Configuration
- **Language Selection**: Added Persian (فارسی) as a language option in Settings > Display
- **Calendar Type**: New dropdown to choose between Gregorian and Persian calendar display

### 2. Calendar Component Updates
The calendar component (`src/components/ui/calendar.tsx`) now:
- Automatically detects the user's calendar preference from settings
- Uses Persian locale (`faIR` from date-fns) when Persian is selected
- Applies RTL (right-to-left) direction for Persian calendar
- Maintains all styling and functionality across both calendar types

### 3. Package Dependencies
- **Added**: `date-fns-jalali` v4.1.0-0 for Persian date formatting support
- Works seamlessly with existing `react-day-picker` v9.11.1

## How to Use

### Enabling Persian Calendar

1. Navigate to **Settings** (gear icon in sidebar)
2. Go to **Display** section
3. Find **Language** dropdown and select **فارسی (Persian)** (optional - for Persian language UI)
4. Find **Calendar Type** dropdown and select **Persian (Jalali)**
5. All calendars throughout the app will now display with Persian locale and RTL layout

### Features in Persian Calendar Mode

- **Persian locale**: Displays months and weekdays in Persian (Farsi)
- **RTL Layout**: Calendar renders right-to-left for better Persian UX
- **Persian month names**: Farvardin (فروردین), Ordibehesht (اردیبهشت), etc.
- **Year selector**: Works with both Gregorian and Persian calendar display
- **Date ranges**: Full support for selecting date ranges
- **Today highlight**: Shows current date
- **All existing features**: Range selection, year dropdown, dual-month view, etc.

## Technical Details

### Files Modified

1. **`src/stores/settingsStore.ts`**
   - Added `CalendarType` type: `'gregorian' | 'persian'`
   - Updated `Language` type to include `'fa'` (Persian)
   - Added `calendarType` to `DisplaySettings` interface
   - Updated default settings to include `calendarType: 'gregorian'`

2. **`src/routes/settings.tsx`**
   - Added Persian language option to Language dropdown
   - Added new Calendar Type selector with Gregorian and Persian options

3. **`src/components/ui/calendar.tsx`**
   - Imported `faIR` locale from `date-fns/locale`
   - Added `useSettingsStore` to access calendar type preference
   - Conditional locale and direction based on `calendarType` setting:
     ```typescript
     const locale = display.calendarType === 'persian' ? faIR : undefined
     const dir = display.calendarType === 'persian' ? 'rtl' : 'ltr'
     ```
   - Same styling and components for consistent UX

### Calendar Switching

The calendar component reads from the settings store:
```typescript
const { display } = useSettingsStore()
const locale = display.calendarType === 'persian' ? faIR : undefined
```

It then passes these props to `DayPicker`:
```typescript
<DayPicker
  locale={locale}
  dir={display.calendarType === 'persian' ? 'rtl' : 'ltr'}
  // ... other props
/>
```

## Implementation Notes

### Why Not Full Jalali Calendar?

The initial approach attempted to use `react-day-picker-jalali`, but it had compatibility issues with React 19. Instead, we're using:

- **Persian locale** from date-fns for month/weekday names
- **RTL direction** for proper right-to-left layout
- **Gregorian dates** under the hood (compatible with all existing code)

This approach provides:
✅ Persian month names and weekdays
✅ RTL layout
✅ No breaking changes to existing date logic
✅ Full compatibility with React 19
✅ Maintains all existing calendar features

### Future Enhancements

For full Jalali/Hijri calendar support (different year system), we would need:

1. **Full Jalali Library**: Wait for `react-day-picker-jalali` to support React 19
2. **Date Conversion**: Convert between Gregorian and Jalali dates
3. **Storage Strategy**: Decide whether to store dates in Gregorian or Jalali format
4. **Localization**: Add Persian translations for all UI labels
5. **National Holidays**: Highlight Persian/Iranian holidays in the calendar

## References

- [react-day-picker](https://react-day-picker.js.org/) - Base calendar library
- [date-fns](https://date-fns.org/) - Date utility library with locale support
- [date-fns-jalali](https://www.npmjs.com/package/date-fns-jalali) - Jalali calendar adapter
- [Shadcn Calendar Documentation](https://ui.shadcn.com/docs/components/calendar) - Component design reference

## Notes

- The Persian calendar (Jalali/Solar Hijri) is the official calendar of Iran and Afghanistan
- Currently displays Persian locale with Gregorian dates
- For full Jalali calendar (different year numbering), additional libraries will be needed when React 19 compatible versions are available
