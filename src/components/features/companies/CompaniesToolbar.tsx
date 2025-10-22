import { LayoutGrid, Plus, Table as TableIcon, X, Download, FileDown, ChevronDown, List } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/ui/search-input';
import { useCompaniesStore } from '@/stores/companiesStore';
import { UnifiedFilters } from './UnifiedFilters';
import { SavedFiltersDialog } from './SavedFiltersDialog';
import type { Table } from '@tanstack/react-table';
import type { Company } from '@/types';

interface CompaniesToolbarProps {
  table?: Table<Company>;
  activeView: 'cards' | 'table' | 'list';
  onViewChange: (view: 'cards' | 'table' | 'list') => void;
  onAddCompany: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
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
  onClearFilters: () => void;
}

export function CompaniesToolbar({
  table,
  activeView,
  onViewChange,
  onAddCompany,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  activeFilterCount,
  onClearFilters,
}: CompaniesToolbarProps) {
  const { companies } = useCompaniesStore();
  const [savedFiltersOpen, setSavedFiltersOpen] = useState(false);

  const handleExportCSV = () => {
    // TODO: Implement company-specific export
    // For now, use same export functions but will need to adapt
    console.log('Exporting companies as CSV...');
  };

  const handleExportJSON = () => {
    // TODO: Implement company-specific export
    console.log('Exporting companies as JSON...');
  };

  return (
    <>
      {/* Single Row: Search, Filters, Actions */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {/* Left side: Search and Filters */}
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search companies..."
          className="w-full sm:w-auto sm:flex-1 sm:max-w-sm"
        />
        <UnifiedFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
          activeFilterCount={activeFilterCount}
          onOpenSavedFilters={() => setSavedFiltersOpen(true)}
        />
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Clear ({activeFilterCount})</span>
          </Button>
        )}

        {/* Spacer */}
        <div className="flex-1 hidden lg:block" />

        {/* Right side: View Toggle, Export, Columns, Add Company */}
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border">
            <Button
              variant={activeView === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('table')}
              className="rounded-r-none border-r"
              title="Table View"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={activeView === 'cards' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('cards')}
              className="rounded-none border-r"
              title="Cards View"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={activeView === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('list')}
              className="rounded-l-none"
              title="List View"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Companies</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV ({companies.length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>
                <Download className="mr-2 h-4 w-4" />
                Export as JSON ({companies.length})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Columns (only in table view) */}
          {activeView === 'table' && table && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <span className="hidden sm:inline">Columns</span>
                  <ChevronDown className="h-4 w-4 sm:ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
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
          )}

          {/* Add Company */}
          <Button onClick={onAddCompany} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Company</span>
          </Button>
        </div>
      </div>

      <SavedFiltersDialog
        open={savedFiltersOpen}
        onOpenChange={setSavedFiltersOpen}
        currentFilters={filters}
        onApplyFilter={onFiltersChange}
      />
    </>
  );
}
