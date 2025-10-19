import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  children: React.ReactNode;
  className?: string;
}

/**
 * SortableHeader Component
 *
 * A reusable table header with sorting capabilities.
 *
 * Features:
 * - Click to toggle between: none → asc → desc → none
 * - Visual indicators: ArrowUp (asc), ArrowDown (desc), ArrowUpDown (none)
 * - Multi-column sorting: Hold Shift while clicking to add secondary sorts
 * - Sort order numbers displayed for multi-sort (e.g., "2" for second sort column)
 * - Hover effects for better UX
 *
 * Usage:
 * ```tsx
 * header: ({ column }) => (
 *   <SortableHeader column={column}>Column Name</SortableHeader>
 * )
 * ```
 */
export function SortableHeader<TData, TValue>({
  column,
  children,
  className,
}: SortableHeaderProps<TData, TValue>) {
  const sorted = column.getIsSorted();
  const sortIndex = column.getSortIndex();
  const canSort = column.getCanSort();

  if (!canSort) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sorted === 'asc', true)} // true for multi-sort with Shift
      className={cn('hover:bg-accent', className)}
    >
      {children}
      <div className="ml-2 flex items-center">
        {sorted === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : sorted === 'desc' ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        )}
        {/* Show sort order number for multi-sort */}
        {sorted && sortIndex !== -1 && sortIndex > 0 && (
          <span className="ml-1 text-xs text-muted-foreground">{sortIndex + 1}</span>
        )}
      </div>
    </Button>
  );
}
