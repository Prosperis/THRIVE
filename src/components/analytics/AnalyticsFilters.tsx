import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter, RotateCcw } from 'lucide-react';
import { APPLICATION_STATUSES, PRIORITY_LEVELS, WORK_TYPES } from '@/lib/constants';
import type { Application } from '@/types';

export interface AnalyticsFilters {
  statuses: string[];
  companyNames: string[];
  workTypes: string[];
  priorities: string[];
  tags: string[];
  source?: string;
}

interface AnalyticsFiltersProps {
  applications: Application[];
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  onReset: () => void;
}

export function AnalyticsFiltersPanel({
  applications,
  filters,
  onFiltersChange,
  onReset,
}: AnalyticsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract unique values from applications (companyNames are used inline in the component)
  
  const uniqueSources = Array.from(
    new Set(
      applications
        .map((app) => (app as Application & { source?: string }).source)
        .filter(Boolean)
    )
  );

  const uniqueTags = Array.from(
    new Set(applications.flatMap((app) => app.tags || []))
  );

  const addFilter = (key: keyof AnalyticsFilters, value: string) => {
    const currentValues = filters[key] as string[];
    if (Array.isArray(currentValues)) {
      if (!currentValues.includes(value)) {
        onFiltersChange({
          ...filters,
          [key]: [...currentValues, value],
        });
      }
    } else {
      onFiltersChange({
        ...filters,
        [key]: value,
      });
    }
  };

  const removeFilter = (key: keyof AnalyticsFilters, value: string) => {
    const currentValues = filters[key] as string[];
    if (Array.isArray(currentValues)) {
      onFiltersChange({
        ...filters,
        [key]: currentValues.filter((v) => v !== value),
      });
    } else {
      onFiltersChange({
        ...filters,
        [key]: undefined,
      });
    }
  };

  const hasActiveFilters =
    filters.statuses.length > 0 ||
    filters.companyNames.length > 0 ||
    filters.workTypes.length > 0 ||
    filters.priorities.length > 0 ||
    filters.tags.length > 0 ||
    !!filters.source;

  const activeFilterCount =
    filters.statuses.length +
    filters.companyNames.length +
    filters.workTypes.length +
    filters.priorities.length +
    filters.tags.length +
    (filters.source ? 1 : 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary">{activeFilterCount}</Badge>
              )}
            </CardTitle>
            <CardDescription>Filter analytics data by various criteria</CardDescription>
          </div>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select onValueChange={(value) => addFilter('statuses', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filters.statuses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.statuses.map((status) => (
                  <Badge key={status} variant="secondary">
                    {APPLICATION_STATUSES.find((s) => s.value === status)?.label || status}
                    <button
                      type="button"
                      onClick={() => removeFilter('statuses', status)}
                      className="ml-1 rounded-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Work Type Filter */}
          <div className="space-y-2">
            <Label>Work Type</Label>
            <Select onValueChange={(value) => addFilter('workTypes', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select work type..." />
              </SelectTrigger>
              <SelectContent>
                {WORK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filters.workTypes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.workTypes.map((type) => (
                  <Badge key={type} variant="secondary">
                    {WORK_TYPES.find((t) => t.value === type)?.label || type}
                    <button
                      type="button"
                      onClick={() => removeFilter('workTypes', type)}
                      className="ml-1 rounded-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select onValueChange={(value) => addFilter('priorities', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority..." />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_LEVELS.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filters.priorities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.priorities.map((priority) => (
                  <Badge key={priority} variant="secondary">
                    {PRIORITY_LEVELS.find((p) => p.value === priority)?.label || priority}
                    <button
                      type="button"
                      onClick={() => removeFilter('priorities', priority)}
                      className="ml-1 rounded-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Tags Filter */}
          {uniqueTags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <Select onValueChange={(value) => addFilter('tags', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tag..." />
                </SelectTrigger>
                <SelectContent>
                  {uniqueTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeFilter('tags', tag)}
                        className="ml-1 rounded-sm hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Source Filter */}
          {uniqueSources.length > 0 && (
            <div className="space-y-2">
              <Label>Application Source</Label>
              <Select
                value={filters.source || ''}
                onValueChange={(value) => addFilter('source', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All sources</SelectItem>
                  {uniqueSources.map((source) => (
                    <SelectItem key={source} value={source || ''}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="mb-2 text-sm font-medium">Active Filters</div>
              <div className="text-sm text-muted-foreground">
                Filtering {activeFilterCount} {activeFilterCount === 1 ? 'criteria' : 'criteria'}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Apply filters to applications
 */
export function applyAnalyticsFilters(
  applications: Application[],
  filters: AnalyticsFilters
): Application[] {
  return applications.filter((app) => {
    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(app.status)) {
      return false;
    }

    // Company filter
    if (filters.companyNames.length > 0 && !filters.companyNames.includes(app.companyName)) {
      return false;
    }

    // Work type filter
    if (filters.workTypes.length > 0 && !filters.workTypes.includes(app.workType || '')) {
      return false;
    }

    // Priority filter
    if (filters.priorities.length > 0 && app.priority && !filters.priorities.includes(app.priority)) {
      return false;
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) => app.tags?.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Source filter
    if (filters.source && (app as Application & { source?: string }).source !== filters.source) {
      return false;
    }

    return true;
  });
}
