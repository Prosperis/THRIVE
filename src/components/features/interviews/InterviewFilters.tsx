import { Calendar as CalendarIcon, Filter, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { INTERVIEW_STATUSES, INTERVIEW_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useInterviewsStore } from '@/stores/interviewsStore';

interface InterviewFiltersProps {
  savedFiltersButton?: React.ReactNode;
}

export function InterviewFilters({ savedFiltersButton }: InterviewFiltersProps) {
  const { filters, setFilters } = useInterviewsStore();
  const [isOpen, setIsOpen] = useState(false);

  // Extract current filter values
  const typeFilters = filters.type || [];
  const statusFilters = filters.status || [];

  // Toggle filter functions
  const toggleTypeFilter = (
    type:
      | 'phone-screen'
      | 'video'
      | 'on-site'
      | 'technical'
      | 'behavioral'
      | 'panel'
      | 'final'
      | 'other'
  ) => {
    const newTypes = typeFilters.includes(type)
      ? typeFilters.filter((t) => t !== type)
      : [...typeFilters, type];
    setFilters({ type: newTypes.length > 0 ? newTypes : undefined });
  };

  const toggleStatusFilter = (
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show'
  ) => {
    const newStatuses = statusFilters.includes(status)
      ? statusFilters.filter((s) => s !== status)
      : [...statusFilters, status];
    setFilters({ status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const clearAllFilters = () => {
    setFilters({
      type: undefined,
      status: undefined,
      dateRange: undefined,
    });
  };

  // Count active filters
  const activeFilterCount = typeFilters.length + statusFilters.length;
  const hasDateFilters = filters.dateRange?.start || filters.dateRange?.end;
  const totalActiveFilters = activeFilterCount + (hasDateFilters ? 1 : 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('h-9', totalActiveFilters > 0 && 'border-primary bg-primary/5')}
        >
          <Filter className="mr-2 h-3.5 w-3.5" />
          Filters
          {totalActiveFilters > 0 && (
            <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
              {totalActiveFilters}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0" align="start">
        <div className="p-3 space-y-3">
          {/* Header with Saved Filters */}
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-sm">Filter Interviews</h4>
            <div className="flex items-center gap-1">
              {savedFiltersButton}
              {totalActiveFilters > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs">
                  <X className="mr-1 h-3 w-3" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Interview Type with Dropdown */}
          <div className="space-y-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center justify-between w-full px-2 py-1.5 -mx-2 rounded-md hover:bg-accent text-left group">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                      Interview Type
                    </span>
                    {typeFilters.length > 0 && (
                      <Badge variant="secondary" className="h-4 px-1.5 text-xs">
                        {typeFilters.length}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {INTERVIEW_TYPES.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => toggleTypeFilter(type.value)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{type.label}</span>
                      {typeFilters.includes(type.value) && (
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {typeFilters.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-2">
                {typeFilters.map((type) => {
                  const typeConfig = INTERVIEW_TYPES.find((t) => t.value === type);
                  return (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive/10"
                      onClick={() => toggleTypeFilter(type)}
                    >
                      {typeConfig?.label}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Status with Dropdown */}
          <div className="space-y-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center justify-between w-full px-2 py-1.5 -mx-2 rounded-md hover:bg-accent text-left group">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                      Status
                    </span>
                    {statusFilters.length > 0 && (
                      <Badge variant="secondary" className="h-4 px-1.5 text-xs">
                        {statusFilters.length}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {INTERVIEW_STATUSES.map((status) => (
                  <DropdownMenuItem
                    key={status.value}
                    onClick={() => toggleStatusFilter(status.value)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{status.label}</span>
                      {statusFilters.includes(status.value) && (
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {statusFilters.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-2">
                {statusFilters.map((status) => {
                  const statusConfig = INTERVIEW_STATUSES.find((s) => s.value === status);
                  return (
                    <Badge
                      key={status}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive/10"
                      onClick={() => toggleStatusFilter(status)}
                    >
                      {statusConfig?.label}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Date Range with Calendar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">Scheduled Date Range</div>
              {hasDateFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({ dateRange: undefined })}
                  className="h-5 text-xs px-2"
                >
                  <X className="mr-1 h-2.5 w-2.5" />
                  Clear
                </Button>
              )}
            </div>
            <div className="flex justify-center">
              <Calendar
                mode="range"
                selected={
                  filters.dateRange?.start && filters.dateRange?.end
                    ? {
                        from: filters.dateRange.start,
                        to: filters.dateRange.end,
                      }
                    : filters.dateRange?.start
                    ? { from: filters.dateRange.start, to: undefined }
                    : undefined
                }
                onSelect={(range) => {
                  if (range?.from) {
                    setFilters({
                      dateRange: {
                        start: range.from,
                        end: range.to,
                      },
                    });
                  } else {
                    setFilters({ dateRange: undefined });
                  }
                }}
                numberOfMonths={2}
                className="rounded-md border-0"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
