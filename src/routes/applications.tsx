import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { ApplicationsTable } from '@/components/features/applications/ApplicationsTable';
import { ApplicationsToolbar } from '@/components/features/applications/ApplicationsToolbar';
import { KanbanBoard } from '@/components/features/applications/KanbanBoard';
import { PageTransition } from '@/components/layout';
import { seedDatabase } from '@/lib/seed';
import { useApplicationsStore, useUIStore, useDocumentsStore } from '@/stores';
import type { Application } from '@/types';

export const Route = createFileRoute('/applications')({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { fetchApplications, isLoading } = useApplicationsStore();
  const { activeView } = useUIStore();
  const { fetchDocuments } = useDocumentsStore();
  const [tableInstance, setTableInstance] = useState<Table<Application> | undefined>(undefined);

  useEffect(() => {
    // Seed database with sample data on first load
    seedDatabase().then(() => {
      fetchApplications();
      fetchDocuments();
    });
  }, [fetchApplications, fetchDocuments]);

  return (
    <PageTransition>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Consolidated Toolbar */}
          <ApplicationsToolbar table={tableInstance} />

          {/* View Content */}
          {activeView === 'table' ? (
            <ApplicationsTable onTableReady={setTableInstance} />
          ) : (
            <KanbanBoard />
          )}
        </div>
      )}
    </PageTransition>
  );
}
