import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInterviewsStore } from '@/stores/interviewsStore';
import { INTERVIEW_TYPES, INTERVIEW_STATUSES } from '@/lib/constants';
import { Filter, X, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InterviewFilters() {
  const { filters, setFilters } = useInterviewsStore();
  const [isOpen, setIsOpen] = useState(false);
  const dateFromId = useId();
  const dateToId = useId();

  // Extract current filter values
  const typeFilters = filters.type || [];
  const statusFilters = filters.status || [];

  // Toggle filter functions
  const toggleTypeFilter = (type: 'phone-screen' | 'video' | 'on-site' | 'technical' | 'behavioral' | 'panel' | 'final' | 'other') => {
    const newTypes = typeFilters.includes(type)
      ? typeFilters.filter((t) => t !== type)
      : [...typeFilters, type];
    setFilters({ type: newTypes.length > 0 ? newTypes : undefined });
  };

  const toggleStatusFilter = (status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show') => {
    const newStatuses = statusFilters.includes(status)
      ? statusFilters.filter((s) => s !== status)
      : [...statusFilters, status];
    setFilters({ status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  // Count active filters
  const activeFilterCount = typeFilters.length + statusFilters.length;
  const hasDateFilters = filters.dateRange?.start || filters.dateRange?.end;
  const totalActiveFilters = activeFilterCount + (hasDateFilters ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(typeFilters.length > 0 && 'border-primary')}
            >
              <Filter className="mr-2 h-4 w-4" />
              Type
              {typeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5">
                  {typeFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {INTERVIEW_TYPES.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={typeFilters.includes(type.value)}
                onCheckedChange={() => toggleTypeFilter(type.value)}
              >
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(statusFilters.length > 0 && 'border-primary')}
            >
              Status
              {statusFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5">
                  {statusFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {INTERVIEW_STATUSES.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={statusFilters.includes(status.value)}
                onCheckedChange={() => toggleStatusFilter(status.value)}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Range Filter */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(hasDateFilters && 'border-primary')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
              {hasDateFilters && (
                <Badge variant="secondary" className="ml-2 h-5">
                  1
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4">
              <div>
                <DropdownMenuLabel className="px-0">Scheduled Date Range</DropdownMenuLabel>
                <DropdownMenuSeparator />
              </div>
              <div className="space-y-3">
                <div>
                  <label htmlFor={dateFromId} className="text-sm font-medium mb-1 block">From</label>
                  <input
                    id={dateFromId}
                    type="date"
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                    value={filters.dateRange?.start ? new Date(filters.dateRange.start).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters({ 
                        dateRange: {
                          ...filters.dateRange,
                          start: value ? new Date(value) : undefined,
                        }
                      });
                    }}
                  />
                </div>
                <div>
                  <label htmlFor={dateToId} className="text-sm font-medium mb-1 block">To</label>
                  <input
                    id={dateToId}
                    type="date"
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                    value={filters.dateRange?.end ? new Date(filters.dateRange.end).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters({ 
                        dateRange: {
                          ...filters.dateRange,
                          end: value ? new Date(value) : undefined,
                        }
                      });
                    }}
                  />
                </div>
                {hasDateFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setFilters({ dateRange: undefined });
                    }}
                  >
                    Clear Date Range
                  </Button>
                )}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear All Filters */}
        {totalActiveFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear All ({totalActiveFilters})
          </Button>
        )}
      </div>

      {/* Active Filter Badges */}
      {totalActiveFilters > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {/* Type badges */}
          {typeFilters.map((type) => {
            const typeConfig = INTERVIEW_TYPES.find((t) => t.value === type);
            return (
              <Badge key={type} variant="secondary" className="gap-1">
                {typeConfig?.label}
                <button
                  type="button"
                  onClick={() => toggleTypeFilter(type)}
                  className="ml-1 hover:bg-muted rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}

          {/* Status badges */}
          {statusFilters.map((status) => {
            const statusConfig = INTERVIEW_STATUSES.find((s) => s.value === status);
            return (
              <Badge key={status} variant="secondary" className="gap-1">
                {statusConfig?.label}
                <button
                  type="button"
                  onClick={() => toggleStatusFilter(status)}
                  className="ml-1 hover:bg-muted rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}

          {/* Date range badge */}
          {hasDateFilters && (
            <Badge variant="secondary" className="gap-1">
              {filters.dateRange?.start && new Date(filters.dateRange.start).toLocaleDateString()} -{' '}
              {filters.dateRange?.end ? new Date(filters.dateRange.end).toLocaleDateString() : 'Now'}
              <button
                type="button"
                onClick={() => setFilters({ dateRange: undefined })}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
