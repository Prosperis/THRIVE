import type { Table } from '@tanstack/react-table';
import {
  ChevronDown,
  Download,
  FileDown,
  LayoutGrid,
  Plus,
  Settings,
  Table as TableIcon,
  Upload,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/ui/search-input';
import { TableHelpDialog } from '@/components/ui/table-help-dialog';
import { APPLICATION_STATUSES } from '@/lib/constants';
import { exportAndDownloadApplicationsCSV, exportAndDownloadApplicationsJSON } from '@/lib/export';
import { useApplicationsStore, useUIStore } from '@/stores';
import type { Application } from '@/types';
import { ApplicationDialog } from './ApplicationDialog';
import { BackupManagementDialog } from './BackupManagementDialog';
import { CSVImportDialog } from './CSVImportDialog';
import { JSONImportDialog } from './JSONImportDialog';
import { UnifiedFilters } from './UnifiedFilters';

interface ApplicationsToolbarProps {
  table?: Table<Application>;
}

export function ApplicationsToolbar({ table }: ApplicationsToolbarProps = {}) {
  const { filters, setFilters, applications } = useApplicationsStore();
  const { activeView, setActiveView } = useUIStore();

  const [isCSVImportDialogOpen, setIsCSVImportDialogOpen] = useState(false);
  const [isJSONImportDialogOpen, setIsJSONImportDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);

  const statusFilters = filters.status || [];
  const priorityFilters = filters.priority || [];
  const workTypeFilters = filters.workType || [];
  const employmentTypeFilters = filters.employmentType || [];
  const hasDateFilters = filters.dateRange?.start || filters.dateRange?.end;

  const activeFilterCount =
    statusFilters.length +
    priorityFilters.length +
    workTypeFilters.length +
    employmentTypeFilters.length +
    (hasDateFilters ? 1 : 0);

  const clearAllFilters = () =>
    setFilters({
      status: undefined,
      priority: undefined,
      workType: undefined,
      employmentType: undefined,
      dateRange: undefined,
    });

  const removeStatusFilter = (status: string) => {
    const newStatuses = statusFilters.filter((s) => s !== status);
    setFilters({ status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const removePriorityFilter = (priority: string) => {
    const newPriorities = priorityFilters.filter((p) => p !== priority);
    setFilters({ priority: newPriorities.length > 0 ? newPriorities : undefined });
  };

  const removeWorkTypeFilter = (workType: string) => {
    const newWorkTypes = workTypeFilters.filter((w) => w !== workType);
    setFilters({ workType: newWorkTypes.length > 0 ? newWorkTypes : undefined });
  };

  const removeEmploymentTypeFilter = (employmentType: string) => {
    const newTypes = employmentTypeFilters.filter((t) => t !== employmentType);
    setFilters({ employmentType: newTypes.length > 0 ? newTypes : undefined });
  };

  const handleExportCSV = () => {
    exportAndDownloadApplicationsCSV(applications);
  };

  const handleExportJSON = () => {
    exportAndDownloadApplicationsJSON(applications);
  };

  return (
    <>
      {/* Top Bar: View Toggle and New Application */}
      <div className="flex items-center justify-end gap-2 mb-6">
        <div className="flex items-center rounded-lg border">
          <Button
            variant={activeView === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('table')}
            className="rounded-r-none"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={activeView === 'kanban' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('kanban')}
            className="rounded-l-none"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
        <ApplicationDialog
          trigger={
            <AnimatedButton className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Application</span>
              <span className="sm:hidden">New</span>
            </AnimatedButton>
          }
        />
      </div>

      {/* Search and Filters Bar - Above Table */}
      <div className="space-y-4 mb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <SearchInput
              value={filters.searchQuery || ''}
              onChange={(value) => setFilters({ searchQuery: value || undefined })}
              placeholder="Search by position, company, or location..."
              className="w-full sm:w-auto sm:flex-1 sm:max-w-md"
            />
            <UnifiedFilters />
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Clear ({activeFilterCount})</span>
              </Button>
            )}
            <TableHelpDialog />
          </div>

          {/* Right side: Import/Export, Columns buttons */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileDown className="mr-2 h-4 w-4" />
                  Import/Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Import</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setIsCSVImportDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import from CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsJSONImportDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import from JSON
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Export</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleExportCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as JSON
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setIsBackupDialogOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Backup Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Only show Columns dropdown when in table view and table instance is available */}
            {activeView === 'table' && table && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
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
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {statusFilters.map((status) => {
            const statusConfig = APPLICATION_STATUSES.find((s) => s.value === status);
            return (
              <Badge key={status} variant="secondary" className="gap-1.5 pl-2 pr-1">
                {statusConfig?.label}
                <button
                  type="button"
                  onClick={() => removeStatusFilter(status)}
                  className="ml-0.5 hover:bg-muted rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${statusConfig?.label} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {priorityFilters.map((priority) => (
            <Badge key={priority} variant="secondary" className="gap-1.5 capitalize pl-2 pr-1">
              {priority}
              <button
                type="button"
                onClick={() => removePriorityFilter(priority)}
                className="ml-0.5 hover:bg-muted rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${priority} priority filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {workTypeFilters.map((workType) => (
            <Badge key={workType} variant="secondary" className="gap-1.5 capitalize pl-2 pr-1">
              {workType}
              <button
                type="button"
                onClick={() => removeWorkTypeFilter(workType)}
                className="ml-0.5 hover:bg-muted rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${workType} work type filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {employmentTypeFilters.map((employmentType) => (
            <Badge
              key={employmentType}
              variant="secondary"
              className="gap-1.5 capitalize pl-2 pr-1"
            >
              {employmentType.replace('-', ' ')}
              <button
                type="button"
                onClick={() => removeEmploymentTypeFilter(employmentType)}
                className="ml-0.5 hover:bg-muted rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${employmentType} employment type filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {hasDateFilters && (
            <Badge variant="secondary" className="gap-1.5 pl-2 pr-1">
              {filters.dateRange?.start && new Date(filters.dateRange.start).toLocaleDateString()} -{' '}
              {filters.dateRange?.end
                ? new Date(filters.dateRange.end).toLocaleDateString()
                : 'Now'}
              <button
                type="button"
                onClick={() => setFilters({ dateRange: undefined })}
                className="ml-0.5 hover:bg-muted rounded-full p-0.5 transition-colors"
                aria-label="Remove date range filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Dialogs */}
      <CSVImportDialog open={isCSVImportDialogOpen} onOpenChange={setIsCSVImportDialogOpen} />
      <JSONImportDialog open={isJSONImportDialogOpen} onOpenChange={setIsJSONImportDialogOpen} />
      <BackupManagementDialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen} />
    </>
  );
}
