import { Filter, X, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { COMPANY_STATUSES, REMOTE_POLICIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface UnifiedFiltersProps {
  filters: {
    status?: string[];
    remotePolicy?: string[];
    researched?: boolean;
  };
  onFiltersChange: (filters: {
    status?: string[];
    remotePolicy?: string[];
    researched?: boolean;
  }) => void;
  activeFilterCount: number;
  onOpenSavedFilters?: () => void;
}

export function UnifiedFilters({ filters, onFiltersChange, activeFilterCount, onOpenSavedFilters }: UnifiedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract current filter values
  const statusFilters = filters.status || [];
  const remotePolicyFilters = filters.remotePolicy || [];
  const researchedFilter = filters.researched;

  // Toggle filter functions
  const toggleStatusFilter = (status: string) => {
    const newStatuses = statusFilters.includes(status)
      ? statusFilters.filter((s) => s !== status)
      : [...statusFilters, status];
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const toggleRemotePolicyFilter = (policy: string) => {
    const newPolicies = remotePolicyFilters.includes(policy)
      ? remotePolicyFilters.filter((p) => p !== policy)
      : [...remotePolicyFilters, policy];
    onFiltersChange({
      ...filters,
      remotePolicy: newPolicies.length > 0 ? newPolicies : undefined,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(activeFilterCount > 0 && 'border-primary bg-primary/5')}
        >
          <Filter className="h-4 w-4" />
          <span className="ml-2">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <h3 className="font-semibold text-xs">Filter Companies</h3>
          <div className="flex items-center gap-1">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={clearAllFilters}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="p-3 space-y-3">
            {/* Saved Filters */}
            {onOpenSavedFilters && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSavedFilters();
                  }}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Saved Filters
                </Button>
                <Separator />
              </>
            )}

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Status</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {COMPANY_STATUSES.map((status) => (
                  <div key={status.value} className="flex items-center space-x-1.5">
                    <Checkbox
                      id={`status-${status.value}`}
                      checked={statusFilters.includes(status.value)}
                      onCheckedChange={() => toggleStatusFilter(status.value)}
                      className="h-3.5 w-3.5"
                    />
                    <label
                      htmlFor={`status-${status.value}`}
                      className="text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <div className={cn('w-1.5 h-1.5 rounded-full', `bg-${status.color}-500`)} />
                      {status.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Remote Policy Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Remote Policy</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {REMOTE_POLICIES.map((policy) => (
                  <div key={policy.value} className="flex items-center space-x-1.5">
                    <Checkbox
                      id={`remote-${policy.value}`}
                      checked={remotePolicyFilters.includes(policy.value)}
                      onCheckedChange={() => toggleRemotePolicyFilter(policy.value)}
                      className="h-3.5 w-3.5"
                    />
                    <label
                      htmlFor={`remote-${policy.value}`}
                      className="text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="text-base">{policy.icon}</span>
                      {policy.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Researched Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Research Status</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant={researchedFilter === true ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, researched: true })}
                  className="flex-1"
                >
                  Researched
                </Button>
                <Button
                  variant={researchedFilter === false ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, researched: false })}
                  className="flex-1"
                >
                  Not Researched
                </Button>
              </div>
              {researchedFilter !== undefined && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, researched: undefined })}
                  className="w-full"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
