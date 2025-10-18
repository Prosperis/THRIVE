import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { PageTransition } from '@/components/layout';
import { ApplicationsTable } from '@/components/features/applications/ApplicationsTable';
import { KanbanBoard } from '@/components/features/applications/KanbanBoard';
import { ApplicationFilters } from '@/components/features/applications/ApplicationFilters';
import { ApplicationDialog } from '@/components/features/applications/ApplicationDialog';
import { SearchInput } from '@/components/ui/search-input';
import { SavedFiltersDialog } from '@/components/features/filters/SavedFiltersDialog';
import { useApplicationsStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Plus, Table as TableIcon, LayoutGrid } from 'lucide-react';
import { useUIStore } from '@/stores';
import { seedDatabase } from '@/lib/seed';
import type { ApplicationFilters as ApplicationFiltersType } from '@/types';

export const Route = createFileRoute('/applications')({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { fetchApplications, isLoading, filters, setFilters } = useApplicationsStore();
  const { activeView, setActiveView } = useUIStore();

  useEffect(() => {
    // Seed database with sample data on first load
    seedDatabase().then(() => {
      fetchApplications();
    });
  }, [fetchApplications]);

  return (
    <PageTransition>
      <PageHeader
        title="Applications"
        description="Track and manage your job applications"
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border">
              <Button
                variant={activeView === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('table')}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={activeView === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('kanban')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <ApplicationDialog
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Application
                </Button>
              }
            />
          </div>
        }
      />

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search and Saved Filters */}
            <div className="flex items-center gap-2">
              <SearchInput
                value={filters.searchQuery || ''}
                onChange={(value) => setFilters({ searchQuery: value || undefined })}
                placeholder="Search by position, company, or location..."
                className="flex-1 max-w-md"
              />
              <SavedFiltersDialog
                filterType="applications"
                currentFilters={filters}
                onLoadFilter={(loadedFilters) => setFilters(loadedFilters as ApplicationFiltersType)}
              />
            </div>

            {/* Filters */}
            <ApplicationFilters />

            {/* View Content */}
            {activeView === 'table' ? (
              <ApplicationsTable />
            ) : (
              <KanbanBoard />
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
