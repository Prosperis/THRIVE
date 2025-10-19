import type { ColumnDef } from '@tanstack/react-table';
import {
  Copy,
  Download,
  ExternalLink,
  FileDown,
  Pencil,
  Settings,
  Trash2,
  Upload,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AnimatedStatusBadge } from '@/components/ui/animated-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { DataTable } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortableHeader } from '@/components/ui/sortable-header';
import { exportAndDownloadApplicationsCSV, exportAndDownloadApplicationsJSON } from '@/lib/export';
import { formatDate } from '@/lib/utils';
import { useApplicationsStore, useSettingsStore } from '@/stores';
import type { Application } from '@/types';
import { ApplicationDialog } from './ApplicationDialog';
import { BackupManagementDialog } from './BackupManagementDialog';
import { BulkActions } from './BulkActions';
import { CSVImportDialog } from './CSVImportDialog';
import { JSONImportDialog } from './JSONImportDialog';

const statusColors: Record<Application['status'], string> = {
  target: 'bg-gray-500',
  hunting: 'bg-blue-500',
  applied: 'bg-yellow-500',
  interviewing: 'bg-purple-500',
  offer: 'bg-green-500',
  accepted: 'bg-emerald-500',
  rejected: 'bg-red-500',
  withdrawn: 'bg-orange-500',
};

const priorityColors: Record<NonNullable<Application['priority']>, string> = {
  low: 'bg-gray-400',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
};

export function ApplicationsTable() {
  const { getFilteredApplications, deleteApplication } = useApplicationsStore();
  const { data: dataSettings } = useSettingsStore();
  const applications = getFilteredApplications();
  const [editingApplication, setEditingApplication] = useState<Application | undefined>(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCSVImportDialogOpen, setIsCSVImportDialogOpen] = useState(false);
  const [isJSONImportDialogOpen, setIsJSONImportDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);

  const handleEdit = useCallback((application: Application) => {
    setEditingApplication(application);
    setIsEditDialogOpen(true);
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
    // Small delay before clearing to avoid visual glitches
    setTimeout(() => setEditingApplication(undefined), 200);
  }, []);

  const handleDuplicate = useCallback((application: Application) => {
    // Create a copy of the application without id, dates, and status-dependent fields
    const duplicatedApp: Partial<Application> = {
      companyName: application.companyName,
      position: application.position,
      status: 'target', // Reset to target status
      location: application.location,
      workType: application.workType,
      employmentType: application.employmentType,
      salary: application.salary,
      jobUrl: application.jobUrl,
      jobDescription: application.jobDescription,
      notes: application.notes,
      tags: application.tags,
      priority: application.priority,
      source: application.source,
      referralName: application.referralName,
    };
    setEditingApplication(duplicatedApp as Application);
    setIsEditDialogOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'position',
        header: ({ column }) => <SortableHeader column={column}>Position</SortableHeader>,
        cell: ({ row }) => {
          return (
            <div>
              <div className="font-medium">{row.getValue('position')}</div>
              <div className="text-sm text-muted-foreground">{row.original.companyName}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'companyName',
        header: ({ column }) => <SortableHeader column={column}>Company</SortableHeader>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.getValue('companyName')}</div>;
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
        cell: ({ row }) => {
          const status = row.getValue('status') as Application['status'];
          return (
            <AnimatedStatusBadge status={status} className={statusColors[status]}>
              {status.replace('-', ' ')}
            </AnimatedStatusBadge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'priority',
        header: ({ column }) => <SortableHeader column={column}>Priority</SortableHeader>,
        cell: ({ row }) => {
          const priority = row.getValue('priority') as Application['priority'];
          if (!priority) return <span className="text-muted-foreground">-</span>;
          return (
            <Badge className={priorityColors[priority]} variant="outline">
              {priority}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => {
          const workType = row.original.workType;
          const location = row.getValue('location') as string;
          return (
            <div>
              <div>{location || 'Not specified'}</div>
              <div className="text-sm text-muted-foreground capitalize">{workType}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'salary.min',
        id: 'salary',
        header: ({ column }) => <SortableHeader column={column}>Salary</SortableHeader>,
        cell: ({ row }) => {
          const salary = row.original.salary;
          if (!salary?.min && !salary?.max)
            return <span className="text-muted-foreground">N/A</span>;

          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: salary?.currency || 'USD',
            maximumFractionDigits: 0,
          });

          if (salary?.min && salary?.max) {
            return (
              <div>
                <div>
                  {formatter.format(salary.min)} - {formatter.format(salary.max)}
                </div>
                {salary.period && (
                  <div className="text-sm text-muted-foreground">per {salary.period}</div>
                )}
              </div>
            );
          }

          return <span>{formatter.format(salary?.min || salary?.max || 0)}</span>;
        },
      },
      {
        accessorKey: 'appliedDate',
        header: ({ column }) => <SortableHeader column={column}>Applied</SortableHeader>,
        cell: ({ row }) => {
          const date = row.getValue('appliedDate') as Date | undefined;
          return date ? (
            formatDate(date)
          ) : (
            <span className="text-muted-foreground">Not applied</span>
          );
        },
      },
      {
        accessorKey: 'updatedAt',
        header: ({ column }) => <SortableHeader column={column}>Updated</SortableHeader>,
        cell: ({ row }) => {
          return formatDate(row.getValue('updatedAt'));
        },
      },
    ],
    []
  );

  const handleExportCSV = useCallback(() => {
    try {
      exportAndDownloadApplicationsCSV(applications);
      toast.success('Export Successful', {
        description: `Exported ${applications.length} applications to CSV`,
      });
    } catch (error) {
      toast.error('Export Failed', {
        description: 'Failed to export applications to CSV',
      });
      console.error('Export error:', error);
    }
  }, [applications]);

  const handleExportJSON = useCallback(() => {
    try {
      exportAndDownloadApplicationsJSON(applications);
      toast.success('Export Successful', {
        description: `Exported ${applications.length} applications to JSON`,
      });
    } catch (error) {
      toast.error('Export Failed', {
        description: 'Failed to export applications to JSON',
      });
      console.error('Export error:', error);
    }
  }, [applications]);

  return (
    <>
      <DataTable
        columns={columns}
        data={applications}
        searchKey="position"
        searchPlaceholder="Search positions..."
        storageKey="thrive-applications-table"
        initialPageSize={dataSettings.itemsPerPage}
        renderBulkActions={({ selectedRows, table }) => (
          <BulkActions
            selectedRows={selectedRows}
            onClearSelection={() => table.resetRowSelection()}
          />
        )}
        renderRowContextMenu={(application, rowContent) => (
          <ContextMenu key={application.id}>
            <ContextMenuTrigger asChild>
              {rowContent}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56">
              <ContextMenuItem onClick={() => handleEdit(application)}>
                <Pencil className="mr-2 h-4 w-4" />
                View/Edit Application
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleDuplicate(application)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Application
              </ContextMenuItem>
              <ContextMenuSeparator />
              {application.jobUrl && (
                <ContextMenuItem 
                  onClick={() => {
                    window.open(application.jobUrl, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Job Posting
                </ContextMenuItem>
              )}
              <ContextMenuSeparator />
              <ContextMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  if (
                    !dataSettings.confirmDelete ||
                    confirm(`Are you sure you want to delete "${application.position}"?`)
                  ) {
                    deleteApplication(application.id);
                    toast.success('Application Deleted', {
                      description: `${application.position} has been deleted`,
                    });
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Application
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )}
        renderToolbarActions={() => (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Import Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsCSVImportDialogOpen(true)}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Import from CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsJSONImportDialogOpen(true)}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Import from JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsBackupDialogOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Backup Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      />

      <ApplicationDialog
        application={editingApplication}
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
      />

      <CSVImportDialog open={isCSVImportDialogOpen} onOpenChange={setIsCSVImportDialogOpen} />

      <JSONImportDialog open={isJSONImportDialogOpen} onOpenChange={setIsJSONImportDialogOpen} />

      <BackupManagementDialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen} />
    </>
  );
}
