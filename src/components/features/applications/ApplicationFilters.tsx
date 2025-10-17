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
import { useApplicationsStore } from '@/stores';
import type { ApplicationStatus } from '@/types';
import { APPLICATION_STATUSES, PRIORITY_LEVELS, WORK_TYPES } from '@/lib/constants';
import { Filter, X, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ApplicationFilters() {
  const { filters, setFilters } = useApplicationsStore();
  const [isOpen, setIsOpen] = useState(false);
  const dateFromId = useId();
  const dateToId = useId();

  // Extract current filter values
  const statusFilters = filters.status || [];
  const priorityFilters = filters.priority || [];
  const workTypeFilters = filters.workType || [];

  // Toggle filter functions
  const toggleStatusFilter = (status: ApplicationStatus) => {
    const newStatuses = statusFilters.includes(status)
      ? statusFilters.filter((s) => s !== status)
      : [...statusFilters, status];
    setFilters({ status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const togglePriorityFilter = (priority: 'low' | 'medium' | 'high') => {
    const newPriorities = priorityFilters.includes(priority)
      ? priorityFilters.filter((p) => p !== priority)
      : [...priorityFilters, priority];
    setFilters({ priority: newPriorities.length > 0 ? newPriorities : undefined });
  };

  const toggleWorkTypeFilter = (workType: 'remote' | 'hybrid' | 'onsite') => {
    const newWorkTypes = workTypeFilters.includes(workType)
      ? workTypeFilters.filter((w) => w !== workType)
      : [...workTypeFilters, workType];
    setFilters({ workType: newWorkTypes.length > 0 ? newWorkTypes : undefined });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  // Count active filters
  const activeFilterCount =
    statusFilters.length + priorityFilters.length + workTypeFilters.length;

  const hasDateFilters = filters.dateRange?.start || filters.dateRange?.end;
  const totalActiveFilters = activeFilterCount + (hasDateFilters ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(statusFilters.length > 0 && 'border-primary')}
            >
              <Filter className="mr-2 h-4 w-4" />
              Status
              {statusFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5">
                  {statusFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {APPLICATION_STATUSES.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={statusFilters.includes(status.value)}
                onCheckedChange={() => toggleStatusFilter(status.value)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn('w-2 h-2 rounded-full', `bg-${status.color}-500`)}
                  />
                  <span>{status.label}</span>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(priorityFilters.length > 0 && 'border-primary')}
            >
              Priority
              {priorityFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5">
                  {priorityFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {PRIORITY_LEVELS.map((priority) => (
              <DropdownMenuCheckboxItem
                key={priority.value}
                checked={priorityFilters.includes(priority.value)}
                onCheckedChange={() => togglePriorityFilter(priority.value)}
              >
                <span className="capitalize">{priority.label}</span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Work Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(workTypeFilters.length > 0 && 'border-primary')}
            >
              Work Type
              {workTypeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5">
                  {workTypeFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Filter by Work Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {WORK_TYPES.map((workType) => (
              <DropdownMenuCheckboxItem
                key={workType.value}
                checked={workTypeFilters.includes(workType.value)}
                onCheckedChange={() => toggleWorkTypeFilter(workType.value)}
              >
                <span className="capitalize">{workType.label}</span>
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
                <DropdownMenuLabel className="px-0">Applied Date Range</DropdownMenuLabel>
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
          
          {/* Status badges */}
          {statusFilters.map((status) => {
            const statusConfig = APPLICATION_STATUSES.find((s) => s.value === status);
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

          {/* Priority badges */}
          {priorityFilters.map((priority) => (
            <Badge key={priority} variant="secondary" className="gap-1 capitalize">
              {priority}
              <button
                type="button"
                onClick={() => togglePriorityFilter(priority)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {/* Work type badges */}
          {workTypeFilters.map((workType) => (
            <Badge key={workType} variant="secondary" className="gap-1 capitalize">
              {workType}
              <button
                type="button"
                onClick={() => toggleWorkTypeFilter(workType)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

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
