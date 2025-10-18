import type { ReactNode } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  filters: FilterConfig[];
  onClearAll?: () => void;
  className?: string;
  children?: ReactNode;
}

export function FilterBar({ filters, onClearAll, className, children }: FilterBarProps) {
  const activeFiltersCount = filters.filter(f => f.value && f.value !== 'all').length;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters:</span>
        </div>

        {filters.map((filter) => (
          <Select
            key={filter.id}
            value={filter.value}
            onValueChange={filter.onChange}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filter.label}</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {children}

        {activeFiltersCount > 0 && onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-9 px-3"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {filters
            .filter(f => f.value && f.value !== 'all')
            .map((filter) => {
              const option = filter.options.find(o => o.value === filter.value);
              return (
                <Badge
                  key={filter.id}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  <span className="text-xs">
                    {filter.label}: {option?.label || filter.value}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => filter.onChange('all')}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
        </div>
      )}
    </div>
  );
}
