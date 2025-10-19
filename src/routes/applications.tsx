import { createFileRoute } from '@tanstack/react-router';
import { LayoutGrid, Plus, Table as TableIcon } from 'lucide-react';
import { useEffect } from 'react';
import { ApplicationDialog } from '@/components/features/applications/ApplicationDialog';
import { ApplicationFilters } from '@/components/features/applications/ApplicationFilters';
import { ApplicationsTable } from '@/components/features/applications/ApplicationsTable';
import { KanbanBoard } from '@/components/features/applications/KanbanBoard';
import { SavedFiltersDialog } from '@/components/features/filters/SavedFiltersDialog';
import { PageTransition } from '@/components/layout';

import { AnimatedButton } from '@/components/ui/animated-button';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { seedDatabase } from '@/lib/seed';
import { useApplicationsStore, useUIStore } from '@/stores';
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
      <div className="flex items-center justify-between mb-6">
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
            <AnimatedButton>
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </AnimatedButton>
          }
        />
      </div>

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
                onLoadFilter={(loadedFilters) =>
                  setFilters(loadedFilters as ApplicationFiltersType)
                }
              />
            </div>

            {/* Filters */}
            <ApplicationFilters />

            {/* View Content */}
            {activeView === 'table' ? <ApplicationsTable /> : <KanbanBoard />}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
