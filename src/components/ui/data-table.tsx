import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollIndicator } from '@/components/ui/scroll-indicator';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableHelpDialog } from '@/components/ui/table-help-dialog';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  storageKey?: string; // Key for localStorage persistence
  initialPageSize?: number; // Initial page size from settings
  hideToolbar?: boolean; // Hide the internal toolbar (search, help, columns)
  renderBulkActions?: (props: {
    selectedRows: TData[];
    table: ReturnType<typeof useReactTable<TData>>;
  }) => React.ReactNode;
  renderToolbarActions?: (props: {
    table: ReturnType<typeof useReactTable<TData>>;
  }) => React.ReactNode;
  renderRowContextMenu?: (row: TData, rowContent: React.ReactNode) => React.ReactNode;
  onTableReady?: (table: ReturnType<typeof useReactTable<TData>>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  storageKey,
  initialPageSize = 10,
  hideToolbar = false,
  renderBulkActions,
  renderToolbarActions,
  renderRowContextMenu,
  onTableReady,
}: DataTableProps<TData, TValue>) {
  // Load initial sorting from localStorage if available
  const [sorting, setSorting] = useState<SortingState>(() => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(`${storageKey}-sorting`);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Persist sorting to localStorage whenever it changes
  useEffect(() => {
    if (storageKey && sorting.length > 0) {
      localStorage.setItem(`${storageKey}-sorting`, JSON.stringify(sorting));
    }
  }, [sorting, storageKey]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableMultiSort: true, // Enable multi-column sorting
    maxMultiSortColCount: 3, // Limit to 3 columns
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Notify parent component when table is ready
  useEffect(() => {
    if (onTableReady) {
      onTableReady(table);
    }
  }, [table, onTableReady]);

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {renderBulkActions &&
        selectedRows.length > 0 &&
        renderBulkActions({
          selectedRows,
          table,
        })}

      {/* Toolbar */}
      {!hideToolbar && (
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            {searchKey && (
              <Input
                placeholder={searchPlaceholder}
                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
                onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
                className="h-8 w-[150px] lg:w-[250px]"
              />
            )}
            {/* Clear Sorting Button */}
            {sorting.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSorting([]);
                  if (storageKey) {
                    localStorage.removeItem(`${storageKey}-sorting`);
                  }
                }}
                className="h-8 px-2 lg:px-3"
              >
                Clear sorting ({sorting.length})
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {renderToolbarActions?.({ table })}
            <TableHelpDialog />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="relative">
        <div className="rounded-md border">
          <Table containerRef={tableContainerRef}>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const rowContent = (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );

                return renderRowContextMenu ? renderRowContextMenu(row.original, rowContent) : rowContent;
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <p className="text-sm font-medium">No results found</p>
                    {(columnFilters.length > 0 || sorting.length > 0) && (
                      <p className="text-xs">Try adjusting your filters or clearing the sort</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
        <ScrollIndicator containerRef={tableContainerRef} />
      </div>

      {/* Pagination */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          
          {/* Page Navigation - Center */}
          <div className="flex items-center gap-2">
            {/* Jump to first page */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            {/* Previous page */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {/* Page indicator */}
            <div className="flex items-center justify-center text-sm font-medium min-w-[100px]">
              Page {table.getPageCount() === 0 ? 0 : table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            {/* Next page */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {/* Jump to last page */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Rows per page - Right */}
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-background px-2 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
